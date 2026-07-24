<?php

namespace App\Http\Resources;

use App\Models\Image;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Image
 */
class ImageResource extends JsonResource
{
    public static $wrap = 'image';

    /**
     * @return array{id: int, url: string, alt: string}
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'url' => route('images.show', $this->resource),
            'alt' => pathinfo($this->original_name, PATHINFO_FILENAME),
        ];
    }
}
