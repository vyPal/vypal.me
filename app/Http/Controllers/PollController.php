<?php

namespace App\Http\Controllers;

use App\Models\Poll;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PollController extends Controller {
    public function index() {
        $polls = Poll::orderBy('order')->get();
        return Inertia::render('Polls/Index', ['polls' => $polls]);
    }

    public function create() {
        return Inertia::render('Polls/Create');
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|string|in:yes_no,multiple_choice,ranking,custom_input',
            'allow_multiple' => 'boolean',
            'allow_custom' => 'boolean',
            'show_results_without_voting' => 'boolean',
            'is_active' => 'boolean',
            'options' => 'required|array|min:2',
            'options.*.title' => 'required|string|max:255',
            'options.*.color' => 'nullable|string|max:50',
            'options.*.icon' => 'nullable|string|max:50',
            'options.*.description' => 'nullable|string',
        ]);

        $poll = Poll::create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'type' => $validated['type'],
            'allow_multiple' => $validated['allow_multiple'] ?? false,
            'allow_custom' => $validated['allow_custom'] ?? false,
            'show_results_without_voting' => $validated['show_results_without_voting'] ?? false,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        // Create options
        foreach ($validated['options'] as $index => $option) {
            $poll->options()->create([
                'title' => $option['title'],
                'color' => $option['color'] ?? null,
                'icon' => $option['icon'] ?? null,
                'description' => $option['description'] ?? null,
                'order' => $index,
            ]);
        }

        return redirect()->route('admin.polls.index')->with('success', 'Poll created successfully!');
    }

    public function reorder(Request $request) {
        $validated = $request->validate([
            'polls' => 'required|array',
            'polls.*.id' => 'required|exists:polls,id',
            'polls.*.order' => 'required|integer|min:0',
        ]);

        foreach ($validated['polls'] as $pollData) {
            Poll::find($pollData['id'])->update(['order' => $pollData['order']]);
        }

        return response()->json(['success' => true]);
    }
}
