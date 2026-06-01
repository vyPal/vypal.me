<?php

use App\Http\Controllers\CaptchaController;
use App\Http\Controllers\LinkController;
use App\Http\Controllers\OGImageController;
use App\Http\Controllers\PollController;
use App\Http\Controllers\PrivacyPolicyController;
use App\Http\Controllers\PublicPollController;
use App\Http\Controllers\TermsController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('home');
})->name('home');

Route::get('/apps', function () {
    return Inertia::render('Apps/Index');
})->name('apps.index');

Route::get('/apps/kairo', function () {
    return Inertia::render('Apps/Kairo');
})->name('apps.kairo');

Route::get('/{alias}', [LinkController::class, 'index'])->where('alias', 'links|link|l')->name('links.index');

Route::middleware([
    'auth',
])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::get('/dashboard/links', [LinkController::class, 'dashboard'])->name('links.dashboard');
    Route::post('/links', [LinkController::class, 'store'])->name('links.store');
    Route::put('/links/{link}', [LinkController::class, 'update'])->name('links.update');
    Route::delete('/links/{link}', [LinkController::class, 'destroy'])->name('links.destroy');
    Route::post('/links/reorder', [LinkController::class, 'reorder'])->name('links.reorder');

    // Poll routes for authenticated users
    Route::get('/dashboard/polls', [PollController::class, 'index'])->name('polls.index');
    Route::get('/dashboard/polls/create', [PollController::class, 'create'])->name('polls.create');
    Route::post('/polls', [PollController::class, 'store'])->name('polls.store');
    Route::get('/dashboard/polls/{poll}/edit', [PollController::class, 'edit'])->name('polls.edit');
    Route::put('/polls/{poll}', [PollController::class, 'update'])->name('polls.update');
    Route::delete('/polls/{poll}', [PollController::class, 'destroy'])->name('polls.destroy');
});

Route::get('/api/og-image', [OGImageController::class, 'generate'])
    ->name('og.generate');

Route::get('/availability', [App\Http\Controllers\AvailabilityController::class, 'show'])
    ->name('availability');

Route::middleware(['auth'])->prefix('dashboard')->group(function () {
    Route::get('/availability', [App\Http\Controllers\AvailabilityController::class, 'edit'])
        ->name('dashboard.availability.edit');
    Route::post('/availability', [App\Http\Controllers\AvailabilityController::class, 'update'])
        ->name('dashboard.availability.update');
});

Route::prefix('captcha')->group(function () {
    Route::post('/generate', [CaptchaController::class, 'generate'])->name('captcha.generate');
    Route::post('/verify', [CaptchaController::class, 'verify'])->name('captcha.verify');
});

Route::get('/privacy-policy/{appName}', [PrivacyPolicyController::class, 'show'])->name('privacy-policy.show');
Route::get('/terms/{appName}', [TermsController::class, 'show'])->name('terms.show');

// Admin routes for managing legal templates (stored in DB)
// These endpoints are mounted under the dashboard prefix and require auth.
Route::middleware(['auth'])->prefix('dashboard')->group(function () {
    // Admin UI route for the generator page
    Route::get('/legal-generator', function () { return Inertia::render('Admin/LegalGenerator/Index'); })->name('dashboard.legal-generator');

    // List and create templates
    Route::get('/legal-templates', [App\Http\Controllers\Admin\LegalTemplateController::class, 'index'])->name('admin.legal.index');
    Route::post('/legal-templates', [App\Http\Controllers\Admin\LegalTemplateController::class, 'store'])->name('admin.legal.store');

    // Read / update / delete a single template
    Route::get('/legal-templates/{legalTemplate}', [App\Http\Controllers\Admin\LegalTemplateController::class, 'show'])->name('admin.legal.show');
    Route::put('/legal-templates/{legalTemplate}', [App\Http\Controllers\Admin\LegalTemplateController::class, 'update'])->name('admin.legal.update');
    Route::delete('/legal-templates/{legalTemplate}', [App\Http\Controllers\Admin\LegalTemplateController::class, 'destroy'])->name('admin.legal.destroy');

    // Preview generation endpoint (AJAX) - returns generated markdown for preview
    Route::post('/legal-templates/preview', [App\Http\Controllers\Admin\LegalTemplateController::class, 'preview'])->name('admin.legal.preview');
});

// Public poll routes
Route::get('/polls', [PublicPollController::class, 'index'])->name('public-polls.index');
Route::get('/polls/{poll}', [PollController::class, 'show'])->name('polls.show');
Route::post('/polls/{poll}/vote', [PublicPollController::class, 'vote'])->name('polls.vote');
Route::get('/polls/{poll}/results', [PublicPollController::class, 'results'])->name('polls.results');
Route::get('/api/latest-poll', [PublicPollController::class, 'getLatestPoll'])->name('api.latest-poll');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/utils.php';
