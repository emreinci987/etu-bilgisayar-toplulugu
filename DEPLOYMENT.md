# Deployment — Docker ile Self-Host

Site, lab'ındaki 2. bilgisayarda (sunucu) Docker konteyneri olarak çalışır ve
`emre-inci.com` altındaki bir subdomain'den (örn. `topluluk.emre-inci.com`)
yayınlanır.

Mimari: **Dockerfile** (multi-stage) önce `node:20-alpine` ile `npm ci` +
`npm run build` çalıştırır, ardından `dist/` çıktısı `nginx:alpine` ile servis
edilir. Nginx konfigürasyonu `nginx.conf` içindedir (SPA fallback, gzip,
statik asset cache, temel güvenlik header'ları).

---

## a) Sunucuya Docker Kurulumu

Lab bilgisayarı Ubuntu/Debian tabanlı bir Linux varsayılmıştır (diğer
dağıtımlar için [Docker Engine dokümanına](https://docs.docker.com/engine/install/)
bak):

```bash
# Docker Engine + Compose plugin (resmî repo üzerinden)
curl -fsSL https://get.docker.com | sh

# Kullanıcıyı docker grubuna ekle (sudo'suz kullanım için)
sudo usermod -aG docker $USER
# Grup değişikliğinin etkinleşmesi için oturumu kapatıp tekrar aç

# Doğrulama
docker --version
docker compose version
```

macOS/Windows sunucu kullanılacaksa Docker Desktop yeterlidir.

---

## b) Repo'yu Çekme ve Çalıştırma

```bash
# Repo'yu çek (ilk kurulumda)
git clone <repo-url> etu-bilgisayar-toplulugu
cd etu-bilgisayar-toplulugu

# İmajı derle ve arka planda başlat
docker compose up -d --build
```

Konteyner adı `etu-bilgisayar-toplulugu`, `restart: unless-stopped` ile açılışta
ve çökmede otomatik yeniden başlar. Site sunucuda **8080** portunda yayında:

```bash
# Sunucunun kendisinden test
curl -I http://localhost:8080

# Ağ içindeki başka bir cihazdan (sunucunun LAN IP'si ile)
# http://192.168.1.X:8080
```

Faydalı komutlar:

```bash
docker compose logs -f        # logları takip et
docker compose ps             # durum
docker compose restart        # yeniden başlat
docker compose down           # durdur ve sil
```

---

## c) Subdomain Kurulumu

İki alternatif var. **Önerilen: Seçenek 2 (Cloudflare Tunnel)** — router'da
port açmanı, statik IP almanı veya NAT arkasında kalmayı dert etmene gerek yok;
ev interneti/CGNAT ile bile çalışır.

Her iki seçenekte de önce şunu yap:

> **DNS sağlayıcında kayıt oluştur.** `emre-inci.com` DNS'i hangi panelde
> yönetiliyorsa (registrar paneli, Cloudflare DNS vb.) oradan
> `topluluk` (veya seçtiğin ad) için bir kayıt oluşturacaksın. Kayıt türü
> seçeneğe göre değişir: Seçenek 1'de **A kaydı**, Seçenek 2'de Cloudflare
> paneli kaydı senin için otomatik oluşturur.

### Seçenek 1 — DNS A Kaydı + Router Port Forwarding

**Ne zaman:** Sunucunun ağdan doğrudan dışarı açılmasında sorun yoksa ve ISS
dış IP'yi değiştirmiyorsa (veya DDNS ile idare edebiliyorsan).

1. **Dış IP'ni öğren:** Sunucuda `curl ifconfig.me` veya [whatismyip.com](https://whatismyip.com).
   Not: Bazı ISS'ler CGNAT kullanır — dış IP router'ın WAN IP'siyle uyuşmuyorsa
   bu seçenek çalışmaz, Seçenek 2'ye geç.
2. **DNS sağlayıcısında A kaydı oluştur:**
   - Host/Name: `topluluk`
   - Type: `A`
   - Value: dış IP adresin
   - TTL: 300 (5 dk, değişiklik hızlı yayılsın)
3. **Router'da port forwarding:** Dışarıdan gelen 80 (HTTP) ve 443 (HTTPS)
   trafiğini sunucunun LAN IP'sine yönlendir, örn. `192.168.1.X:8080` (dış 80 →
   iç 8080). HTTPS kullanacaksan sunucuda Caddy/Nginx Proxy Manager gibi bir
   reverse proxy ile Let's Encrypt sertifikası alman gerekir (dış 443 → proxy,
   proxy → `localhost:8080`).
4. **Doğrulama:** `curl -I http://topluluk.emre-inci.com` — DNS yayılması birkaç
   dakika sürebilir.

**Dinamik IP riski ve çözümü:** ISS dış IP'yi değiştirirse site erişilemez hale
gelir. Çözümler:

