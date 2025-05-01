<?php

namespace App\Http\Controllers;

use App\Models\AvailabilitySetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AvailabilityController extends Controller
{
    public function show()
    {
        $settings = AvailabilitySetting::getSettings();

        return Inertia::render('Availability/Show', [
            'settings' => $settings,
            'currentTime' => now()->toIso8601String(),
        ]);
    }

    public function edit()
    {
        $settings = AvailabilitySetting::getSettings();

        return Inertia::render('Admin/Availability/Edit', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'available_from' => 'nullable|date',
            'available_until' => 'nullable|date',
            'is_available_now' => 'boolean',
            'busy_message' => 'required|string|max:255',
            'available_message' => 'required|string|max:255',
            'project_backlog' => 'nullable|array',
        ]);

        $settings = AvailabilitySetting::getSettings();
        $settings->update($validated);

        return redirect()->back()->with('success', 'Availability settings updated successfully!');
    }
}
