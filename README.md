# TOBB ETÜ Bilgisayar Topluluğu — Tanıtım Sitesi

Tanıtım gününde QR kod ile açılacak, mobil-first koyu temalı tanıtım sitesi.

## Komutlar

```bash
npm install
npm run dev      # geliştirme sunucusu
npm run build    # production build (dist/)
npm run preview  # build'i yerelde servis et
```

## Teknoloji

Vite + React 18 + TypeScript + Tailwind CSS + react-router-dom v6 + three.js (vanilla).

## Dizin Sözleşmeleri (sonraki ajanlar için)

| Yol | Amaç |
| --- | --- |
| `src/data/communities.ts` | 5 topluluğun tek gerçek kaynağı (`Community` tipi) |
| `src/data/events.json` | Etkinlik kayıtları — şema: `src/data/events.types.ts` (`Event`) |
| `src/hooks/index.ts` | `useEvents()`, `useLatestEvents(n)`, `usePrefersReducedMotion()` |
| `public/logolar/<slug>.svg\|png` | Topluluk logoları (yoksa monogram placeholder gösterilir) |
| `public/etkinlikler/` | Etkinlik fotoğrafları (`events.json` → `image` alanı) |
| `public/ekip/` | Başkan / b. yardımcısı fotoğrafları |

## Bileşen API'leri

- `<CommunityLogo slug shortName color size? className? />` — logo varsa gösterir, yoksa monogram placeholder.
- `<SectionHeading kicker? title description? />` — bölüm başlığı standardı.
- `<HeroCanvas />` — three.js hero arka planı (kendi cleanup'ını yapar).
- `<Nav />`, `<Footer />` — App.tsx'e bağlı.

## Tasarım Tokenları (tailwind.config.js)

- Zemin: `coal` (#12100e …), metin: `cream` (#ece6da, dim, faint), vurgu: `amber` (#e8a33d)
- Fontlar: `font-mono` → JetBrains Mono, `font-sans` → Inter
- Radius: `rounded-card` (6px), border'lar 1px `border-coal-600`
- Yardımcı sınıf: `.chip` (mono etiket)

## Not

`git init` henüz yapılmadı — repo açılacağı zaman `.gitignore` hazır.

## Deployment

Site, lab sunucusunda Docker ile çalışıyor; detaylı kurulum (Docker, subdomain,
Cloudflare Tunnel / port forwarding, güncelleme ve medya ekleme akışları) için
[DEPLOYMENT.md](DEPLOYMENT.md) dosyasına bak. Hızlı başlatma:

```bash
docker compose up -d --build   # http://localhost:8080
```
