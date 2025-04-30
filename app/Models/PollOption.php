<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PollOption extends Model {
    protected $fillable = [
        'poll_id', 'title', 'color', 'icon', 'description', 'order'
    ];

    public function poll() {
        return $this->belongsTo(Poll::class);
    }

    public function votes() {
        return $this->hasMany(PollVote::class);
    }
}
