<?php
// database/migrations/2024_01_01_000003_create_test_packages_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('test_packages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('doctor_id')->constrained('users')->onDelete('cascade');
            $table->string('name'); // e.g. "Full Blood Panel"
            $table->text('description')->nullable();
            $table->json('selected_tests'); // array of test keys
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('test_packages');
    }
};
