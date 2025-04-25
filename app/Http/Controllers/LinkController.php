<?php

namespace App\Http\Controllers;

use App\Models\Link;
use App\Models\Sublink;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;

class LinkController extends Controller
{
    // Other methods remain the same...

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'type' => 'required|string|in:website,blog,social,code,other,separator',
            'url' => 'nullable|url|max:255',
            'description' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator);
        }

        // Find the highest order number - fixed static method call
        $maxOrder = Link::query()->max('order') ?? 0;

        // Create the new link
        $link = Link::create([
            'title' => $request->title,
            'type' => $request->type,
            'url' => $request->url,
            'description' => $request->description,
            'order' => $maxOrder + 1,
        ]);

        // Handle sublinks if present
        if ($request->has('sublinks')) {
            foreach ($request->sublinks as $index => $sublinkData) {
                Sublink::create([
                    'link_id' => $link->id,
                    'title' => $sublinkData['title'],
                    'url' => $sublinkData['url'],
                    'order' => $index,
                ]);
            }
        }

        return redirect()->route('links.dashboard');
    }

    // Update the reorder method too
    public function reorder(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'links' => 'required|array',
            'links.*.id' => 'required|exists:links,id',
            'links.*.order' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator);
        }

        foreach ($request->links as $linkData) {
            // Fixed static method call using query()
            Link::query()->where('id', $linkData['id'])->update(['order' => $linkData['order']]);
        }

        return redirect()->route('links.dashboard');
    }

    public function update(Request $request, Link $link)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'type' => 'required|string|in:website,blog,social,code,other,separator',
            'url' => 'nullable|url|max:255',
            'description' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator);
        }

        $link->update([
            'title' => $request->title,
            'type' => $request->type,
            'url' => $request->url,
            'description' => $request->description,
        ]);

        // Handle sublinks - delete old ones and create new ones
        $link->sublinks()->delete();

        if ($request->has('sublinks')) {
            foreach ($request->sublinks as $index => $sublinkData) {
                Sublink::create([
                    'link_id' => $link->id,
                    'title' => $sublinkData['title'],
                    'url' => $sublinkData['url'],
                    'order' => $index,
                ]);
            }
        }

        return redirect()->route('links.dashboard');
    }

    public function destroy(Link $link)
    {
        // Delete the link (cascade will delete sublinks)
        $link->delete();

        // Reorder remaining links
        $links = Link::query()->orderBy('order')->get();
        foreach ($links as $index => $link) {
            $link->update(['order' => $index + 1]);
        }

        return redirect()->route('links.dashboard');
    }

    // Make sure other static methods are fixed
    public function dashboard()
    {
        // Load all links for the dashboard
        $links = Link::query()->with('sublinks')->orderBy('order')->get();

        return Inertia::render('LinkManager/Index', [
            'links' => $links
        ]);
    }

    public function index()
    {
        $links = Link::query()->with('sublinks')
            ->orderBy('order')
            ->get()
            ->map(function ($link) {
                return [
                    'id' => $link->id,
                    'title' => $link->title,
                    'type' => $link->type,
                    'url' => $link->url,
                    'description' => $link->description,
                    'sublinks' => $link->sublinks->map(function ($sublink) {
                        return [
                            'id' => $sublink->id,
                            'title' => $sublink->title,
                            'url' => $sublink->url,
                        ];
                    })->all(),
                ];
            })->all();

        return Inertia::render('links/index', [
            'links' => $links
        ]);
    }
}
