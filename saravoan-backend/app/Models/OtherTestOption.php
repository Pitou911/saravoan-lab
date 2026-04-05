<?php
// app/Models/OtherTestOption.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class OtherTestOption extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
