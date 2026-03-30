<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PrintLog extends Model
{
    protected $fillable = [
        'doctor_id',
        'tests',
        'patient_name'
    ];

    protected $casts = [
        'tests' => 'array'
    ];
}
