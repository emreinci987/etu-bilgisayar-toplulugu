# Topluluk Logoları

Topluluk logolarını bu klasöre koyun. Dosya adı, `src/data/communities.ts` içindeki
`slug` ile birebir eşleşmelidir:

| Dosya adı                 | Topluluk                  |
| ------------------------- | ------------------------- |
| `ana-topluluk.png`        | Ana Topluluk              |
| `fintech.png`             | FinTech Topluluğu         |
| `app-gelistirme.png`      | App Geliştirme Topluluğu  |
| `ai.png`                  | AI Topluluğu              |
| `oyun-gelistirme.png`     | Oyun Geliştirme Topluluğu |
| `blockchain.png`          | Blockchain Topluluğu      |
| `siber-guvenlik.png`      | Siber Güvenlik Topluluğu  |

- Tercih sırası: önce `.png`, bulunamazsa `.svg` denenir. `.jpg` desteklenmez — PNG'ye çevirin.
- Önerilen: **256×256 px kare PNG**. Kare değilse beyazla dolgulayıp ortalayın
  (macOS: `sips -Z 256 -s format png logo.jpg --out <slug>.png && sips --padToHeightWidth 256 256 --padColor FFFFFF <slug>.png`).
- Logolar her iki temada da **beyaz karo** üzerinde gösterilir; beyaz zemin için
  tasarlanmış logolar olduğu gibi kullanılabilir.
- Logo yoksa `CommunityLogo` bileşeni otomatik olarak monogramlı placeholder gösterir;
  site hiçbir şekilde bozulmaz.
