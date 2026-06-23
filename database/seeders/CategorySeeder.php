<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name'        => 'Pelayanan Publik',
                'description' => 'Pengaduan terkait kualitas pelayanan publik di instansi pemerintah, termasuk perizinan, administrasi kependudukan, dan layanan masyarakat lainnya.',
                'icon'        => 'building-office',
                'sort_order'  => 1,
            ],
            [
                'name'        => 'Infrastruktur',
                'description' => 'Laporan mengenai kondisi infrastruktur seperti jalan rusak, jembatan, drainase, fasilitas umum, dan sarana prasarana lainnya.',
                'icon'        => 'wrench-screwdriver',
                'sort_order'  => 2,
            ],
            [
                'name'        => 'Korupsi/Gratifikasi',
                'description' => 'Pengaduan terkait dugaan tindak pidana korupsi, gratifikasi, penyalahgunaan wewenang, dan pelanggaran integritas aparatur.',
                'icon'        => 'shield-exclamation',
                'sort_order'  => 3,
            ],
            [
                'name'        => 'Kekerasan/Perundungan',
                'description' => 'Laporan mengenai tindak kekerasan, perundungan (bullying), pelecehan, dan pelanggaran hak asasi manusia.',
                'icon'        => 'exclamation-triangle',
                'sort_order'  => 4,
            ],
            [
                'name'        => 'Lingkungan Hidup',
                'description' => 'Pengaduan terkait pencemaran lingkungan, pengelolaan sampah, kerusakan ekosistem, dan pelanggaran tata ruang.',
                'icon'        => 'globe-alt',
                'sort_order'  => 5,
            ],
            [
                'name'        => 'Pendidikan',
                'description' => 'Laporan mengenai permasalahan di bidang pendidikan, termasuk fasilitas sekolah, tenaga pendidik, kurikulum, dan pungutan liar.',
                'icon'        => 'academic-cap',
                'sort_order'  => 6,
            ],
            [
                'name'        => 'Kesehatan',
                'description' => 'Pengaduan terkait pelayanan kesehatan, fasilitas rumah sakit/puskesmas, ketersediaan obat, dan program kesehatan masyarakat.',
                'icon'        => 'heart',
                'sort_order'  => 7,
            ],
            [
                'name'        => 'Lainnya',
                'description' => 'Pengaduan dan aspirasi yang tidak termasuk dalam kategori di atas.',
                'icon'        => 'ellipsis-horizontal-circle',
                'sort_order'  => 8,
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
