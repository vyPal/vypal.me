<?php

use App\Http\Controllers\CaptchaController;
use App\Http\Controllers\LinkController;
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

Route::prefix('captcha')->group(function () {
    Route::post('/generate', [CaptchaController::class, 'generate'])->name('captcha.generate');
    Route::post('/verify', [CaptchaController::class, 'verify'])->name('captcha.verify');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/utils.php';
