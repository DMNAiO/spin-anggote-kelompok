# Pembagian Tim & Live Chat

Aplikasi ini adalah halaman statis. Fitur live chat memakai Supabase Auth (Google) dan PostgreSQL Realtime.

## Setup Supabase

1. Buat project di [Supabase Dashboard](https://supabase.com/dashboard).
2. Buka **Project Settings > API**.
3. Salin **Project URL** dan **anon public key** ke `supabase-config.js`.
4. Buka **SQL Editor**.
5. Jalankan seluruh isi `supabase-schema.sql`.
6. Di **Authentication > Providers**, aktifkan provider **Google**.
7. Atur URL aplikasi pada **Authentication > URL Configuration**:
   - **Site URL**: URL utama aplikasi.
   - **Redirect URLs**: URL aplikasi lokal/produksi yang digunakan.
8. Di konfigurasi Google OAuth, masukkan Client ID dan Client Secret dari Google Cloud Console sesuai panduan Supabase.

Konfigurasi frontend menggunakan `anon public key`, bukan service-role key. Jangan menaruh service-role key di repository.

Jalankan melalui web server, bukan `file://`, karena OAuth membutuhkan origin yang valid. Contoh server lokal:

```bash
npx serve .
```

## Perilaku chat

- Setiap orang login menggunakan akun Google/Gmail pribadi.
- Daftar akun yang pernah login tampil di panel anggota.
- Pilih anggota untuk membuka percakapan pribadi.
- Pesan tersinkron realtime melalui Supabase Realtime.
- Maksimum satu pesan: 2.000 karakter.
- Row Level Security membatasi percakapan dan pesan hanya kepada pesertanya.
