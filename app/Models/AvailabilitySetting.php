<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AvailabilitySetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'available_from',
        'available_until',
        'is_available_now',
        'busy_message',
        'available_message',
        'project_backlog',
    ];

    protected $casts = [
        'available_from' => 'datetime',
        'available_until' => 'datetime',
        'is_available_now' => 'boolean',
        'project_backlog' => 'array',
    ];

    // Get the first record or create it if it doesn't exist
    public static function getSettings()
    {
        return self::firstOrCreate([
            'id' => 1
        ], [
            'available_from' => now()->addDays(30),
            'available_until' => now()->addDays(60),
            'is_available_now' => false,
            'busy_message' => "I'm currently busy with other projects.",
            'available_message' => "I have time now! Let's work together.",
            'project_backlog' => [],
        ]);
    }
}
