# Panduan Menyiapkan Proyek Firebase

Untuk membangun fitur-fitur keamanan keluarga, aplikasi kita memerlukan layanan backend dari Google Firebase. Ikuti langkah-langkah di bawah ini untuk membuat dan mengkonfigurasi proyek Firebase Anda.

---

### Langkah 1: Buat Proyek Firebase

1.  Buka Firebase Console: [https://console.firebase.google.com/](https://console.firebase.google.com/)
2.  Klik **"Create a project"** atau **"Add project"**.
3.  **Nama Proyek:** Masukkan nama yang relevan, misalnya `EloheemProtectApp`.
4.  **Google Analytics:** Anda bisa memilih untuk mengaktifkan atau menonaktifkan Google Analytics untuk proyek ini. Untuk sekarang, Anda bisa menonaktifkannya untuk mempercepat proses. Klik **"Continue"**.
5.  Klik **"Create project"** dan tunggu hingga prosesnya selesai.

---

### Langkah 2: Tambahkan Aplikasi Android ke Proyek Firebase

Setelah proyek dibuat, Anda akan masuk ke halaman dashboard proyek.

1.  Di tengah halaman, klik ikon **Android** (</>) untuk menambahkan aplikasi Android.
2.  **Android package name:** Ini adalah langkah yang **sangat penting**. Masukkan nama paket yang sudah kita tentukan:
    ```
    com.eloheemprotect
    ```
3.  **App nickname (Opsional):** Anda bisa memberinya nama panggilan seperti "EloheemProtect Android".
4.  **Debug signing certificate SHA-1 (Opsional untuk sekarang):** Anda bisa membiarkan ini kosong untuk saat ini. Kita bisa menambahkannya nanti jika diperlukan untuk fitur seperti Google Sign-In.
5.  Klik **"Register app"**.

---

### Langkah 3: Unduh File Konfigurasi

1.  Setelah mendaftarkan aplikasi, Firebase akan meminta Anda untuk mengunduh file konfigurasi. Klik tombol **"Download google-services.json"** untuk mengunduh file tersebut.
2.  **Simpan file ini baik-baik.** Saya akan meminta isi dari file ini pada langkah berikutnya.
3.  Setelah mengunduh, klik **"Next"**. Firebase akan menampilkan instruksi untuk menambahkan SDK, Anda bisa mengabaikannya dan klik **"Next"** lagi.
4.  Terakhir, klik **"Continue to console"**.

---

### Langkah 4: Aktifkan Layanan Firebase yang Dibutuhkan

Dari menu navigasi kiri di dalam dashboard proyek Firebase Anda:

#### A. Aktifkan Firestore Database (untuk menyimpan data)
1.  Klik **Build > Firestore Database**.
2.  Klik **"Create database"**.
3.  Pilih untuk memulai dalam **Test mode**. Ini akan memudahkan kita selama pengembangan. Anda akan melihat peringatan keamanan, ini tidak masalah untuk sekarang.
4.  Pilih lokasi Cloud Firestore. Pilih lokasi yang paling dekat dengan Anda (misalnya, `asia-southeast2` untuk Jakarta).
5.  Klik **"Enable"**.

#### B. Aktifkan Authentication (untuk login pengguna)
1.  Klik **Build > Authentication**.
2.  Klik **"Get started"**.
3.  Di bawah tab **"Sign-in method"**, pilih **"Email/Password"** dari daftar.
4.  Aktifkan (enable) provider Email/Password tersebut dan klik **"Save"**.

---

### Selesai!

Anda sekarang telah selesai dengan penyiapan di sisi Firebase. Langkah selanjutnya adalah Anda memberikan isi dari file `google-services.json` yang telah Anda unduh kepada saya agar saya bisa mengintegrasikannya ke dalam aplikasi.
