<?php
// database/migrations/2024_01_01_000004_create_other_test_options_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('other_test_options', function (Blueprint $table) {
            $table->id();
            $table->string('name');           // e.g. "Vitamin C"
            $table->string('category')->nullable(); // optional grouping
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('other_test_options');
    }
};
