<?php

namespace App\Http\Controllers;

use App\Models\Poll;
use App\Models\PollOption;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class PollController extends Controller
{
    /**
     * Display a listing of the user's polls.
     */
    public function index()
    {
        $polls = Auth::user()->polls()->with([
            'options' => function ($query) {
                $query->withCount('votes');
            }
        ])->withCount('allVotes')->latest()->paginate(10);

        return Inertia::render('Polls/Index', [
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
     * Show the form for creating a new poll.
     */
    public function create()
    {
        return Inertia::render('Polls/Create');
    }

    /**
     * Store a newly created poll in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_public' => 'boolean',
            'multiple_choice' => 'boolean',
            'ends_at' => 'nullable|date|after:now',
            'options' => 'required|array|min:2',
            'options.*.text' => 'required|string|max:255',
        ]);

        $poll = DB::transaction(function () use ($validated, $request) {
            $poll = Auth::user()->polls()->create([
                'title' => $validated['title'],
                'description' => $validated['description'] ?? null,
                'is_public' => $validated['is_public'] ?? true,
                'multiple_choice' => $validated['multiple_choice'] ?? false,
                'ends_at' => $validated['ends_at'] ?? null,
            ]);

            foreach ($validated['options'] as $index => $option) {
                $poll->options()->create([
                    'text' => $option['text'],
                    'sort_order' => $index,
                ]);
            }

            return $poll;
        });

        return redirect()->route('polls.show', $poll)->with('success', 'Poll created successfully!');
    }

    /**
     * Display the specified poll.
     */
    public function show(Poll $poll)
    {
        if (!$poll->is_public && $poll->user_id !== Auth::id()) {
            abort(403, 'You do not have permission to view this poll.');
        }

        $poll->load([
            'options' => function ($query) {
                $query->withCount('votes');
            }, 
            'user'
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

        return Inertia::render('Polls/Show', [
            'poll' => $poll,
            'userVotes' => $userVotes,
        ]);
    }

    /**
     * Show the form for editing the specified poll.
     */
    public function edit(Poll $poll)
    {
        if ($poll->user_id !== Auth::id()) {
            abort(403, 'You do not have permission to edit this poll.');
        }
        
        $poll->load('options');
        
        return Inertia::render('Polls/Edit', [
            'poll' => $poll
        ]);
    }

    /**
     * Update the specified poll in storage.
     */
    public function update(Request $request, Poll $poll)
    {
        if ($poll->user_id !== Auth::id()) {
            abort(403, 'You do not have permission to edit this poll.');
        }
        
        if ($poll->allVotes()->count() > 0) {
            throw ValidationException::withMessages([
                'options' => ['Cannot edit options for a poll that has votes already.']
            ]);
        }
        
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_public' => 'boolean',
            'multiple_choice' => 'boolean',
            'ends_at' => 'nullable|date|after:now',
            'options' => 'required|array|min:2',
            'options.*.id' => 'nullable|exists:poll_options,id',
            'options.*.text' => 'required|string|max:255',
        ]);

        DB::transaction(function () use ($validated, $poll) {
            $poll->update([
                'title' => $validated['title'],
                'description' => $validated['description'] ?? null,
                'is_public' => $validated['is_public'] ?? true,
                'multiple_choice' => $validated['multiple_choice'] ?? false,
                'ends_at' => $validated['ends_at'] ?? null,
            ]);
            
            // Get existing option IDs
            $existingOptionIds = $poll->options->pluck('id')->toArray();
            $updatedOptionIds = collect($validated['options'])->pluck('id')->filter()->toArray();
            
            // Delete options that are no longer present
            $optionsToDelete = array_diff($existingOptionIds, $updatedOptionIds);
            if (!empty($optionsToDelete)) {
                PollOption::whereIn('id', $optionsToDelete)->delete();
            }
            
            // Update or create options
            foreach ($validated['options'] as $index => $optionData) {
                if (isset($optionData['id'])) {
                    $option = PollOption::find($optionData['id']);
                    $option->update([
                        'text' => $optionData['text'],
                        'sort_order' => $index,
                    ]);
                } else {
                    $poll->options()->create([
                        'text' => $optionData['text'],
                        'sort_order' => $index,
                    ]);
                }
            }
        });

        return redirect()->route('polls.show', $poll)->with('success', 'Poll updated successfully!');
    }

    /**
     * Remove the specified poll from storage.
     */
    public function destroy(Poll $poll)
    {
        if ($poll->user_id !== Auth::id()) {
            abort(403, 'You do not have permission to delete this poll.');
        }

        $poll->delete();
        
        return redirect()->route('polls.index')->with('success', 'Poll deleted successfully!');
    }
}