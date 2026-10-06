# Deployment — Cloudflare Workers (Static Assets)

Site **Cloudflare Workers** üzerinde statik varlık (static assets) olarak
yayınlanır ve **https://etupctoplulugu.online** adresinden erişilir. Sunucu,
Docker ya da lab bilgisayarı gerekmez.

Akış: GitHub reposuna her push, Cloudflare'de otomatik build + deploy tetikler.

| Ayar | Değer |
| --- | --- |
| Proje (Worker) | `etu-bilgisayar-toplulugu` |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Çıktı klasörü | `dist` |
| Yapılandırma | [`wrangler.jsonc`](wrangler.jsonc) |
| Alan adı | `etupctoplulugu.online` (Cloudflare'de Active) |

`wrangler.jsonc` içindeki `not_found_handling: "single-page-application"`
ayarı, `/etkinlikler` gibi alt sayfalar doğrudan açıldığında 404 yerine
`index.html` döndürür (react-router için gerekli).

> `wrangler.jsonc` repoda olmalıdır. Dosya yoksa Cloudflare Vite'ı otomatik
> ayarlamaya çalışır ve Vite 5 ile `cannot be automatically configured` hatası verir.

---

## a) Güncelleme Akışı

1. Değişikliği yap (kod, `src/data/*`, `public/*`), commit et.
2. `main` branch'ine **push** et (GitHub Desktop → Push origin).
3. Cloudflare build'i kendisi başlatır; 1-2 dakika içinde site güncellenir.

- Build hatası olursa eski sürüm yayında kalır, site bozulmaz. Hata logu:
  Cloudflare → Workers & Pages → `etu-bilgisayar-toplulugu` → **Deployments**.
- Eski sayfa görünürse tarayıcıda `Ctrl+F5`.
- Yayına çıkan branch: **Settings → Build → Branch control**.

Yerelde denemek için:

```powershell
npm ci
npm run dev       # geliştirme sunucusu
npm run build     # üretim build'i (dist/)
```

---

## b) Logo ve Fotoğraf Ekleme Akışı

1. Başkanlar / içerik sahipleri GitHub'da repo'ya **PR** açar; dosyalar
   konvansiyona göre `public/` altına konur:
   - `public/logolar/<slug>.svg|png` (topluluk logoları)
   - `public/etkinlikler/` (etkinlik fotoğrafları; `events.json`'daki `image`
     alanıyla eşleşmeli)
   - `public/ekip/` (başkan ve başkan yardımcısı fotoğrafları)
2. Admin PR'ı inceler ve **merge** eder.
3. Merge sonrası Cloudflare otomatik yeniden build alır; ek bir adım gerekmez.

---

## c) Alan Adı Kurulumu (ilk kurulum / taşıma)

1. **Alan adını Cloudflare'e ekle:** Dashboard → **Domains → Onboard a domain**
   → `etupctoplulugu.online` → **Free** plan. Verilen nameserver'ları alan adını
   aldığın firmanın panelinde değiştir. Durum **Active** olana kadar bekle.
2. **Çakışan kayıtları temizle:** Alan adı için eski A / AAAA / CNAME kayıtları
   (park sayfası, eski tunnel public hostname'i vb.) varsa sil. MX ve TXT
   kayıtlarına dokunma. Aksi halde şu hatayı alırsın:
   `Hostname ... already has externally managed DNS records`.
3. **Worker'a bağla:** Workers & Pages → `etu-bilgisayar-toplulugu` →
   **Settings → Domains & Routes → Add → Custom domain** →
   `etupctoplulugu.online` (isteğe bağlı: `www.etupctoplulugu.online`).
   DNS kaydını ve HTTPS sertifikasını Cloudflare kendisi oluşturur.
4. **Doğrula:** `https://etupctoplulugu.online` ve `/etkinlikler` açılmalı.

`*.workers.dev` adresleri (varsayılan ve preview) zararsızdır; istenirse
Settings → Domains & Routes içinden **Disable** edilebilir.

### Sorun giderme

| Belirti | Olası neden |
| --- | --- |
| Deploy'da `Vite ... cannot be automatically configured` | Repoda `wrangler.jsonc` yok / push edilmemiş |
| Custom domain eklerken `externally managed DNS records` | Alan adında eski kayıt veya eski tunnel public hostname'i var; sil |
| Alt sayfa doğrudan açılınca 404 | `wrangler.jsonc` içinde `not_found_handling` ayarı eksik |
| Alan adı çözülmüyor | Nameserver'lar Cloudflare'e çevrilmemiş veya domain henüz **Active** değil |
| `www` açılmıyor | `www.etupctoplulugu.online` ayrıca custom domain olarak eklenmemiş |

---

## d) Ortam Değişkenleri (ENV)

- **Bu proje şu anda build-time env gerektirmiyor.** Tüm içerik repo'daki
  veri dosyalarından geliyor (`src/data/*`, `public/*`).
- **Konvansiyon:** Vite, yalnızca `VITE_` prefix'li değişkenleri client
  bundle'a gömer (örn. `VITE_API_URL`). `VITE_` olmayan değişkenler browser'a
  sızmaz. `VITE_` değişkenleri **build anında gömülür**.
- **Gelecekte env eklenirse:** Cloudflare → proje → **Settings → Variables and
  Secrets** (build değişkenleri için **Build** bölümü) altından tanımla.
- **Gizlilik:** `.env`, `.env.local` vb. dosyalar **git'e asla girmemeli**
  (`.gitignore` kapsıyor). Gerçek secret'ları repoya koyma.

---

## e) Güvenlik

- **Header'lar** [`public/_headers`](public/_headers) dosyasında (CSP,
  X-Frame-Options, nosniff…). Cloudflare build sonrası `dist/_headers`'ı okuyup
  her yanıta ekler. Kontrol: `curl.exe -I https://etupctoplulugu.online`
- **CSP hash'i:** `index.html`'deki inline tema script'ini değiştirirseniz
  tarayıcı onu engeller (konsolda CSP hatası). Hatadaki yeni `sha256-...`
  değerini `_headers`'a yazın. Yeni bir dış kaynak (font, analytics, embed)
  eklerken de ilgili `*-src`'ye ekleyin; yoksa yüklenmez.
- **Cloudflare paneli (yapıldı):** SSL/TLS → Edge Certificates →
  Always Use HTTPS açık, Minimum TLS 1.2, HSTS (1 ay ile başla; *include
  subdomains* ve *preload* kapalı).

---

## Eski Docker + Cloudflare Tunnel Yöntemi (kullanımda değil)

Site önce lab bilgisayarında Docker + Cloudflare Tunnel ile yayınlanmak üzere
kuruldu, ancak okul ağı Cloudflare Tunnel'ın kullandığı **7844 portunu**
(TCP/UDP) engellediği için tunnel hiç bağlanamadı (`dial tcp ...:7844: i/o timeout`).
Bu yüzden Cloudflare Workers'a geçildi.

`Dockerfile`, `docker-compose.yml`, `nginx.conf` ve `.env.example` repoda
duruyor; yalnızca yerelde Nginx ile denemek için kullanılabilir:

```powershell
docker compose up -d --build web   # http://localhost:8080
```

`tunnel` servisi `CLOUDFLARE_TUNNEL_TOKEN` ister; yalnızca `web` servisini
çalıştırmak için komuttaki `web` argümanı gerekir.

---

## Özet Kontrol Listesi

- [x] `etupctoplulugu.online` Cloudflare'de Active
- [x] Worker `etu-bilgisayar-toplulugu` repoya bağlı, `wrangler.jsonc` push'landı
- [x] Custom domain: `etupctoplulugu.online`
- [ ] `www.etupctoplulugu.online` eklendi (isteğe bağlı)
- [ ] Zero Trust'taki `etu-site` tunnel'ı silindi, lab'da `docker compose down` yapıldı
- [ ] QR kodu `https://etupctoplulugu.online` adresine yönlendiriyor
