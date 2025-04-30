<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Poll extends Model {
    protected $fillable = [
        'title', 'description', 'type', 'allow_multiple',
        'allow_custom', 'show_results_without_voting', 'is_active', 'order'
    ];

    public function options() {
        return $this->hasMany(PollOption::class)->orderBy('order');
    }

    public function votes() {
        return $this->hasMany(PollVote::class);
    }
}
