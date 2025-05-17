<?php

namespace App\Http\Controllers;

use App\Models\Poll;
use App\Models\PollOption;
use App\Models\PollVote;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class PublicPollController extends Controller
{
    /**
     * Get the latest public poll with options and votes.
     */
    public function getLatestPoll()
    {
        $latestPoll = Poll::where('is_public', true)
            ->with(['user:id,name', 'options' => function ($query) {
                $query->withCount('votes')->orderBy('sort_order');
            }])
            ->withCount('allVotes')
            ->latest()
            ->first();

        $userVotes = null;
        if ($latestPoll) {
            if (Auth::check()) {
                $userVotes = PollOption::whereIn('id', $latestPoll->options->pluck('id'))
                    ->whereHas('votes', function ($query) {
                        $query->where('user_id', Auth::id());
                    })
                    ->pluck('id');
            } else {
                // For non-authenticated users, check if they voted via session ID
                $voterSessionId = session()->get('voter_id');
                if ($voterSessionId) {
                    $userVotes = PollOption::whereIn('id', $latestPoll->options->pluck('id'))
                        ->whereHas('votes', function ($query) use ($voterSessionId) {
                            $query->where('voter_id', $voterSessionId);
                        })
                        ->pluck('id');
                }
            }
        }

        return response()->json([
            'poll' => $latestPoll,
            'userVotes' => $userVotes
        ]);
    }

    /**
     * Display a listing of the public polls.
     */
    public function index()
    {
        $polls = Poll::where('is_public', true)
            ->with(['user:id,name', 'options' => function ($query) {
                $query->withCount('votes');
            }])
            ->withCount('allVotes')
            ->latest()
            ->paginate(12);

        return inertia('Polls/Public/Index', [
            'polls' => [
                'data' => $polls->items(),
                'links' => $polls->linkCollection()->toArray(),
                'meta' => [
                    'current_page' => $polls->currentPage(),
                    'last_page' => $polls->lastPage(),
                    'per_page' => $polls->perPage(),
                    'total' => $polls->total(),
                ],
            ]
        ]);
    }

    /**
     * Submit a vote for a poll option.
     */
    public function vote(Request $request, Poll $poll)
    {
        if (!$poll->is_public) {
            abort(403, 'This poll is not public.');
        }

        if ($poll->hasEnded()) {
            throw ValidationException::withMessages([
                'option_id' => ['This poll has ended and is no longer accepting votes.']
            ]);
        }

        $validated = $request->validate([
            'option_id' => 'required_without:option_ids|exists:poll_options,id',
            'option_ids' => 'required_without:option_id|array|exists:poll_options,id',
        ]);

        // Ensure voting for options that belong to this poll
        if (isset($validated['option_id'])) {
            $option = PollOption::find($validated['option_id']);
            if ($option->poll_id !== $poll->id) {
                abort(400, 'Invalid option for this poll.');
            }
            $optionIds = [$option->id];
        } else {
            $options = PollOption::whereIn('id', $validated['option_ids'])
                ->where('poll_id', $poll->id)
                ->get();
            
            if (count($options) !== count($validated['option_ids'])) {
                abort(400, 'One or more invalid options for this poll.');
            }
            
            if (!$poll->multiple_choice && count($options) > 1) {
                abort(400, 'This poll does not allow multiple choices.');
            }
            
            $optionIds = $options->pluck('id')->toArray();
        }

        // Get or create a voter ID for non-authenticated users
        $voterId = Auth::check() ? null : session()->get('voter_id', Str::uuid());
        if (!Auth::check()) {
            session()->put('voter_id', $voterId);
        }
        
        $userId = Auth::id();
        $ipAddress = $request->ip();

        // Check if user already voted in this poll
        $hasVoted = false;
        if ($userId) {
            $hasVoted = PollVote::whereHas('option', function($query) use ($poll) {
                $query->where('poll_id', $poll->id);
            })->where('user_id', $userId)->exists();
        } elseif ($voterId) {
            $hasVoted = PollVote::whereHas('option', function($query) use ($poll) {
                $query->where('poll_id', $poll->id);
            })->where('voter_id', $voterId)->exists();
        }

        if ($hasVoted && !$poll->multiple_choice) {
            throw ValidationException::withMessages([
                'option_id' => ['You have already voted in this poll.']
            ]);
        }

        DB::transaction(function () use ($optionIds, $userId, $voterId, $ipAddress) {
            foreach ($optionIds as $optionId) {
                // Skip if this exact vote already exists
                $exists = PollVote::where('poll_option_id', $optionId)
                    ->where(function($query) use ($userId, $voterId) {
                        if ($userId) {
                            $query->where('user_id', $userId);
                        } elseif ($voterId) {
                            $query->where('voter_id', $voterId);
                        }
                    })->exists();
                
                if (!$exists) {
                    PollVote::create([
                        'poll_option_id' => $optionId,
                        'user_id' => $userId,
                        'voter_id' => $voterId,
                        'ip_address' => $ipAddress,
                    ]);
                }
            }
        });

        // Return updated poll data with vote counts
        $poll->refresh();
        $poll->load([
            'options' => function ($query) {
                $query->withCount('votes');
            }
        ]);
        $poll->loadCount('allVotes');

        return response()->json([
            'message' => 'Your vote has been recorded.',
            'poll' => $poll
        ]);
    }

    /**
     * Get poll results without voting.
     */
    public function results(Poll $poll)
    {
        if (!$poll->is_public) {
            abort(403, 'This poll is not public.');
        }

        $poll->load([
            'options' => function ($query) {
                $query->withCount('votes');
            }
        ]);
        $poll->loadCount('allVotes');

        $userVotes = null;
        if (Auth::check()) {
            $userVotes = PollOption::whereIn('id', $poll->options->pluck('id'))
                ->whereHas('votes', function ($query) {
                    $query->where('user_id', Auth::id());
                })
                ->pluck('id');
        } else {
            // For non-authenticated users, check if they voted via session ID
            $voterSessionId = session()->get('voter_id');
            if ($voterSessionId) {
                $userVotes = PollOption::whereIn('id', $poll->options->pluck('id'))
                    ->whereHas('votes', function ($query) use ($voterSessionId) {
                        $query->where('voter_id', $voterSessionId);
                    })
                    ->pluck('id');
            }
        }

        return response()->json([
            'poll' => $poll,
            'userVotes' => $userVotes
        ]);
    }
}