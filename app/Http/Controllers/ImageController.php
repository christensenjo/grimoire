<?php

namespace App\Http\Controllers;

use App\Actions\StoreImage;
use App\Http\Requests\StoreImageRequest;
use App\Models\Image;
use App\Models\World;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ImageController extends Controller
{
    public function store(StoreImageRequest $request, World $world, StoreImage $storeImage): JsonResponse
    {
        Gate::authorize('create', [Image::class, $world]);

        /** @var UploadedFile $upload */
        $upload = $request->file('image');
        $image = $storeImage($world, $upload);

        return response()->json([
            'image' => [
                'id' => $image->id,
                'url' => route('images.show', $image),
                'alt' => pathinfo($image->original_name, PATHINFO_FILENAME),
            ],
        ], 201);
    }

    public function show(Image $image): StreamedResponse
    {
        Gate::authorize('view', $image);

        abort_unless(Storage::disk($image->disk)->exists($image->path), 404);

        return Storage::disk($image->disk)->response(
            $image->path,
            $image->original_name,
            ['Content-Type' => $image->mime_type],
        );
    }
}