- **ISS'ten statik IP iste** (çoğu zaman ücretli).
- **DDNS kullan:** Sunucuya [`ddclient`](https://github.com/ddclient/ddclient)
  kurup DNS kaydını otomatik güncelle (Cloudflare DNS, Route53 vb.
  desteklenir) veya [DuckDNS](https://www.duckdns.org) ile ücretsiz bir
  hostname alıp `topluluk.emre-inci.com`'u ona **CNAME** olarak bağla.
  CNAME yolu: DuckDNS hostname'i dinamik IP'yi takip eder, senin DNS kaydın
  sadece ona işaret ettiği için IP değişiminde dokunman gerekmez.

### Seçenek 2 — Cloudflare Tunnel (önerilen)

**Ne zaman:** Her durumda. Port açmadan, NAT/CGNAT arkasından bile güvenli
yayın sağlar; HTTPS sertifikasını Cloudflare otomatik yönetir.

**Ön koşul:** `emre-inci.com`'un nameserver'ları Cloudflare'e taşınmış olmalı
(ücretsiz plan yeterli). DNS başka sağlayıcıdaysa ya domain'i Cloudflare'e
taşı ya da sadece bu subdomain'i kullanmak için alanın tamamını Cloudflare
DNS'e delege et.

1. **cloudflared kur** (sunucuda):

   ```bash
   # Debian/Ubuntu
   curl -fsSL https://pkg.cloudflare.com/cloudflare-main.gpg | sudo tee /usr/share/keyrings/cloudflare-main.gpg >/dev/null
   echo 'deb [signed-by=/usr/share/keyrings/cloudflare-main.gpg] https://pkg.cloudflare.com/cloudflared any main' | sudo tee /etc/apt/sources.list.d/cloudflared.list
   sudo apt update && sudo apt install cloudflared
   ```

2. **Cloudflare'e bağlan ve tunnel oluştur:**

   ```bash
   cloudflared tunnel login            # tarayıcıda yetki ver
   cloudflared tunnel create etu-site  # tunnel adı
   ```

   Komut bir tunnel ID ve `~/.cloudflared/<TUNNEL_ID>.json` credentials
   dosyası üretir.

3. **Tunnel konfigürasyonu** — `~/.cloudflared/config.yml`:

   ```yaml
   tunnel: <TUNNEL_ID>
   credentials-file: /home/<kullanici>/.cloudflared/<TUNNEL_ID>.json

   ingress:
     - hostname: topluluk.emre-inci.com
       service: http://localhost:8080
     - service: http_status:404
   ```

4. **DNS kaydını oluştur** (Cloudflare panelinde CNAME'i otomatik yazar):

   ```bash
   cloudflared tunnel route dns etu-site topluluk.emre-inci.com
   ```

5. **Servis olarak çalıştır:**

   ```bash
   sudo cloudflared service install
   sudo systemctl enable --now cloudflared
   ```

6. **Doğrulama:** `https://topluluk.emre-inci.com` birkaç dakika içinde açık
   yeşil kilit ile yayında olmalı.

> Alternatif: Cloudflare Zero Trust dashboard'dan "remotely managed" tunnel da
> kurulabilir; konfigürasyon panelden yönetilir, sunucuda sadece connector
> çalışır. İkisi de aynı sonucu verir.

---

## d) Ortam Değişkenleri (ENV)

- **Bu proje şu anda build-time env gerektirmiyor.** Tüm içerik repo'daki
  veri dosyalarından geliyor (`src/data/*`, `public/*`).
- **Konvansiyon:** Vite, yalnızca `VITE_` prefix'li değişkenleri client
  bundle'a gömer (örn. `VITE_API_URL`). `VITE_` olmayan değişkenler browser'a
  sızmaz. Önemli: `VITE_` değişkenleri **build anında gömülür** — çalışan
  konteynerde değiştirilemez, değer değişirse imajı yeniden derlemek gerekir.
- **Gizlilik:** `.env`, `.env.local` vb. dosyalar **git'e asla girmemeli**
  (`.gitignore` ve `.dockerignore` bu dosyaları kapsıyor). Repo'da şablon
  olarak yalnızca `.env.example` tutulabilir. Değerler gizli değilse bile bu
  kural bozulmasın — sonradan gerçek secret eklenince geçmişi temizlemek zordur.
- **Gelecekte env eklenirse:** Build-time değişkenleri compose'da build arg
  olarak geç:

  ```yaml
  services:
    web:
      build:
        context: .
        args:
          - VITE_API_URL=${VITE_API_URL}
  ```

  Dockerfile'da ilgili `ARG` / `ENV` satırları da eklenir. Runtime'da değişen
  değerler için (secret'lar dahil) `environment:` veya `env_file:` kullanılır,
  ancak bunlar yalnızca server-side kodda anlamlıdır — bu statik sitede client
  için tek yol build-time'dır.

---

## e) Güncelleme Akışı

Kod veya içerik (`events.json`, metinler vb.) değişince sunucuda:

```bash
cd etu-bilgisayar-toplulugu
git pull
docker compose up -d --build
```

Compose yalnızca değişen katmanları yeniden derler (`npm ci` katmanı
`package-lock.json` değişmedikçe cache'ten gelir), eski imaj yerine yenisini
başlatır. Downtime tipik olarak birkaç saniyedir.

Gereksiz imajları ara sıra temizle: `docker image prune`

---

## f) Logo ve Fotoğraf Ekleme Akışı

1. Başkanlar / içerik sahipleri GitHub'da repo'ya **PR** açar; dosyalar
   konvansiyona göre `public/` altına konur:
   - `public/logolar/<slug>.svg|png` (topluluk logoları)
   - `public/etkinlikler/` (etkinlik fotoğrafları; `events.json`'daki `image`
     alanıyla eşleşmeli)
   - `public/ekip/` (başkan ve başkan yardımcısı fotoğrafları)
2. Admin PR'ı inceler ve **merge** eder.
3. Sunucuda güncelleme akışı uygulanır (bkz. e):

   ```bash
   git pull && docker compose up -d --build
   ```

`public/` dosyaları build sırasında `dist/` içine kopyalanıp imaja gömüldüğü
için yeniden derleme zorunludur; çalışan konteynere dosya atılması yeterli
değildir.
