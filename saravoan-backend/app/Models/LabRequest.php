<?php
// app/Models/LabRequest.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class LabRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'doctor_id',
        'patient_name',
        'patient_telephone',
        'date_of_birth',
        'gender',
        'patient_id',
        'weight',
        'request_date',
        'request_time',
        'clinical_history',
        'doctor_name',
        'other_tests',
        'selected_tests',
    ];

    protected $casts = [
        'selected_tests' => 'array',
        'date_of_birth'  => 'date',
        'request_date'   => 'date',
    ];

    public function doctor()
    {
        return $this->belongsTo(User::class, 'doctor_id');
    }
}
