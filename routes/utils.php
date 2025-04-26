<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::prefix('utils')->group(function () {
    Route::get('/', function () {
        return Inertia::render('utils/Index');
    });
    Route::get('/color-palette', function () {
        return Inertia::render('utils/ColorPalette');
    });
});
