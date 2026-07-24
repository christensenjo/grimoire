<?php

namespace App\Actions;

use App\Models\Image;
use App\Models\World;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Throwable;

class StoreImage
{
    public function __invoke(World $world, UploadedFile $upload): Image
    {
        $disk = (string) config('filesystems.default');
        $path = Storage::disk($disk)->putFile("worlds/{$world->id}/images", $upload);

        abort_if($path === false, 500, 'The image could not be stored.');

        try {
            $image = new Image([
                'disk' => $disk,
                'path' => $path,
                'original_name' => $upload->getClientOriginalName(),
                'mime_type' => $upload->getMimeType() ?: $upload->getClientMimeType(),
                'size' => (int) $upload->getSize(),
            ]);
            $image->world()->associate($world);
            $image->folder()->associate(
                $world->folders()->where('is_images_folder', true)->sole(),
            );
            $image->save();
        } catch (Throwable $exception) {
            Storage::disk($disk)->delete($path);

            throw $exception;
        }

        return $image;
    }
}
