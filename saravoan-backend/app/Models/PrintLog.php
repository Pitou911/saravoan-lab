<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PrintLog extends Model
{
    protected $fillable = [
        'doctor_id',
        'tests',
        'patient_name',
        'action_type',
    ];

    protected $casts = [
        'tests' => 'array',
    ];

    public function doctor()
    {
        return $this->belongsTo(User::class, 'doctor_id');
    }
}
