<?php

namespace Database\Seeders;

use App\Models\Unit;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Super Admin
        User::create([
            'name'              => 'Super Administrator',
            'email'             => 'admin@lapor.go.id',
            'email_verified_at' => now(),
            'password'          => Hash::make('password'),
            'phone'             => '081200000001',
            'role'              => 'admin',
            'is_active'         => true,
        ]);

        // Operators - each assigned to a different unit
        $unitPelayanan   = Unit::where('slug', 'unit-pelayanan-publik')->first();
        $unitInfra       = Unit::where('slug', 'unit-infrastruktur')->first();
        $unitPengawasan  = Unit::where('slug', 'unit-pengawasan')->first();

        User::create([
            'name'              => 'Operator Pelayanan Publik',
            'email'             => 'operator1@lapor.go.id',
            'email_verified_at' => now(),
            'password'          => Hash::make('password'),
            'phone'             => '081200000002',
            'role'              => 'operator',
            'is_active'         => true,
            'unit_id'           => $unitPelayanan?->id,
        ]);

        User::create([
            'name'              => 'Operator Infrastruktur',
            'email'             => 'operator2@lapor.go.id',
            'email_verified_at' => now(),
            'password'          => Hash::make('password'),
            'phone'             => '081200000003',
            'role'              => 'operator',
            'is_active'         => true,
            'unit_id'           => $unitInfra?->id,
        ]);

        User::create([
            'name'              => 'Operator Pengawasan',
            'email'             => 'operator3@lapor.go.id',
            'email_verified_at' => now(),
            'password'          => Hash::make('password'),
            'phone'             => '081200000004',
            'role'              => 'operator',
            'is_active'         => true,
            'unit_id'           => $unitPengawasan?->id,
        ]);

        // Pelapor (Reporters)
        $pelaporData = [
            ['name' => 'Ahmad Fauzi',     'email' => 'pelapor1@lapor.go.id', 'phone' => '081300000001'],
            ['name' => 'Siti Nurhaliza',   'email' => 'pelapor2@lapor.go.id', 'phone' => '081300000002'],
            ['name' => 'Budi Santoso',     'email' => 'pelapor3@lapor.go.id', 'phone' => '081300000003'],
            ['name' => 'Dewi Lestari',     'email' => 'pelapor4@lapor.go.id', 'phone' => '081300000004'],
            ['name' => 'Rizky Pratama',    'email' => 'pelapor5@lapor.go.id', 'phone' => '081300000005'],
        ];

        foreach ($pelaporData as $pelapor) {
            User::create([
                'name'              => $pelapor['name'],
                'email'             => $pelapor['email'],
                'email_verified_at' => now(),
                'password'          => Hash::make('password'),
                'phone'             => $pelapor['phone'],
                'role'              => 'pelapor',
                'is_active'         => true,
            ]);
        }
    }
}
