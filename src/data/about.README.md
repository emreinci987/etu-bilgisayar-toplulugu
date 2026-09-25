# Biz Kimiz Sayfası İçeriği (`about.json`)

`/biz-kimiz` sayfasındaki tüm metinler, ekip bilgileri ve sosyal medya
bağlantıları bu klasördeki **`about.json`** dosyasından okunur. Kod
değiştirmeden içerik güncellemek için yalnızca bu dosyayı düzenleyin.

## Alanlar

| Alan | Açıklama |
| --- | --- |
| `hero.mission` | Sayfa üstündeki misyon paragrafı (1-2 cümle). |
| `hero.intro` | Tanıtım günü bağlamını anlatan paragraf. |
| `communities[]` | Her topluluk için `slug` + `about` metni. `slug`, `communities.ts` dosyasındaki slug ile **birebir aynı** olmalı (`ana-topluluk`, `fintech`, `app-gelistirme`, `ai`, `oyun-gelistirme`). `about` metnini topluluk başkanı kendi ekibi için düzenler. |
| `team[]` | Her topluluk için başkan ve başkan yardımcısı. `name` boş bırakılırsa kartta "Yakında" yazar. `title` alanına bölüm/sınıf gibi kısa bir unvan yazılabilir (isteğe bağlı). |
| `socials` | Instagram, LinkedIn, GitHub, Discord bağlantıları. Boş string bırakılan ikon sayfada **gösterilmez**. Tam URL yazın (ör. `https://instagram.com/...`). |

## Fotoğraflar

Ekip fotoğrafları bu dosyadan değil, `public/ekip/` klasöründen gelir.
Dosya adı konvansiyonu ve ekleme talimatları için bkz.
`public/ekip/README.md`. Fotoğraf henüz eklenmemişse sayfa otomatik
olarak isim baş harfli bir avatar gösterir.

## Dikkat

- JSON'da yorum satırı **yoktur**; virgül ve tırnak işaretlerine dikkat edin.
- Kaydetmeden önce dosyanın geçerli JSON olduğundan emin olun
  (ör. `npx tsc -b` import hatası verir, ya da bir JSON doğrulayıcı kullanın).
- Şema tanımı: `about.types.ts` — alan eklemek/çıkarmak isterseniz önce
  orayı güncelleyin.
