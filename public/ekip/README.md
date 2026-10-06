# Ekip Fotoğrafları

`/biz-kimiz` sayfasındaki yönetim ekibi kartları bu klasördeki fotoğrafları
kullanır. Fotoğraf eklenmemişse sayfa otomatik olarak isim baş harfli zarif
bir avatar gösterir — site fotoğrafsız da bozulmaz.

## Dosya Adı Konvansiyonu

Her topluluk için iki dosya:

```
<slug>-baskan.jpg              → Başkan
<slug>-baskan-yardimcisi.jpg   → Başkan Yardımcısı
```

Geçerli slug'lar (`src/data/communities.ts` ile birebir aynı olmalı):

| Slug | Topluluk |
| --- | --- |
| `ana-topluluk` | Ana Topluluk |
| `fintech` | FinTech Topluluğu |
| `app-gelistirme` | App Geliştirme Topluluğu |
| `ai` | AI Topluluğu |
| `oyun-gelistirme` | Oyun Geliştirme Topluluğu |
| `siber-guvenlik` | Siber Güvenlik Topluluğu |

Örnek: AI Topluluğu başkanının fotoğrafı → `ai-baskan.jpg`

## Kim, Nasıl Ekler?

Fotoğraflar yalnızca site yöneticileri (adminler) tarafından eklenir;
başkanlar fotoğraflarını yöneticilere iletir.

1. Bu repo için GitHub'da bir **branch** açın (ör. `ekip-fotograflari`).
2. Fotoğrafları yukarıdaki konvansiyona göre adlandırıp bu klasöre koyun.
3. **Pull Request** açın; inceleme sonrası birleştirilir ve site yeniden
   yayınlanınca fotoğraflar görünür.

## Görsel Önerileri

- **Kare (1:1) kırpılmış** fotoğraf kullanın — kartlar `aspect-square` +
  `object-cover` ile gösterir; kare olmayan görseller kırpılır.
- Önerilen boyut: en az **512×512 px**, `.jpg` formatı.
- Dosya boyutunu makul tutun (tercihen < 300 KB); mobil kullanıcılar QR ile
  gelecek.
- Yüzün karenin ortasında olduğu, sade arka planlı fotoğraflar en iyi sonucu verir.
