# Komikin

Platform baca komik gratis tanpa iklan dengan jadwal rilis harian terupdate. Dibangun dengan React, Vite, Tailwind CSS, dan Express, serta siap dipakai sebagai PWA (Progressive Web App).

## Menjalankan secara lokal

**Prasyarat:** Node.js 18+

1. Install dependencies:
   ```bash
   npm install
   ```
2. Jalankan development server:
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan di `http://localhost:3000`.

## Build untuk production

```bash
npm run build
npm start
```

## Deploy ke Vercel

Proyek ini sudah dikonfigurasi untuk deploy langsung ke Vercel:

1. Push repo ini ke GitHub/GitLab/Bitbucket.
2. Import project di [vercel.com/new](https://vercel.com/new).
3. Vercel otomatis mendeteksi konfigurasi dari `vercel.json`:
   - Build command: `vite build`
   - Output directory: `dist`
   - API routes di `api/index.js` berjalan sebagai Serverless Function
4. Klik **Deploy**.

Tidak ada environment variable yang wajib diisi untuk fitur inti aplikasi.

## Struktur proyek

- `src/` — Frontend React (halaman, komponen, dan helper API)
- `api/index.js` — Endpoint backend (Express) yang di-deploy sebagai Vercel Serverless Function
- `server.ts` — Server Express untuk development lokal & self-hosting
- `public/` — Aset statis, manifest PWA, dan service worker
