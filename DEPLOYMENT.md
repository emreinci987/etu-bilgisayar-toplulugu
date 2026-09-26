# Deployment — Docker ile Self-Host (Windows Sunucu)

Site, lab'ındaki 2. bilgisayarda (**Windows**) Docker konteyneri olarak çalışır
ve `emre-inci.com` altındaki bir subdomain'den (örn. `topluluk.emre-inci.com`)
yayınlanır.

Mimari: **Dockerfile** (multi-stage) önce `node:20-alpine` ile `npm ci` +
`npm run build` çalıştırır, ardından `dist/` çıktısı `nginx:alpine` ile servis
edilir. Nginx konfigürasyonu `nginx.conf` içindedir (SPA fallback, gzip,
statik asset cache, temel güvenlik header'ları).

> Komutlar **PowerShell** içindir (Windows 10/11'de yüklü gelir). Komutları
> çalıştırırken PowerShell'i yönetici olarak açman gereken yerler ayrıca
> belirtilmiştir.

---

## a) Sunucuya Docker Kurulumu (Windows)

1. **WSL2'yi etkinleştir** (Docker Desktop'un altyapısı). Yönetici PowerShell'de:

   ```powershell
   wsl --install
   ```

   Kurulum sonrası bilgisayarı yeniden başlat. (Çoğu güncel Windows 10/11'de bu
   tek komut yeterli; eski sürümlerde "Sanal Makine Platformu" ve "Linux için
   Windows Alt Sistemi" özelliklerini elle açman gerekebilir.)

2. **Docker Desktop for Windows'u kur:**
   [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop/)
   adresinden indir, kurulumda **"Use WSL 2 instead of Hyper-V"** seçeneği
   işaretli kalsın.

3. **Otomatik başlatmayı aç:** Docker Desktop → Settings → General →
   **"Start Docker Desktop when you sign in"** işaretli olsun. Böylece lab
   bilgisayarı yeniden başlatıldığında site kendiliğinden ayağa kalkar
   (konteyner `restart: unless-stopped` ile işaretli).

4. **Git kur** (yoksa): [git-scm.com/download/win](https://git-scm.com/download/win)

5. **Doğrulama** (PowerShell):

   ```powershell
   docker --version
   docker compose version
   git --version
   ```

> Not: Docker Desktop arka planda çalışmadan `docker` komutları çalışmaz;
> komut vermeden önce Docker Desktop'un açık olduğundan emin ol (otomatik
> başlatma açıksa zaten açık olur).

---

## b) Repo'yu Çekme ve Çalıştırma

```powershell
# Repo'yu çek (ilk kurulumda)
git clone https://github.com/emreinci987/etu-bilgisayar-toplulugu.git
cd etu-bilgisayar-toplulugu

# İmajı derle ve arka planda başlat
docker compose up -d --build
```

Konteyner adı `etu-bilgisayar-toplulugu`, `restart: unless-stopped` ile açılışta
ve çökmede otomatik yeniden başlar. Site sunucuda **8080** portunda yayında:

```powershell
# Sunucunun kendisinden test
curl.exe -I http://localhost:8080

# Ağ içindeki başka bir cihazdan (sunucunun LAN IP'si ile)
# http://192.168.1.X:8080
```

> PowerShell'de `curl` tek başına `Invoke-WebRequest` kısayoludur; gerçek curl
> davranışı için `curl.exe` yaz. LAN IP'ni öğrenmek için: `ipconfig` →
> "IPv4 Address".

Faydalı komutlar:

```powershell
docker compose logs -f        # logları takip et
docker compose ps             # durum
docker compose restart        # yeniden başlat
docker compose down           # durdur ve sil
```

---

## c) Subdomain Kurulumu

İki alternatif var. **Önerilen: Seçenek 2 (Cloudflare Tunnel)** — router'da
port açmanı, statik IP almanı veya NAT arkasında kalmayı dert etmene gerek yok;
ev/lab interneti ve CGNAT ile bile çalışır, HTTPS'i otomatik halleder.

Her iki seçenekte de önce şunu yap:

> **DNS sağlayıcında kayıt oluştur.** `emre-inci.com` DNS'i hangi panelde
> yönetiliyorsa (registrar paneli, Cloudflare DNS vb.) oradan
> `topluluk` (veya seçtiğin ad) için bir kayıt oluşturacaksın. Kayıt türü
> seçeneğe göre değişir: Seçenek 1'de **A kaydı**, Seçenek 2'de Cloudflare
> paneli kaydı senin için otomatik oluşturur.

### Seçenek 1 — DNS A Kaydı + Router Port Forwarding

**Ne zaman:** Sunucunun ağdan doğrudan dışarı açılmasında sorun yoksa ve ISS
dış IP'yi değiştirmiyorsa (veya DDNS ile idare edebiliyorsan).

1. **Dış IP'ni öğren:** PowerShell'de `curl.exe ifconfig.me` veya
   [whatismyip.com](https://whatismyip.com). Not: Bazı ISS'ler CGNAT kullanır —
   dış IP, router'ın WAN IP'siyle uyuşmuyorsa bu seçenek çalışmaz, Seçenek 2'ye
   geç.
2. **DNS sağlayıcısında A kaydı oluştur:**
   - Host/Name: `topluluk`
   - Type: `A`
   - Value: dış IP adresin
   - TTL: 300 (5 dk, değişiklik hızlı yayılsın)
3. **Router'da port forwarding:** Dışarıdan gelen 80 (HTTP) ve 443 (HTTPS)
   trafiğini sunucunun LAN IP'sine yönlendir, örn. dış 80 → `192.168.1.X:8080`.
   HTTPS kullanacaksan sunucuda Caddy/Nginx Proxy Manager gibi bir reverse
   proxy ile Let's Encrypt sertifikası alman gerekir (dış 443 → proxy, proxy →
   `localhost:8080`).
4. **Windows Güvenlik Duvarı'nda port aç:** Yönetici PowerShell'de:

   ```powershell
   New-NetFirewallRule -DisplayName "Topluluk Sitesi 8080" -Direction Inbound -Protocol TCP -LocalPort 8080 -Action Allow
   ```

5. **Doğrulama:** `curl.exe -I http://topluluk.emre-inci.com` — DNS yayılması
   birkaç dakika sürebilir.

**Dinamik IP riski ve çözümü:** ISS dış IP'yi değiştirirse site erişilemez hale
gelir. Çözümler:

- **ISS'ten statik IP iste** (çoğu zaman ücretli).
- **DDNS kullan:** [DuckDNS](https://www.duckdns.org) ile ücretsiz bir hostname
  alıp `topluluk.emre-inci.com`'u ona **CNAME** olarak bağla; IP güncellemesi
  için DuckDNS'in Windows istemcisi (veya basit bir Zamanlanmış Görev script'i)
  kullanılabilir. CNAME yolu: DuckDNS hostname'i dinamik IP'yi takip eder,
  senin DNS kaydın sadece ona işaret ettiği için IP değişiminde dokunman
  gerekmez. (Cloudflare DNS kullanıyorsan Cloudflare API ile IP güncelleyen
  PowerShell script'leri de var.)

### Seçenek 2 — Cloudflare Tunnel (önerilen)

**Ne zaman:** Her durumda. Port açmadan, NAT/CGNAT arkasından bile güvenli
yayın sağlar; HTTPS sertifikasını Cloudflare otomatik yönetir; güvenlik
duvarı kuralı da gerekmez (bağlantı dışarı doğru kurulur).

**Ön koşul:** `emre-inci.com`'un nameserver'ları Cloudflare'e taşınmış olmalı
(ücretsiz plan yeterli). DNS başka sağlayıcıdaysa ya domain'i Cloudflare'e
taşı ya da alanın tamamını Cloudflare DNS'e delege et.

1. **cloudflared kur** (yönetici PowerShell):

   ```powershell
   winget install --id Cloudflare.cloudflared
   ```

   (winget yoksa [releases](https://github.com/cloudflare/cloudflared/releases)
   sayfasından Windows `.msi` paketini indir.)

2. **Cloudflare'e bağlan ve tunnel oluştur:**

   ```powershell
   cloudflared tunnel login            # tarayıcıda yetki ver
   cloudflared tunnel create etu-site  # tunnel adı
   ```

   Komut bir tunnel ID ve `%USERPROFILE%\.cloudflared\<TUNNEL_ID>.json`
   credentials dosyası üretir.

3. **Tunnel konfigürasyonu** — `%USERPROFILE%\.cloudflared\config.yml`:

   ```yaml
   tunnel: <TUNNEL_ID>
   credentials-file: C:\Users\<kullanici>\.cloudflared\<TUNNEL_ID>.json

   ingress:
     - hostname: topluluk.emre-inci.com
       service: http://localhost:8080
     - service: http_status:404
   ```

4. **DNS kaydını oluştur** (Cloudflare panelinde CNAME'i otomatik yazar):

   ```powershell
   cloudflared tunnel route dns etu-site topluluk.emre-inci.com
   ```

5. **Windows servisi olarak çalıştır** (yönetici PowerShell):

   ```powershell
   cloudflared service install
   ```

   Bu, cloudflared'i Windows servisi olarak kurar — bilgisayar her açıldığında
   tunnel otomatik başlar (Linux'taki systemd'nin karşılığı). Servisi yönetmek
   için: `services.msc` → "Cloudflared" veya `Get-Service cloudflared`.

   > Not: Servis olarak çalışınca config'i
   > `C:\Windows\System32\config\systemprofile\.cloudflared\` altında arar.
   > `cloudflared service install` sırasında config yolunu kendisi kopyalar /
   > sorar; sorun yaşarsan `config.yml`'i ve credentials JSON'unu o dizine
   > elle kopyala.

6. **Doğrulama:** `https://topluluk.emre-inci.com` birkaç dakika içinde açık
   yeşil kilit ile yayında olmalı.

> Alternatif: Cloudflare Zero Trust dashboard'dan "remotely managed" tunnel da
> kurulabilir; konfigürasyon panelden yönetilir, sunucuda sadece connector
> çalışır. Windows'ta bu yol daha az dosya taşıma gerektirdiği için pratik
> olabilir. İkisi de aynı sonucu verir.

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

Kod veya içerik (`events.json`, metinler vb.) değişince sunucuda PowerShell'de:

```powershell
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

   ```powershell
   git pull; docker compose up -d --build
   ```

`public/` dosyaları build sırasında `dist/` içine kopyalanıp imaja gömüldüğü
için yeniden derleme zorunludur; çalışan konteynere dosya atılması yeterli
değildir.

---

## Özet Kontrol Listesi

- [ ] WSL2 + Docker Desktop kurulu, otomatik başlatma açık
- [ ] Repo klonlandı, `docker compose up -d --build` çalıştı
- [ ] `http://localhost:8080` sunucuda açılıyor
- [ ] Subdomain kararı verildi: `topluluk.emre-inci.com` (veya başka ad)
- [ ] Seçenek 1 (A kaydı + port forwarding + güvenlik duvarı kuralı) **veya**
      Seçenek 2 (Cloudflare Tunnel, önerilen) kuruldu
- [ ] `https://topluluk.emre-inci.com` dışarıdan erişilebilir
- [ ] QR kodu bu HTTPS adresine yönlendiriyor
