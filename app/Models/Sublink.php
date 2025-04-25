<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Validator;

class Sublink extends Model
{
    use HasFactory;

    protected $fillable = [
        'link_id',
        'title',
        'url',
        'order',
    ];

    public function link(): BelongsTo
    {
        return $this->belongsTo(Link::class);
    }
}
