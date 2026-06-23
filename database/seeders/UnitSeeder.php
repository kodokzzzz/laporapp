<?php

namespace Database\Seeders;

use App\Models\Unit;
use Illuminate\Database\Seeder;

class UnitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $units = [
            [
                'name'        => 'Unit Pelayanan Publik',
                'description' => 'Menangani pengaduan terkait kualitas pelayanan publik di instansi pemerintah daerah.',
                'sla_days'    => 7,
            ],
            [
                'name'        => 'Unit Infrastruktur',
                'description' => 'Menangani laporan kondisi infrastruktur, jalan, jembatan, dan fasilitas umum.',
                'sla_days'    => 14,
            ],
            [
                'name'        => 'Unit Pengawasan',
                'description' => 'Menangani pengaduan dugaan korupsi, gratifikasi, dan pelanggaran integritas.',
                'sla_days'    => 10,
            ],
            [
                'name'        => 'Unit Pendidikan',
                'description' => 'Menangani permasalahan di bidang pendidikan, fasilitas sekolah, dan tenaga pendidik.',
                'sla_days'    => 14,
            ],
            [
                'name'        => 'Unit Kesehatan',
                'description' => 'Menangani pengaduan pelayanan kesehatan, fasilitas medis, dan program kesehatan.',
                'sla_days'    => 10,
            ],
            [
                'name'        => 'Unit Lingkungan',
                'description' => 'Menangani laporan pencemaran lingkungan, pengelolaan sampah, dan pelanggaran tata ruang.',
                'sla_days'    => 14,
            ],
            [
                'name'        => 'Sekretariat',
                'description' => 'Unit pengelola umum yang menangani pengaduan lintas sektor dan koordinasi antar unit.',
                'sla_days'    => 7,
            ],
        ];

        foreach ($units as $unit) {
            Unit::create($unit);
        }
    }
}
