# 📢 LAPOR! (Layanan Aspirasi dan Pengaduan Online Rakyat)

LAPOR! adalah platform aplikasi berbasis web modern yang dirancang untuk memfasilitasi masyarakat dalam menyampaikan keluhan, aspirasi, dan permintaan informasi kepada instansi pemerintah. Aplikasi ini dikembangkan menggunakan tumpukan teknologi modern **Laravel 12**, **React.js**, dan **Inertia.js**, menyajikan antarmuka pengguna bergaya SPA (*Single Page Application*) yang sangat responsif, dinamis, dan estetik.

## ✨ Fitur Utama

### 🧑‍💻 Fitur Publik (Masyarakat Umum)
- **Pelaporan Tanpa Login (Guest Reporting):** Masyarakat bisa mengirimkan pengaduan secara cepat, efisien, dan opsional bersifat anonim.
- **Pelacakan Tiket (Track Status):** Setelah melapor, pelapor mendapatkan **Nomor Tiket** unik untuk melacak proses penyelesaian laporannya secara *real-time*.
- **Halaman Statistik Terbuka:** Transparansi kinerja instansi dapat dilihat publik yang meliputi grafik jumlah laporan masuk, distribusi status, dan rata-rata durasi penyelesaian laporan.

### 🛡️ Fitur Operator (Petugas Penanganan)
- **Dasbor Produktivitas:** Menampilkan metrik dan laporan-laporan yang ditugaskan secara spesifik kepada *operator* tersebut.
- **Manajemen Status Laporan:** Pengubahan status laporan secara terstruktur, mulai dari *Diterima*, *Diverifikasi*, *Diproses*, *Selesai*, hingga *Ditolak*.
- **Fitur Eskalasi / Diteruskan:** Kemampuan meneruskan laporan ke **Unit Lain** beserta lampiran pesannya jika laporan salah alamat atau membutuhkan tindak lanjut ekstra di lapangan.
- **Notifikasi *Real-Time*:** Pemberitahuan otomatis (dalam-aplikasi) apabila mendapatkan penugasan laporan baru.

### 👑 Fitur Administrator
- **Dasbor Utama (Command Center):** Memantau semua aktivitas pelaporan lintas-unit secara *helicopter view*.
- **Manajemen Pengguna (User Management):** Antarmuka CRUD khusus untuk mendaftarkan, mengedit, melakukan *reset password*, dan mengaktifkan/menonaktifkan seluruh akun.
- **Manajemen Kategori:** Pengaturan bebas untuk kategori-kategori laporan publik (Infrastruktur, Pelayanan, Korupsi, dll).
- **Manajemen Unit Organisasi:** Penambahan divisi/unit kerja untuk mengatur wewenang dan menampung operator-operator penanganan.

---

## 💻 Tech Stack

- **Backend:** Laravel 12 (PHP 8.2+)
- **Frontend:** React 18
- **Routing & State:** Inertia.js v2
- **Desain & Styling:** Vanilla CSS (Sistem Desain Kustom Ekstra Premium) + Utilitas Tailwind
- **Database:** SQLite (Bawaan) / Mendukung MySQL & PostgreSQL

---

## 🚀 Panduan Instalasi (Local Development)

Ikuti langkah-langkah di bawah ini untuk mengunduh dan menjalankan aplikasi LAPOR! di mesin lokal Anda.

### 1. Kloning Repositori
```bash
git clone https://github.com/kodokzzzz/laporapp.git
cd laporapp
```

### 2. Install Dependensi Backend (PHP)
```bash
composer install
```

### 3. Install Dependensi Frontend (Node.js)
```bash
npm install
```

### 4. Konfigurasi Environment
Buat salinan file konfigurasi bawaan agar Laravel dapat membaca setelan Anda.
```bash
cp .env.example .env
```
Setelah disalin, buat (generate) kunci enkripsi aplikasi:
```bash
php artisan key:generate
```

### 5. Setup Database
Pastikan *file database default* SQLite kosong sudah siap (otomatis tersedia di `database/database.sqlite`).
Kemudian, jalankan perintah migrasi beserta eksekusi data *seeder* untuk membuat kerangka tabel dan menginisialisasi akun-akun administrator, operator, maupun contoh laporan *dummy*:
```bash
php artisan migrate:fresh --seed
```

### 6. Build Aset Frontend & Jalankan Server Lokal
Untuk menyalakan server lokal sekaligus memproses *build hot-reload* menggunakan Vite, Anda butuh membuka **dua jendela terminal** secara bersamaan:

**Jendela Terminal 1 (Jalankan Vite):**
```bash
npm run dev
```

**Jendela Terminal 2 (Jalankan Backend Laravel):**
```bash
php artisan serve
```

Selesai! Aplikasi sudah menyala dan bisa langsung diakses melalui peramban pada tautan:
👉 **http://localhost:8000**

---

## 🔑 Akun Default (Bawaan Seeder)

Untuk mempermudah proses masuk (*login*) perdana saat melakukan uji coba, *database seeder* telah menyediakan beberapa akun *default*.

**Password Global (Berlaku Untuk Semua Akun di Bawah Ini):** `password`

| Akses/Role | Alamat Email | Hak Spesifik |
| :--- | :--- | :--- |
| **Admin** | `admin@lapor.go.id` | Kontrol penuh, ubah *password*, tambah unit & kategori |
| **Operator 1** | `operator1@lapor.go.id` | Menangani tiket untuk Unit Pelayanan |
| **Operator 2** | `operator2@lapor.go.id` | Menangani tiket untuk Unit Infrastruktur |
| **Pelapor Umum** | `pelapor1@lapor.go.id` | Dashboard pelapor (masyarakat yang memiliki akun) |

*(Silakan periksa file `/database/seeders/UserSeeder.php` jika Anda ingin menginspeksi lebih banyak contoh alamat email)*

---

## 📜 Lisensi

Aplikasi *open-source* yang dikembangkan secara eksperimental menggunakan sistem Agen-AI Cerdas tingkat lanjut (Gemini).
Dapat digunakan untuk edukasi, portofolio, dan dimodifikasi secara bebas.
