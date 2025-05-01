<?php

use App\Http\Controllers\CaptchaController;
use App\Http\Controllers\LinkController;
use App\Http\Controllers\OGImageController;
use App\Http\Controllers\PollController;
use App\Http\Controllers\PublicPollController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('home');
})->name('home');

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

Route::middleware(['auth', 'verified'])->prefix('dashboard')->name('admin.')->group(function () {
    Route::resource('polls', PollController::class);
    Route::post('polls/reorder', [PollController::class, 'reorder'])->name('admin.polls.reorder');
});

// Public routes
Route::prefix('polls')->name('polls.')->group(function () {
    Route::get('/', [PublicPollController::class, 'index'])->name('index');
    Route::get('/{id}', [PublicPollController::class, 'show'])->name('show');
    Route::post('/{id}/vote', [PublicPollController::class, 'vote'])->name('vote');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/utils.php';
