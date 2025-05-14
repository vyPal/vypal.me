<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Poll extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'title',
        'description',
        'is_public',
        'multiple_choice',
        'ends_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'is_public' => 'boolean',
        'multiple_choice' => 'boolean',
        'ends_at' => 'datetime',
    ];

    /**
     * Get the options for the poll.
     */
    public function options(): HasMany
    {
        return $this->hasMany(PollOption::class)->orderBy('sort_order');
    }

    /**
     * Get the user that owns the poll.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get all votes across all options in this poll.
     */
    public function allVotes(): HasManyThrough
    {
        return $this->hasManyThrough(PollVote::class, PollOption::class);
    }

    /**
     * Check if a poll is active/voting is allowed.
     */
    public function isActive(): bool
    {
        if (!$this->ends_at) {
            return true;
        }

        return now()->lessThan($this->ends_at);
    }

    /**
     * Check if a poll has ended.
     */
    public function hasEnded(): bool
    {
        if (!$this->ends_at) {
            return false;
        }

        return now()->greaterThan($this->ends_at);
    }
}