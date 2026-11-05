# ⚡ Vers Speed - Minimalist Internet Speed Test

FAST.com uslubida yaratilgan, to'liq ishlaydigan va minimalistik internet tezligini o'lchash platformasi.

---

## ✨ Imkoniyatlar va Funksiyalar
1. **Tezlikni Real-Vaqtda O'lchash (Download Speed)**:
   - Global CDN Anycast serverlari orqali parallel multi-stream o'lchash.
   - FAST.com kabi raqamlarning silliq va jonli animatsiyasi (`requestAnimationFrame`).
   - O'lchash vaqtida silliq aylanuvchi tugma va yakunlanganda yashil qayta yuklash (restart) tugmasi.
2. **Kengaytirilgan Tafsilotlar ("Show more info")**:
   - **Latency (Ping)**: Unloaded (odatiy tarmoq kechikishi) va Loaded (yuklama ostidagi bufferbloat).
   - **Upload Speed**: Real ma'lumotlarni POST so'rovlari orqali serverga yuborib yuklash tezligini aniqlash.
   - **Mijoz ma'lumotlari**: Real tashqi IP manzil, Joylashuv (Shahar, Davlat), Provayder (ASN).
   - **Server ma'lumotlari**: Cloudflare Edge ulanish nuqtasi.
3. **Mavzular (Dark & Light Mode)**:
   - FAST.com original oq (Light) va zamonaviy qora (Dark) mavzu.
   - Tizim sozlamasini avtomatik aniqlash va `localStorage`da saqlash.
4. **Maxsus Vers Speed Brendingi**:
   - Spidometr ko'rsatkichi + qizil aylana shkalasi + **Vers** brend logotipi.
   - Pastki burchakda `POWERED BY VERS` belgisi.
5. **Ulashish va Yordam**:
   - Natijani clipboard'ga nusxalash (Share tugmasi + Toast).
   - Qanday ishlashini tushuntiruvchi modal oyna (`?` tugmasi).

---

## 🚀 Ishga tushirish
1. `start.bat` faylini ikki marta bosing yoki:
```bash
python -m http.server 3333
```
2. Brauzeringizda oching:
`http://localhost:3333/` yoki to'g'ridan-to'g'ri `index.html` faylini brauzerda oching.
