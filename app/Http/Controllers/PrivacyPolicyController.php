<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class PrivacyPolicyController extends Controller
{
    public function show($appName)
    {
        // TODO: Implement logic to fetch the correct policy based on app name
        return Inertia::render('PrivacyPolicies/Show', [
            'appName' => $appName
        ]);
    }
}
