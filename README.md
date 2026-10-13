# Pempek & Tekwan Kia

Website satu halaman untuk toko Pempek & Tekwan Kia. Pembeli memilih produk, mengisi nama dan alamat, lalu pesanan dikirim lewat WhatsApp. Tanpa backend, di-hosting di GitHub Pages.

## Menjalankan di komputer

```bash
npm install
npm run dev
```

## Mengubah isi toko

Harga, isi paket, dan nomor WhatsApp ada di bagian atas `src/App.jsx`. Foto dan logo yang tampil di website ada di `public/images/`.

## Deploy

Setiap push ke branch `main` otomatis di-build dan di-deploy oleh GitHub Actions (`.github/workflows/deploy.yml`). Di repo GitHub, buka **Settings → Pages** dan pilih **Source: GitHub Actions** (cukup sekali).
