<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('other_test_options', function (Blueprint $table) {
            $table->string('sample_type')->nullable()->after('category');
            $table->string('collection_container')->nullable()->after('sample_type');
        });
    }

    public function down(): void
    {
        Schema::table('other_test_options', function (Blueprint $table) {
            $table->dropColumn(['sample_type', 'collection_container']);
        });
    }
};