<?php

namespace App\Models;

use Database\Factories\ImageFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class Image extends Model
{
    /** @use HasFactory<ImageFactory> */
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'folder_id',
        'disk',
        'path',
        'original_name',
        'mime_type',
        'size',
    ];

    /**
     * @return BelongsTo<World, $this>
     */
    public function world(): BelongsTo
    {
        return $this->belongsTo(World::class);
    }

    /**
     * @return BelongsTo<Folder, $this>
     */
    public function folder(): BelongsTo
    {
        return $this->belongsTo(Folder::class);
    }

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    protected static function booted(): void
    {
        static::creating(function (Image $image): void {
            $image->uuid ??= (string) Str::uuid();
        });

        static::deleted(function (Image $image): void {
            Storage::disk($image->disk)->delete($image->path);
        });
    }
}
