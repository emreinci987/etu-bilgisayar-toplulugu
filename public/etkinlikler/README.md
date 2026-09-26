# Etkinlik Fotoğrafları

Etkinlik görsellerini bu klasöre koyun ve `src/data/events.json` içindeki kayıtlarda
`"image": "/etkinlikler/<dosya-adı>.jpg"` olarak referans verin.

- `image` alanı **opsiyoneldir**: boş bırakırsanız (veya dosya bulunamazsa) kartta
  topluluk logolu/monogramlı zarif bir placeholder gösterilir — site bozulmaz.
- Önerilen oran: 16:9, genişlik en fazla 1600px.
- Mobil kullanıcı ağırlıklı olduğu için dosyaları sıkıştırın (WebP/JPEG, <200KB hedefi).
- Birden fazla fotoğraf (ör. afiş + etkinlikten kareler) için ilk görseli `image`, diğerlerini
  `gallery` dizisine yazın; etkinliğe tıklanınca açılan detay penceresinde hepsi kırpılmadan gösterilir.
