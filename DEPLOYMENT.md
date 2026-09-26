# Deployment — Docker ile Self-Host (Windows Sunucu)

Site, lab'ındaki 2. bilgisayarda (**Windows**) Docker konteyneri olarak çalışır
ve `emre-inci.com` altındaki bir subdomain'den (örn. `topluluk.emre-inci.com`)
yayınlanır.

Mimari: **Dockerfile** (multi-stage) önce `node:20-alpine` ile `npm ci` +
`npm run build` çalıştırır, ardından `dist/` çıktısı `nginx:alpine` ile servis
edilir. Nginx konfigürasyonu `nginx.conf` içindedir (SPA fallback, gzip,
statik asset cache, temel güvenlik header'ları).

`docker-compose.yml` iki servis çalıştırır:

| Servis | Konteyner | Görev |
| --- | --- | --- |
| `web` | `etu-bilgisayar-toplulugu` | Nginx ile siteyi servis eder (LAN testi için `8080` portu açık) |
| `tunnel` | `etu-bilgisayar-toplulugu-tunnel` | Cloudflare Tunnel connector'ı; siteyi port açmadan `topluluk.emre-inci.com`'a yayınlar |

Yani sunucuda Docker dışında hiçbir şey (cloudflared, reverse proxy, güvenlik
duvarı kuralı) kurulmaz — tek komut: `docker compose up -d --build`.

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

# Tunnel token'ı için .env oluştur (değeri bkz. c) Cloudflare Tunnel, adım 2)
Copy-Item .env.example .env
notepad .env   # CLOUDFLARE_TUNNEL_TOKEN=<token> satırını doldur, kaydet

# İmajı derle ve iki servisi (web + tunnel) arka planda başlat
docker compose up -d --build
```

> `.env` yoksa veya token boşsa compose şu hatayla durur:
> `required variable CLOUDFLARE_TUNNEL_TOKEN is missing a value`.
> `.env` git'e ve Docker imajına **girmez** (`.gitignore` / `.dockerignore`).

Her iki konteyner de `restart: unless-stopped` ile açılışta ve çökmede otomatik
yeniden başlar. Site sunucuda ayrıca **8080** portunda yayında (LAN testi için):

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
docker compose logs -f        # tüm logları takip et
docker compose logs -f tunnel # yalnızca tunnel logları ("Registered tunnel connection" görmelisin)
docker compose ps             # durum
docker compose restart        # yeniden başlat
docker compose down           # durdur ve sil
```

---

## c) Subdomain Kurulumu — Cloudflare Tunnel

Site dış dünyaya **Cloudflare Tunnel** ile açılır: connector (`tunnel` servisi)
Cloudflare'e **dışarı doğru** bağlantı kurar, gelen istekleri Docker ağı
üzerinden `web` konteynerine iletir. Bu yüzden:

- Router'da **port açmaya**, statik IP almaya gerek yoktur; CGNAT arkasında bile çalışır.
- Windows Güvenlik Duvarı'nda kural eklemeye gerek yoktur.
- **HTTPS sertifikasını Cloudflare** otomatik yönetir.

Tunnel **panelden yönetilir** (remotely-managed): tüm ayarlar Cloudflare
panelinde durur, sunucuda yalnızca token ile çalışan connector vardır. Bu
bölümün tamamı sunucuya dokunmadan, herhangi bir bilgisayardan tarayıcıyla
**önceden** yapılabilir.

### 1. Ön koşullar

- `emre-inci.com` Cloudflare hesabında **Active** olmalı (nameserver'lar
  Cloudflare'e taşınmış; ücretsiz plan yeterli).
- **DNS → Records** altında `topluluk` adlı eski bir kayıt varsa silin; yoksa
  public hostname eklerken çakışma hatası alınır.

### 2. Tunnel'ı oluştur ve token'ı al

1. [dash.cloudflare.com](https://dash.cloudflare.com) → sol menü **Zero Trust**
   (Cloudflare One). İlk girişte takım adı ve plan sorulur → **Free** planı seçin.
2. **Networks → Tunnels → Create a tunnel** → **Cloudflared** → ad: `etu-site` → **Save tunnel**.
3. Kurulum ekranında (işletim sistemi seçimi fark etmez, örn. **Docker**)
   gösterilen komutun sonundaki uzun `eyJ...` değeri **token**'dır. Kopyalayıp
   sunucudaki `.env` dosyasına yazın:

   ```
   CLOUDFLARE_TUNNEL_TOKEN=eyJhIjoi...
   ```

   > Token parola gibidir: git'e, Discord'a, ekran görüntüsüne koymayın.
   > Sızarsa panelden **tunnel → Configure → Refresh token** ile yenileyip
   > `.env`'i güncelleyin, `docker compose up -d` ile tunnel'ı yeniden başlatın.

4. Connector henüz bağlı olmadığı için bu ekranda beklemeden **Next**.

### 3. Subdomain'i bağla (Public Hostname)

| Alan | Değer |
| --- | --- |
| Subdomain | `topluluk` |
| Domain | `emre-inci.com` |
| Path | *(boş)* |
| Service Type | `HTTP` |
| URL | **`web:80`** |

**Save** → Cloudflare `topluluk.emre-inci.com` için DNS kaydını (CNAME)
otomatik oluşturur.

> URL neden `localhost:8080` değil? Connector kendi konteynerinde çalışır;
> onun için `localhost` kendisidir. Compose, servisleri aynı Docker ağına
> koyar ve `web` adıyla birbirine ulaştırır; `80` konteynerin iç portudur.

Tunnel bağlanana kadar panelde durum **Inactive / Down** görünür — normaldir.

### 4. Sunucuda başlat ve doğrula

```powershell
docker compose up -d --build
docker compose logs -f tunnel
```

- Loglarda `Registered tunnel connection` satırlarını görün (genelde 4 adet).
- Panelde tunnel durumu **Healthy** olur.
- `https://topluluk.emre-inci.com` kilit simgesiyle açılır (DNS'in yayılması
  birkaç dakika sürebilir).

### Sorun giderme

| Belirti | Olası neden |
| --- | --- |
| Compose `CLOUDFLARE_TUNNEL_TOKEN is missing` hatası | `.env` yok, yanlış klasörde veya satır boş |
| Tunnel logunda `Unauthorized` / `invalid token` | Token eksik/yanlış kopyalandı veya yenilendi |
| Tunnel **Healthy** ama sitede **502 Bad Gateway** | Public hostname URL'i yanlış (`web:80` olmalı) veya `web` konteyneri çalışmıyor (`docker compose ps`) |
| `topluluk.emre-inci.com` hiç çözülmüyor | Public hostname kaydedilmemiş veya DNS'te çakışan eski kayıt var |

### Kapasite

Cloudflare Tunnel'ın ücretsiz planda ziyaretçi/istek sayısı için bir limiti
yoktur; günde yüzlerce, hatta binlerce ziyaret bu site için sorun değildir.
Hash'li JS/CSS (`/assets/`) ve fotoğraflar (`.jpg`/`.webp`) Cloudflare'in
kenar sunucularında önbelleğe alınır; lab bilgisayarına çoğunlukla yalnızca
küçük `index.html` istekleri ulaşır. Asıl sınırlar lab'ın internet
bağlantısı ve bilgisayarın açık kalmasıdır.

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

**Önceden (tarayıcıdan, sunucu gerekmez):**

- [ ] `emre-inci.com` Cloudflare'de Active, `topluluk` için eski DNS kaydı yok
- [ ] Zero Trust → Tunnels → `etu-site` oluşturuldu, token güvenli yere kaydedildi
- [ ] Public hostname: `topluluk.emre-inci.com` → `HTTP` · `web:80`

**Sunucuda:**

- [ ] WSL2 + Docker Desktop kurulu, otomatik başlatma açık
- [ ] Repo klonlandı, `.env` içinde `CLOUDFLARE_TUNNEL_TOKEN` dolu
- [ ] `docker compose up -d --build` çalıştı, `docker compose ps` iki konteyneri de gösteriyor
- [ ] `http://localhost:8080` sunucuda açılıyor
- [ ] Tunnel panelde **Healthy**
- [ ] `https://topluluk.emre-inci.com` dışarıdan erişilebilir
- [ ] QR kodu bu HTTPS adresine yönlendiriyor
