<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Schema\Builder;
use Illuminate\Support\Facades\Validator;

class Link extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'type',
        'url',
        'description',
        'order',
    ];

    public function sublinks(): HasMany
    {
        return $this->hasMany(Sublink::class)->orderBy('order');
    }

    public function validate(array $data): array
    {
        $validator = Validator::make($data, [
            'title' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'url' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'order' => 'required|integer',
        ]);

        return $validator->errors()->toArray();
    }
}
