<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('print_logs', function (Blueprint $table) {
            $table->string('action_type')->default('lab_request')->after('patient_name');
        });
    }

    public function down(): void
    {
        Schema::table('print_logs', function (Blueprint $table) {
            $table->dropColumn('action_type');
        });
    }
};
