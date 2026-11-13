# Wedding Website — Văn Tuấn & Ngọc Trâm (26.12.2026)

Website tĩnh (HTML/CSS/JS thuần), không cần build.

## Cấu trúc
- `index.html` — toàn bộ trang (CSS + JS nằm trong file)
- `img/` — ảnh (WebP) và 2 mã QR quà mừng
- `audio/music.mp3` — nhạc nền
- `favicon.svg`

## Chạy thử
Mở bằng một server tĩnh (vd. `npx serve .`) hoặc triển khai thẳng lên Vercel/Netlify.

## Triển khai Vercel
Import repo GitHub → Framework Preset: **Other** → để trống Build Command và Output Directory → Deploy.

## RSVP
Form gửi tới Google Apps Script (biến `RSVP_ENDPOINT` trong `index.html`) và ghi vào Google Sheet.
