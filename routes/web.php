<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AssetController;

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
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

// Route to serve private assets (like .riv files)
Route::get('/assets/{filename}', [AssetController::class, 'serve'])
    ->where('filename', '[a-zA-Z0-9._-]+')
    ->name('assets.serve');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
