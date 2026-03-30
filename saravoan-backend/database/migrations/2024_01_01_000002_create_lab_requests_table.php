<?php
// database/migrations/2024_01_01_000002_create_lab_requests_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lab_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('doctor_id')->constrained('users')->onDelete('cascade');
            $table->string('patient_name');
            $table->string('patient_telephone')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->enum('gender', ['male', 'female'])->nullable();
            $table->string('patient_id')->nullable();
            $table->decimal('weight', 5, 2)->nullable();
            $table->date('request_date');
            $table->time('request_time')->nullable();
            $table->text('clinical_history')->nullable();
            $table->string('doctor_name');
            $table->string('other_tests')->nullable();
            $table->json('selected_tests'); // array of test keys
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lab_requests');
    }
};
