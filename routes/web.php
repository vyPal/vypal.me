<?php

use App\Http\Controllers\CaptchaController;
use App\Http\Controllers\LinkController;
use App\Http\Controllers\OGImageController;
use App\Http\Controllers\PollController;
use App\Http\Controllers\PrivacyPolicyController;
use App\Http\Controllers\PublicPollController;
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

// Public poll routes
Route::get('/polls', [PublicPollController::class, 'index'])->name('public-polls.index');
Route::get('/polls/{poll}', [PollController::class, 'show'])->name('polls.show');
Route::post('/polls/{poll}/vote', [PublicPollController::class, 'vote'])->name('polls.vote');
Route::get('/polls/{poll}/results', [PublicPollController::class, 'results'])->name('polls.results');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/utils.php';
