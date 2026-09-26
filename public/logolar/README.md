# Topluluk Logoları

Topluluk logolarını bu klasöre koyun. Dosya adı, `src/data/communities.ts` içindeki
`slug` ile birebir eşleşmelidir:

| Dosya adı                 | Topluluk                  |
| ------------------------- | ------------------------- |
| `ana-topluluk.svg`        | Ana Topluluk              |
| `fintech.svg`             | FinTech Topluluğu         |
| `app-gelistirme.svg`      | App Geliştirme Topluluğu  |
| `ai.svg`                  | AI Topluluğu              |
| `oyun-gelistirme.svg`     | Oyun Geliştirme Topluluğu |
| `blockchain.svg`          | Blockchain Topluluğu      |
| `siber-guvenlik.svg`      | Siber Güvenlik Topluluğu  |

- Tercih sırası: önce `.svg`, bulunamazsa `.png` denenir.
- Logo yoksa `CommunityLogo` bileşeni otomatik olarak monogramlı placeholder gösterir;
  site hiçbir şekilde bozulmaz.
- Kare (1:1) ve koyu zeminde okunabilir dosyalar tercih edin.
