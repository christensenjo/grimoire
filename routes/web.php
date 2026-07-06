<?php

use App\Http\Controllers\AssetController;
use App\Http\Controllers\WorldController;
use App\Models\World;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/features', function () {
    return Inertia::render('features');
})->name('features');

Route::get('/library', function () {
    return Inertia::render('library');
})->name('library');

Route::get('/integrations', function () {
    return Inertia::render('integrations');
})->name('integrations');

Route::get('/pricing', function () {
    return Inertia::render('pricing');
})->name('pricing');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('components', function () {
        return Inertia::render('components');
    })->name('components.playground');

    Route::get('dashboard', function (Request $request) {
        $worlds = $request->user()
            ->worlds()
            ->latest('updated_at')
            ->get()
            ->map(fn (World $world): array => $world->toInertiaArray());

        return Inertia::render('dashboard', [
            'worlds' => $worlds,
        ]);
    })->name('dashboard');

    Route::resource('worlds', WorldController::class);
});

// Route to serve private assets (like .riv files)
Route::get('/assets/{filename}', [AssetController::class, 'serve'])
    ->where('filename', '[a-zA-Z0-9._-]+')
    ->name('assets.serve');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
