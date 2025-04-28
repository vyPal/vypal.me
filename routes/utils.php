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
    Route::get('/flexbox-playground', function () {
        return Inertia::render('utils/FlexboxPlayground');
    });
    Route::get('/svg-animator', function () {
        return Inertia::render('utils/SvgAnimator');
    });

    Route::prefix('algo')->group(function () {
        Route::get('/', function () {
            return Inertia::render('utils/algo/Index');
        });
        Route::get('/sorting', function () {
            return Inertia::render('utils/algo/Sorting');
        });
        Route::get('/pathfinding', function () {
            return Inertia::render('utils/algo/Pathfinding');
        });
    });
});
