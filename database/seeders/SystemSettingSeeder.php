<?php

namespace Database\Seeders;

use App\Models\SystemSetting;
use Illuminate\Database\Seeder;

class SystemSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            [
                'key'   => 'app_name',
                'value' => 'LAPOR',
                'type'  => 'string',
            ],
            [
                'key'   => 'app_description',
                'value' => 'Layanan Aspirasi dan Pengaduan Online Rakyat',
                'type'  => 'string',
            ],
            [
                'key'   => 'institution_name',
                'value' => 'Pemerintah Kota',
                'type'  => 'string',
            ],
            [
                'key'   => 'anonymous_enabled',
                'value' => '1',
                'type'  => 'boolean',
            ],
            [
                'key'   => 'max_file_size',
                'value' => '10485760',
                'type'  => 'integer',
            ],
            [
                'key'   => 'captcha_enabled',
                'value' => '0',
                'type'  => 'boolean',
            ],
        ];

        foreach ($settings as $setting) {
            SystemSetting::create($setting);
        }
    }
}
