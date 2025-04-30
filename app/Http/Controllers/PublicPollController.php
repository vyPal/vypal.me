<?php

namespace App\Http\Controllers;

use App\Models\Poll;
use App\Models\PollVote;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Inertia\Inertia;
use Pest\Support\Str;

class PublicPollController extends Controller {
    public function index() {
        $polls = Poll::where('is_active', true)
            ->orderBy('order')
            ->with('options')
            ->get();

        return Inertia::render('Polls/Public/Index', ['polls' => $polls]);
    }

    // Show specific poll
    public function show($id) {
        $poll = Poll::where('is_active', true)
            ->with('options')
            ->findOrFail($id);

        // Check if user has voted using cookie
        $voterToken = $this->getVoterToken();
        $hasVoted = PollVote::where('poll_id', $poll->id)
            ->where('voter_token', $voterToken)
            ->exists();

        // Get results if should show or has voted
        $results = null;
        if ($poll->show_results_without_voting || $hasVoted) {
            $results = $this->getPollResults($poll);
        }

        return Inertia::render('Polls/Public/Show', [
            'poll' => $poll,
            'hasVoted' => $hasVoted,
            'results' => $results,
        ]);
    }

    // Vote on a poll
    public function vote(Request $request, $id) {
        $poll = Poll::where('is_active', true)->findOrFail($id);

        $validated = $request->validate([
            'option_ids' => $poll->allow_multiple ? 'array|required' : 'integer|required_without:custom_answer',
            'option_ids.*' => 'exists:poll_options,id',
            'custom_answer' => $poll->allow_custom ? 'nullable|string|max:255' : 'prohibited',
        ]);

        // Check if already voted
        $voterToken = $this->getVoterToken();
        $hasVoted = PollVote::where('poll_id', $poll->id)
            ->where('voter_token', $voterToken)
            ->exists();

        if ($hasVoted) {
            return redirect()->back()->with('error', 'You have already voted on this poll.');
        }

        // Process vote(s)
        if ($poll->allow_multiple && is_array($validated['option_ids'])) {
            foreach ($validated['option_ids'] as $optionId) {
                PollVote::create([
                    'poll_id' => $poll->id,
                    'poll_option_id' => $optionId,
                    'voter_token' => $voterToken,
                ]);
            }
        } else if (!$poll->allow_multiple && isset($validated['option_ids'])) {
            PollVote::create([
                'poll_id' => $poll->id,
                'poll_option_id' => $validated['option_ids'],
                'voter_token' => $voterToken,
            ]);
        }

        // Handle custom answer if provided
        if ($poll->allow_custom && isset($validated['custom_answer'])) {
            PollVote::create([
                'poll_id' => $poll->id,
                'custom_answer' => $validated['custom_answer'],
                'voter_token' => $voterToken,
            ]);
        }

        // Get and return results
        $results = $this->getPollResults($poll);

        return redirect()->back()->with([
            'success' => 'Your vote has been recorded!',
            'results' => $results
        ]);
    }

    // Get voter token from cookie or create new one
    private function getVoterToken() {
        $token = request()->cookie('voter_token');

        if (!$token) {
            $token = Str::random(40);
            Cookie::queue('voter_token', $token, 60 * 24 * 365); // 1 year
        }

        return $token;
    }

    // Get poll results with counts and percentages
    private function getPollResults($poll) {
        $options = $poll->options;
        $totalVotes = $poll->votes()->count();

        $results = [];

        foreach ($options as $option) {
            $voteCount = $option->votes()->count();
            $percentage = $totalVotes > 0 ? round(($voteCount / $totalVotes) * 100, 1) : 0;

            $results[] = [
                'option' => $option,
                'votes' => $voteCount,
                'percentage' => $percentage,
            ];
        }

        // Custom answers if enabled
        if ($poll->allow_custom) {
            $customVotes = $poll->votes()->whereNotNull('custom_answer')->get();
            $customAnswers = [];

            foreach ($customVotes as $vote) {
                if (!isset($customAnswers[$vote->custom_answer])) {
                    $customAnswers[$vote->custom_answer] = 0;
                }
                $customAnswers[$vote->custom_answer]++;
            }

            $results['custom'] = $customAnswers;
        }

        return [
            'total' => $totalVotes,
            'options' => $results,
        ];
    }
}
