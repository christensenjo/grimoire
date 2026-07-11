<?php

namespace App\Models;

use App\Models\Concerns\HasWorkspaceSlug;
use Database\Factories\FileFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class File extends Model
{
    /** @use HasFactory<FileFactory> */
    use HasFactory, HasWorkspaceSlug;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'slug',
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
     * @return array{id: int, slug: string, name: string, folderId: int|null, content: string, format: string, updatedAt: string|null}
     */
    public function toInertiaArray(): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'name' => $this->name,
            'folderId' => $this->folder_id,
            'content' => $this->content ?? '',
            'format' => $this->format,
            'updatedAt' => $this->updated_at?->toISOString(),
        ];
    }

    /**
     * @return array{id: int, slug: string, name: string, folderId: int|null}
     */
    public function toTreeArray(): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'name' => $this->name,
            'folderId' => $this->folder_id,
        ];
    }

    /**
     * @return Builder<File>
     */
    protected function slugScopeQuery(): Builder
    {
        return static::query()->where('world_id', $this->world_id);
    }

    /**
     * @return array{world_id: int|null}
     */
    protected function slugRedirectScope(): array
    {
        return ['world_id' => $this->world_id];
    }
}
