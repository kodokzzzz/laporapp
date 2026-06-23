<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Report;
use App\Models\ReportComment;
use App\Models\ReportStatusLog;
use App\Models\Unit;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class ReportSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $pelapors   = User::where('role', 'pelapor')->get();
        $operators  = User::where('role', 'operator')->get();
        $admin      = User::where('role', 'admin')->first();
        $categories = Category::all();
        $units      = Unit::all();

        $reports = [
            // ── Pelayanan Publik ──────────────────────────
            [
                'title'         => 'Pelayanan KTP Lambat di Kecamatan Menteng',
                'description'   => 'Saya mengajukan pembuatan KTP baru sejak 3 bulan lalu di Kantor Kecamatan Menteng, namun sampai saat ini belum selesai. Petugas selalu bilang masih dalam proses tanpa memberikan kepastian waktu penyelesaian. Saya sudah datang lebih dari 5 kali dan selalu disuruh menunggu. Ini sangat menghambat aktivitas saya karena banyak keperluan yang membutuhkan KTP.',
                'category'      => 'Pelayanan Publik',
                'unit'          => 'Unit Pelayanan Publik',
                'status'        => 'diproses',
                'priority'      => 'tinggi',
                'location'      => 'Kecamatan Menteng, Jakarta Pusat',
                'incident_date' => Carbon::now()->subDays(90),
                'is_anonymous'  => false,
            ],
            [
                'title'         => 'Antrian Panjang di Kantor BPJS',
                'description'   => 'Antrian di kantor BPJS Cabang Gambir sangat panjang. Warga harus menunggu lebih dari 4 jam hanya untuk mengurus perubahan data. Sistem antrian online sering error dan tidak bisa diakses. Mohon diperbaiki sistem pelayanan agar lebih efisien dan tidak menyulitkan masyarakat.',
                'category'      => 'Pelayanan Publik',
                'unit'          => 'Unit Pelayanan Publik',
                'status'        => 'diterima',
                'priority'      => 'sedang',
                'location'      => 'BPJS Cabang Gambir, Jakarta Pusat',
                'incident_date' => Carbon::now()->subDays(5),
                'is_anonymous'  => false,
            ],
            [
                'title'         => 'Petugas Kelurahan Tidak Ramah',
                'description'   => 'Saat mengurus surat pengantar di Kelurahan Kebon Jeruk, petugas loket sangat tidak ramah dan kasar kepada warga. Bahkan membentak orang tua yang tidak membawa fotokopi persyaratan. Seharusnya pelayanan publik dilakukan dengan sopan dan membantu masyarakat, bukan malah mempersulit.',
                'category'      => 'Pelayanan Publik',
                'unit'          => 'Unit Pelayanan Publik',
                'status'        => 'diverifikasi',
                'priority'      => 'sedang',
                'location'      => 'Kelurahan Kebon Jeruk, Jakarta Barat',
                'incident_date' => Carbon::now()->subDays(10),
                'is_anonymous'  => true,
            ],

            // ── Infrastruktur ──────────────────────────
            [
                'title'         => 'Jalan Berlubang di Jl. Sudirman',
                'description'   => 'Jalan Sudirman di depan gedung Wisma Nusantara terdapat lubang besar yang sangat berbahaya bagi pengendara motor. Sudah ada beberapa kecelakaan akibat lubang ini. Lubang berdiameter sekitar 1 meter dan kedalaman sekitar 30 cm. Di malam hari sangat sulit terlihat karena penerangan jalan juga minim.',
                'category'      => 'Infrastruktur',
                'unit'          => 'Unit Infrastruktur',
                'status'        => 'selesai',
                'priority'      => 'mendesak',
                'location'      => 'Jl. Jend. Sudirman, Jakarta Selatan',
                'incident_date' => Carbon::now()->subDays(30),
                'is_anonymous'  => false,
            ],
            [
                'title'         => 'Lampu Jalan Mati di Perumahan Griya Asri',
                'description'   => 'Lampu jalan di sepanjang Jl. Mawar Perumahan Griya Asri sudah mati selama 2 minggu. Kondisi ini sangat membahayakan warga yang beraktivitas di malam hari. Sudah dilaporkan ke RT/RW namun belum ada tindak lanjut dari pemerintah kota.',
                'category'      => 'Infrastruktur',
                'unit'          => 'Unit Infrastruktur',
                'status'        => 'diproses',
                'priority'      => 'tinggi',
                'location'      => 'Perumahan Griya Asri, Bekasi',
                'incident_date' => Carbon::now()->subDays(14),
                'is_anonymous'  => false,
            ],
            [
                'title'         => 'Drainase Tersumbat Menyebabkan Banjir',
                'description'   => 'Saluran drainase di Jl. Raya Bogor KM 25 tersumbat oleh sampah dan sedimen sehingga setiap hujan deras air meluap ke jalan dan membanjiri pemukiman warga. Banjir bisa mencapai ketinggian 50 cm dan merusak perabotan rumah tangga warga.',
                'category'      => 'Infrastruktur',
                'unit'          => 'Unit Infrastruktur',
                'status'        => 'diteruskan',
                'priority'      => 'mendesak',
                'location'      => 'Jl. Raya Bogor KM 25, Jakarta Timur',
                'incident_date' => Carbon::now()->subDays(7),
                'is_anonymous'  => false,
            ],
            [
                'title'         => 'Trotoar Rusak dan Tidak Layak',
                'description'   => 'Trotoar di sepanjang Jl. Gatot Subroto rusak parah. Banyak ubin yang copot dan berlubang. Pejalan kaki, terutama penyandang disabilitas, sangat kesulitan menggunakan trotoar ini. Beberapa titik bahkan sudah ditumbuhi rumput liar.',
                'category'      => 'Infrastruktur',
                'unit'          => 'Unit Infrastruktur',
                'status'        => 'diterima',
                'priority'      => 'sedang',
                'location'      => 'Jl. Gatot Subroto, Jakarta Selatan',
                'incident_date' => Carbon::now()->subDays(3),
                'is_anonymous'  => false,
            ],

            // ── Korupsi/Gratifikasi ──────────────────────────
            [
                'title'         => 'Dugaan Pungutan Liar di Dinas Perizinan',
                'description'   => 'Saya dimintai uang tambahan sebesar Rp500.000 oleh oknum petugas Dinas Perizinan untuk mempercepat proses penerbitan IMB. Petugas tersebut mengatakan jika tidak membayar, proses akan memakan waktu lebih dari 6 bulan. Ini jelas merupakan pungli dan merugikan masyarakat.',
                'category'      => 'Korupsi/Gratifikasi',
                'unit'          => 'Unit Pengawasan',
                'status'        => 'diverifikasi',
                'priority'      => 'tinggi',
                'location'      => 'Dinas Perizinan Kota Tangerang',
                'incident_date' => Carbon::now()->subDays(15),
                'is_anonymous'  => true,
            ],
            [
                'title'         => 'Mark-up Anggaran Proyek Pembangunan Jalan',
                'description'   => 'Terdapat indikasi mark-up anggaran pada proyek pembangunan jalan di Desa Sukamaju. Anggaran yang disetujui sebesar Rp2 miliar, namun kualitas jalan yang dibangun sangat buruk dan tidak sesuai spesifikasi. Aspal tipis dan sudah retak setelah 3 bulan pembangunan selesai.',
                'category'      => 'Korupsi/Gratifikasi',
                'unit'          => 'Unit Pengawasan',
                'status'        => 'diproses',
                'priority'      => 'mendesak',
                'location'      => 'Desa Sukamaju, Kabupaten Bogor',
                'incident_date' => Carbon::now()->subDays(45),
                'is_anonymous'  => true,
            ],

            // ── Kekerasan/Perundungan ──────────────────────────
            [
                'title'         => 'Perundungan di SMP Negeri 5',
                'description'   => 'Anak saya mengalami perundungan (bullying) oleh sekelompok siswa di SMP Negeri 5. Sudah dilaporkan ke pihak sekolah dan wali kelas namun tidak ada tindakan tegas. Anak saya trauma dan tidak mau sekolah selama 2 minggu. Mohon tindakan dari Dinas Pendidikan.',
                'category'      => 'Kekerasan/Perundungan',
                'unit'          => 'Unit Pendidikan',
                'status'        => 'diproses',
                'priority'      => 'tinggi',
                'location'      => 'SMP Negeri 5, Depok',
                'incident_date' => Carbon::now()->subDays(20),
                'is_anonymous'  => false,
            ],
            [
                'title'         => 'Kekerasan dalam Rumah Tangga di RT 03',
                'description'   => 'Tetangga saya sering mengalami kekerasan fisik oleh suaminya. Teriakan dan tangisan terdengar hampir setiap malam. Sudah beberapa kali terlihat memar di wajah dan tangan korban. Mohon ditindaklanjuti untuk perlindungan korban.',
                'category'      => 'Kekerasan/Perundungan',
                'unit'          => 'Unit Pelayanan Publik',
                'status'        => 'diterima',
                'priority'      => 'mendesak',
                'location'      => 'RT 03/RW 05, Kelurahan Cipinang, Jakarta Timur',
                'incident_date' => Carbon::now()->subDays(2),
                'is_anonymous'  => true,
            ],

            // ── Lingkungan Hidup ──────────────────────────
            [
                'title'         => 'Pencemaran Sungai oleh Pabrik Tekstil',
                'description'   => 'Pabrik tekstil PT Maju Jaya membuang limbah cair langsung ke Sungai Citarum tanpa pengolahan. Air sungai berubah warna menjadi hitam dan berbau menyengat. Warga sekitar mengeluh gatal-gatal setelah kontak dengan air sungai. Ikan-ikan di sungai juga banyak yang mati.',
                'category'      => 'Lingkungan Hidup',
                'unit'          => 'Unit Lingkungan',
                'status'        => 'diproses',
                'priority'      => 'mendesak',
                'location'      => 'Sungai Citarum, Karawang',
                'incident_date' => Carbon::now()->subDays(60),
                'is_anonymous'  => false,
            ],
            [
                'title'         => 'TPA Ilegal di Lahan Kosong',
                'description'   => 'Terdapat TPA ilegal di lahan kosong di belakang Perumahan Taman Sari. Sampah menumpuk dan menimbulkan bau tidak sedap serta menjadi sarang nyamuk dan tikus. Warga sekitar sudah sering sakit demam berdarah. Mohon segera ditutup dan dilakukan pembersihan.',
                'category'      => 'Lingkungan Hidup',
                'unit'          => 'Unit Lingkungan',
                'status'        => 'selesai',
                'priority'      => 'tinggi',
                'location'      => 'Perumahan Taman Sari, Tangerang',
                'incident_date' => Carbon::now()->subDays(40),
                'is_anonymous'  => false,
            ],
            [
                'title'         => 'Penebangan Pohon Tanpa Izin',
                'description'   => 'Di area Taman Kota Menteng, puluhan pohon besar ditebang tanpa izin dan tanpa penjelasan kepada masyarakat. Pohon-pohon tersebut berusia puluhan tahun dan merupakan peneduh area taman. Diduga terkait proyek pembangunan mall baru.',
                'category'      => 'Lingkungan Hidup',
                'unit'          => 'Unit Lingkungan',
                'status'        => 'diverifikasi',
                'priority'      => 'tinggi',
                'location'      => 'Taman Kota Menteng, Jakarta Pusat',
                'incident_date' => Carbon::now()->subDays(8),
                'is_anonymous'  => false,
            ],

            // ── Pendidikan ──────────────────────────
            [
                'title'         => 'Gedung Sekolah Rusak Berat',
                'description'   => 'Gedung SDN 3 Sukabumi dalam kondisi rusak berat. Atap kelas 4 dan 5 sudah bocor parah, tembok retak, dan lantai berlubang. Siswa harus belajar di tenda darurat saat hujan. Kondisi ini sudah berlangsung lebih dari 1 tahun dan sangat mempengaruhi proses belajar mengajar.',
                'category'      => 'Pendidikan',
                'unit'          => 'Unit Pendidikan',
                'status'        => 'diproses',
                'priority'      => 'tinggi',
                'location'      => 'SDN 3 Sukabumi, Jawa Barat',
                'incident_date' => Carbon::now()->subDays(365),
                'is_anonymous'  => false,
            ],
            [
                'title'         => 'Guru Honorer Belum Menerima Gaji 4 Bulan',
                'description'   => 'Para guru honorer di SDN 12 Cibinong belum menerima gaji selama 4 bulan terakhir. Mereka tetap mengajar dengan penuh dedikasi namun hak mereka diabaikan. Sudah berkali-kali mengajukan permohonan ke Dinas Pendidikan namun belum ada jawaban.',
                'category'      => 'Pendidikan',
                'unit'          => 'Unit Pendidikan',
                'status'        => 'ditolak',
                'priority'      => 'tinggi',
                'location'      => 'SDN 12 Cibinong, Kabupaten Bogor',
                'incident_date' => Carbon::now()->subDays(120),
                'is_anonymous'  => false,
            ],
            [
                'title'         => 'Pungutan Liar di Penerimaan Siswa Baru',
                'description'   => 'Saat mendaftarkan anak di SMPN 1 Cikupa, saya diminta membayar uang "sumbangan pembangunan" sebesar Rp5 juta sebagai syarat diterima. Ini bertentangan dengan kebijakan pemerintah tentang pendidikan gratis. Banyak orang tua lain juga mengalami hal serupa.',
                'category'      => 'Pendidikan',
                'unit'          => 'Unit Pendidikan',
                'status'        => 'diterima',
                'priority'      => 'sedang',
                'location'      => 'SMPN 1 Cikupa, Tangerang',
                'incident_date' => Carbon::now()->subDays(5),
                'is_anonymous'  => true,
            ],

            // ── Kesehatan ──────────────────────────
            [
                'title'         => 'Puskesmas Kekurangan Obat',
                'description'   => 'Puskesmas Kecamatan Cilandak selama 1 bulan terakhir kekurangan stok obat dasar seperti parasetamol, amoxicillin, dan obat diare. Pasien yang berobat malah disuruh beli sendiri di apotek. Ini sangat memberatkan warga kurang mampu yang bergantung pada Puskesmas.',
                'category'      => 'Kesehatan',
                'unit'          => 'Unit Kesehatan',
                'status'        => 'diproses',
                'priority'      => 'tinggi',
                'location'      => 'Puskesmas Kecamatan Cilandak, Jakarta Selatan',
                'incident_date' => Carbon::now()->subDays(30),
                'is_anonymous'  => false,
            ],
            [
                'title'         => 'RSUD Menolak Pasien BPJS',
                'description'   => 'Ibu saya yang merupakan peserta BPJS PBI ditolak saat hendak rawat inap di RSUD Kota. Petugas mengatakan ruangan penuh, namun ternyata masih ada kamar kosong untuk pasien umum. Ini diskriminasi terhadap peserta BPJS dan melanggar hak pasien.',
                'category'      => 'Kesehatan',
                'unit'          => 'Unit Kesehatan',
                'status'        => 'diverifikasi',
                'priority'      => 'mendesak',
                'location'      => 'RSUD Kota Tangerang',
                'incident_date' => Carbon::now()->subDays(12),
                'is_anonymous'  => false,
            ],
            [
                'title'         => 'Ambulans Desa Tidak Layak Operasi',
                'description'   => 'Ambulans satu-satunya di Desa Karangsari sudah tidak layak beroperasi. Mesin sering mogok dan AC sudah rusak. Ketika ada warga yang sakit darurat, ambulans tidak bisa digunakan sehingga warga harus mencari transportasi sendiri ke rumah sakit yang jaraknya 30 km.',
                'category'      => 'Kesehatan',
                'unit'          => 'Unit Kesehatan',
                'status'        => 'selesai',
                'priority'      => 'tinggi',
                'location'      => 'Desa Karangsari, Kabupaten Purwakarta',
                'incident_date' => Carbon::now()->subDays(50),
                'is_anonymous'  => false,
            ],

            // ── Lainnya ──────────────────────────
            [
                'title'         => 'Pedagang Kaki Lima Mengganggu Lalu Lintas',
                'description'   => 'PKL di sepanjang Jl. Tanah Abang memakan setengah badan jalan sehingga lalu lintas sering macet total. Sudah beberapa kali ditertibkan namun selalu kembali lagi. Perlu solusi permanen seperti penyediaan area khusus PKL agar tidak mengganggu lalu lintas.',
                'category'      => 'Lainnya',
                'unit'          => 'Sekretariat',
                'status'        => 'diterima',
                'priority'      => 'sedang',
                'location'      => 'Jl. Tanah Abang, Jakarta Pusat',
                'incident_date' => Carbon::now()->subDays(7),
                'is_anonymous'  => false,
            ],
            [
                'title'         => 'Kebisingan dari Proyek Konstruksi di Malam Hari',
                'description'   => 'Proyek pembangunan apartemen di Jl. HR Rasuna Said beroperasi hingga larut malam bahkan dini hari. Suara bising dari alat berat sangat mengganggu warga sekitar. Anak-anak tidak bisa tidur dan orang sakit bertambah parah kondisinya.',
                'category'      => 'Lainnya',
                'unit'          => 'Sekretariat',
                'status'        => 'diproses',
                'priority'      => 'sedang',
                'location'      => 'Jl. HR Rasuna Said, Jakarta Selatan',
                'incident_date' => Carbon::now()->subDays(14),
                'is_anonymous'  => false,
            ],
            [
                'title'         => 'WiFi Gratis di Taman Kota Tidak Berfungsi',
                'description'   => 'Fasilitas WiFi gratis yang dijanjikan pemerintah kota di Taman Kota sudah tidak berfungsi selama 3 bulan. Padahal banyak pelajar yang memanfaatkan fasilitas ini untuk belajar online. Mohon segera diperbaiki.',
                'category'      => 'Lainnya',
                'unit'          => 'Sekretariat',
                'status'        => 'selesai',
                'priority'      => 'rendah',
                'location'      => 'Taman Kota BSD, Tangerang Selatan',
                'incident_date' => Carbon::now()->subDays(90),
                'is_anonymous'  => false,
            ],
            [
                'title'         => 'Parkir Liar di Trotoar Jl. Thamrin',
                'description'   => 'Motor-motor diparkir liar di atas trotoar Jl. Thamrin sehingga pejalan kaki harus turun ke jalan raya. Sangat berbahaya terutama bagi anak-anak dan orang tua. Petugas parkir liar juga memungut biaya yang tidak resmi.',
                'category'      => 'Lainnya',
                'unit'          => 'Sekretariat',
                'status'        => 'ditolak',
                'priority'      => 'rendah',
                'location'      => 'Jl. MH Thamrin, Jakarta Pusat',
                'incident_date' => Carbon::now()->subDays(25),
                'is_anonymous'  => false,
            ],
            [
                'title'         => 'Fasilitas MCK Pasar Tradisional Tidak Layak',
                'description'   => 'Toilet umum di Pasar Tradisional Ciputat dalam kondisi sangat kotor dan tidak layak pakai. Air tidak mengalir, tidak ada penerangan, dan pintu rusak. Pedagang dan pengunjung pasar terpaksa menggunakan fasilitas di masjid terdekat yang juga sudah overload.',
                'category'      => 'Infrastruktur',
                'unit'          => 'Unit Infrastruktur',
                'status'        => 'diterima',
                'priority'      => 'sedang',
                'location'      => 'Pasar Tradisional Ciputat, Tangerang Selatan',
                'incident_date' => Carbon::now()->subDays(10),
                'is_anonymous'  => false,
            ],
            [
                'title'         => 'Kebocoran Pipa Air PDAM',
                'description'   => 'Pipa air PDAM di Jl. Merdeka Barat bocor besar sudah 3 hari. Air bersih terbuang percuma dan jalan menjadi licin berbahaya. Warga di sekitar lokasi kebocoran juga kekurangan pasokan air bersih. Sudah dilaporkan ke PDAM namun belum ada petugas yang datang.',
                'category'      => 'Infrastruktur',
                'unit'          => 'Unit Infrastruktur',
                'status'        => 'diproses',
                'priority'      => 'mendesak',
                'location'      => 'Jl. Merdeka Barat, Jakarta Pusat',
                'incident_date' => Carbon::now()->subDays(3),
                'is_anonymous'  => false,
            ],
            [
                'title'         => 'Pelayanan IGD Rumah Sakit Lambat',
                'description'   => 'Saat membawa anak saya yang demam tinggi ke IGD RS Harapan Bunda, kami harus menunggu lebih dari 2 jam sebelum ditangani dokter. Perawat hanya memberikan obat penurun panas tanpa pemeriksaan lebih lanjut. Pelayanan IGD seharusnya cepat dan tanggap.',
                'category'      => 'Kesehatan',
                'unit'          => 'Unit Kesehatan',
                'status'        => 'diterima',
                'priority'      => 'tinggi',
                'location'      => 'RS Harapan Bunda, Bekasi',
                'incident_date' => Carbon::now()->subDays(1),
                'is_anonymous'  => false,
            ],
        ];

        // Comment templates for realistic data
        $commentTemplates = [
            'comment' => [
                'Terima kasih atas laporannya. Kami sedang meninjau laporan ini.',
                'Laporan Anda telah kami terima dan akan segera ditindaklanjuti.',
                'Kami membutuhkan informasi tambahan. Mohon lengkapi data pendukung.',
                'Tim kami sudah turun ke lapangan untuk verifikasi.',
                'Terima kasih atas kesabaran Anda. Proses sedang berjalan.',
                'Kami telah berkoordinasi dengan instansi terkait.',
                'Perbaikan sedang dalam proses pelaksanaan.',
                'Laporan ini akan kami prioritaskan penanganannya.',
                'Mohon maaf atas ketidaknyamanan yang Anda alami.',
                'Kami akan memastikan hal ini tidak terulang kembali.',
            ],
            'status_change' => [
                'Status laporan diperbarui sesuai perkembangan terbaru.',
                'Laporan telah diverifikasi dan ditindaklanjuti.',
                'Proses penanganan telah dimulai oleh tim terkait.',
                'Laporan telah selesai ditangani.',
            ],
            'assignment' => [
                'Laporan telah didisposisikan ke unit terkait untuk penanganan.',
                'Operator telah ditugaskan untuk menindaklanjuti laporan ini.',
            ],
            'forward' => [
                'Laporan diteruskan ke instansi yang lebih berwenang.',
                'Laporan dialihkan ke unit teknis untuk penanganan lebih lanjut.',
            ],
        ];

        $statusFlow = [
            'diterima'     => [],
            'diverifikasi' => ['diterima'],
            'diproses'     => ['diterima', 'diverifikasi'],
            'selesai'      => ['diterima', 'diverifikasi', 'diproses'],
            'ditolak'      => ['diterima', 'diverifikasi'],
            'diteruskan'   => ['diterima', 'diverifikasi'],
        ];

        foreach ($reports as $index => $reportData) {
            $category = $categories->firstWhere('name', $reportData['category']);
            $unit     = $units->firstWhere('name', $reportData['unit']);
            $pelapor  = $pelapors[$index % $pelapors->count()];

            // Choose an operator for the unit or randomly
            $operator = $operators->first(function ($op) use ($unit) {
                return $op->unit_id === $unit?->id;
            }) ?? $operators->random();

            // Calculate deadline based on unit SLA
            $createdAt = Carbon::now()->subDays(rand(1, 60));
            $deadline  = (clone $createdAt)->addDays($unit?->sla_days ?? 14);

            $report = Report::create([
                'title'            => $reportData['title'],
                'description'      => $reportData['description'],
                'category_id'      => $category->id,
                'unit_id'          => $unit?->id,
                'user_id'          => $pelapor->id,
                'assigned_to'      => in_array($reportData['status'], ['diproses', 'selesai', 'diteruskan']) ? $operator->id : null,
                'status'           => $reportData['status'],
                'priority'         => $reportData['priority'],
                'is_anonymous'     => $reportData['is_anonymous'],
                'location'         => $reportData['location'],
                'incident_date'    => $reportData['incident_date'],
                'deadline'         => $deadline,
                'resolved_at'      => $reportData['status'] === 'selesai' ? Carbon::now()->subDays(rand(1, 5)) : null,
                'rejection_reason' => $reportData['status'] === 'ditolak' ? 'Laporan tidak memenuhi kriteria penanganan atau bukan wewenang instansi ini. Silakan ajukan ke instansi yang berwenang.' : null,
                'created_at'       => $createdAt,
                'updated_at'       => Carbon::now()->subDays(rand(0, 5)),
            ]);

            // Create status logs based on status flow
            $flow = $statusFlow[$reportData['status']] ?? [];
            $flow[] = $reportData['status'];

            $previousStatus = null;
            $logTime = clone $createdAt;

            foreach ($flow as $flowStatus) {
                $logTime = $logTime->copy()->addHours(rand(1, 48));
                $changedByUser = ($flowStatus === 'diterima') ? $admin : $operator;

                ReportStatusLog::create([
                    'report_id'   => $report->id,
                    'from_status' => $previousStatus,
                    'to_status'   => $flowStatus,
                    'changed_by'  => $changedByUser->id,
                    'notes'       => $commentTemplates['status_change'][array_rand($commentTemplates['status_change'])],
                    'created_at'  => $logTime,
                    'updated_at'  => $logTime,
                ]);

                $previousStatus = $flowStatus;
            }

            // Create 1-3 comments per report
            $commentCount = rand(1, 3);
            $commentTime  = clone $createdAt;

            for ($c = 0; $c < $commentCount; $c++) {
                $commentTime = $commentTime->copy()->addHours(rand(2, 72));
                $commentType = ['comment', 'comment', 'comment', 'status_change', 'assignment'][array_rand(['comment', 'comment', 'comment', 'status_change', 'assignment'])];
                $commentUser = ($c === 0) ? $operator : (rand(0, 1) ? $admin : $pelapor);

                ReportComment::create([
                    'report_id'   => $report->id,
                    'user_id'     => $commentUser->id,
                    'content'     => $commentTemplates[$commentType][array_rand($commentTemplates[$commentType])],
                    'is_internal' => $commentUser->role !== 'pelapor' && rand(0, 1),
                    'type'        => $commentType,
                    'created_at'  => $commentTime,
                    'updated_at'  => $commentTime,
                ]);
            }
        }
    }
}
