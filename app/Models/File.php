<?php

namespace App\Models;

use Database\Factories\FileFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class File extends Model
{
    /** @use HasFactory<FileFactory> */
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'folder_id',
        'content',
        'format',
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

    /**
     * @return array{id: int, name: string, folderId: int|null, content: string, format: string, updatedAt: string|null}
     */
    public function toInertiaArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'folderId' => $this->folder_id,
            'content' => $this->content ?? '',
            'format' => $this->format,
            'updatedAt' => $this->updated_at?->toISOString(),
        ];
    }

    /**
     * @return array{id: int, name: string, folderId: int|null}
     */
    public function toTreeArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'folderId' => $this->folder_id,
        ];
    }
}
