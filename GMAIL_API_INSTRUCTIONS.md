# Panduan Mendapatkan Kredensial Gmail API untuk Aplikasi

Untuk mengintegrasikan fitur pengelolaan email, aplikasi ini memerlukan izin dari Anda melalui protokol OAuth 2.0 dari Google. Ikuti langkah-langkah di bawah ini untuk mendapatkan kredensial yang diperlukan dari Google Cloud Platform.

---

### Langkah 1: Buat atau Pilih Proyek di Google Cloud Console

1.  Buka Google Cloud Console: [https://console.cloud.google.com/](https://console.cloud.google.com/)
2.  Di bagian atas, klik pemilih proyek (di sebelah logo "Google Cloud").
3.  Klik **"New Project"**. Beri nama proyek yang relevan (misalnya, "Aplikasi Asisten Suara") dan klik **"Create"**.

---

### Langkah 2: Aktifkan Gmail API

1.  Pastikan proyek Anda yang baru sudah terpilih.
2.  Di bilah pencarian di bagian atas, ketik **"Gmail API"** dan pilih dari hasil pencarian.
3.  Klik tombol **"Enable"**. Tunggu beberapa saat hingga prosesnya selesai.

---

### Langkah 3: Konfigurasi Layar Persetujuan OAuth (OAuth Consent Screen)

Sebelum membuat kredensial, Anda harus menyiapkan layar persetujuan yang akan dilihat pengguna saat login.

1.  Dari menu navigasi kiri (hamburger menu), pergi ke **APIs & Services > OAuth consent screen**.
2.  Pilih tipe pengguna **"External"** dan klik **"Create"**.
3.  Isi informasi yang diperlukan:
    *   **App name:** Nama aplikasi Anda (misal: "Asisten Suara Pribadi").
    *   **User support email:** Alamat email Anda.
    *   **Developer contact information:** Alamat email Anda.
4.  Klik **"Save and Continue"**.
5.  Pada halaman **Scopes**, klik **"Add or Remove Scopes"**.
    *   Di filter, cari **"Gmail API"**.
    *   Pilih scope yang paling terbatas namun fungsional. Untuk membaca email, pilih `https.../auth/gmail.readonly`. **PENTING: Pilih scope `readonly` untuk keamanan.**
    *   Klik **"Update"**.
6.  Klik **"Save and Continue"**.
7.  Pada halaman **Test users**, klik **"Add Users"** dan tambahkan alamat email Gmail Anda sendiri. Ini penting agar Anda bisa menguji aplikasi selagi dalam mode pengembangan.
8.  Klik **"Save and Continue"**, lalu kembali ke dashboard.

---

### Langkah 4: Buat Kredensial OAuth 2.0 Client ID

Anda perlu membuat Client ID untuk **Android** dan **iOS**.

#### Untuk Android:

1.  Pergi ke **APIs & Services > Credentials**.
2.  Klik **"+ Create Credentials"** dan pilih **"OAuth client ID"**.
3.  Pilih **"Android"** dari dropdown Application type.
4.  **Package name:** Nama paket aplikasi kita. Masukkan: `com.eloheemprotect`
5.  **SHA-1 certificate fingerprint:** Ini adalah bagian yang paling teknis.
    *   Untuk pengujian di Expo Go, Anda bisa mendapatkan SHA-1 debug key dengan menjalankan perintah:
        ```bash
        npx expo credentials:android
        ```
    *   Ikuti petunjuknya. Anda akan mendapatkan sidik jari SHA-1. Salin dan tempelkan di sini.
6.  Klik **"Create"**. Salin **Android Client ID** yang muncul.

#### Untuk iOS:

1.  Kembali ke halaman Credentials, klik **"+ Create Credentials"** > **"OAuth client ID"** lagi.
2.  Pilih **"iOS"** dari dropdown.
3.  **Bundle ID:** Masukkan: `com.eloheemprotect`
4.  Klik **"Create"**. Salin **iOS Client ID** yang muncul.

---

### Langkah 5: Berikan Kredensial kepada Saya

Setelah Anda memiliki **Android Client ID** dan **iOS Client ID**, saya akan memintanya dari Anda untuk dimasukkan ke dalam konfigurasi aplikasi. Saya akan menambahkannya ke `config.ts` agar aplikasi bisa memulai proses otentikasi.

**Jangan pernah membagikan Client Secret atau file JSON kredensial Anda.** Untuk alur aplikasi mobile, hanya Client ID yang diperlukan di sisi aplikasi.
