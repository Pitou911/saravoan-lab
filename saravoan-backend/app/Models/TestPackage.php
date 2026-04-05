<?php
// app/Models/TestPackage.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TestPackage extends Model
{
    use HasFactory;

    protected $fillable = [
        'doctor_id',
        'name',
        'description',
        'selected_tests',
    ];

    protected $casts = [
        'selected_tests' => 'array',
    ];

    public function doctor()
    {
        return $this->belongsTo(User::class, 'doctor_id');
    }
}
