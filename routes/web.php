<?php

use App\Actions\BuildDashboardProps;
use App\Actions\RedirectStaleWorkspaceSlug;
use App\Http\Controllers\AssetController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\FolderController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\WorldController;
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
        $scratchpadWorld = $request->query('scratchpad');

        return Inertia::render('dashboard', app(BuildDashboardProps::class)(
            $request->user(),
            is_string($scratchpadWorld) ? $scratchpadWorld : null,
        ));
    })->name('dashboard');

    $redirectStaleWorkspaceSlug = fn (Request $request) => app(RedirectStaleWorkspaceSlug::class)($request) ?? abort(404);

    Route::resource('worlds', WorldController::class)
        ->missing($redirectStaleWorkspaceSlug);

    Route::resource('worlds.folders', FolderController::class)
        ->only(['store', 'update', 'destroy'])
        ->scoped(['folder' => 'slug'])
        ->missing($redirectStaleWorkspaceSlug);

    Route::resource('worlds.files', FileController::class)
        ->only(['store', 'show', 'update', 'destroy'])
        ->scoped(['file' => 'slug'])
        ->missing($redirectStaleWorkspaceSlug);

    Route::patch('worlds/{world}/files/{file}/template', [FileController::class, 'updateTemplate'])
        ->scopeBindings()
        ->name('worlds.files.template.update');

    Route::post('worlds/{world}/images', [ImageController::class, 'store'])
        ->name('worlds.images.store');
    Route::get('images/{image}', [ImageController::class, 'show'])
        ->name('images.show');
});

// Route to serve private assets (like .riv files)
Route::get('/assets/{filename}', [AssetController::class, 'serve'])
    ->where('filename', '[a-zA-Z0-9._-]+')
    ->name('assets.serve');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
