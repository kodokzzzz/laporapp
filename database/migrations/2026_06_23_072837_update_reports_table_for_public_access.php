<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('reports', function (Blueprint $table) {
            // Make user_id nullable for guest reports
            $table->unsignedBigInteger('user_id')->nullable()->change();

            // Add report type (pengaduan, aspirasi, permintaan_informasi)
            $table->string('type')->default('pengaduan')->after('description');
            
            // Add is_secret flag
            $table->boolean('is_secret')->default(false)->after('is_anonymous');
            
            // Add guest info
            $table->string('guest_name')->nullable()->after('is_secret');
            $table->string('guest_email')->nullable()->after('guest_name');
            $table->string('guest_phone')->nullable()->after('guest_email');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reports', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->nullable(false)->change();
            
            $table->dropColumn([
                'type',
                'is_secret',
                'guest_name',
                'guest_email',
                'guest_phone'
            ]);
        });
    }
};
