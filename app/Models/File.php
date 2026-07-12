<?php

namespace App\Models;

use App\Models\Concerns\HasWorkspaceSlug;
use Database\Factories\FileFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

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
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_scratchpad' => 'boolean',
        ];
    }

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
     * @return BelongsTo<Template, $this>
     */
    public function template(): BelongsTo
    {
        return $this->belongsTo(Template::class);
    }

    /**
     * @return BelongsToMany<File, $this>
     */
    public function outgoingWikiLinks(): BelongsToMany
    {
        return $this->belongsToMany(
            File::class,
            'file_links',
            'source_file_id',
            'target_file_id',
        )->withTimestamps();
    }

    /**
     * @return BelongsToMany<File, $this>
     */
    public function incomingWikiLinks(): BelongsToMany
    {
        return $this->belongsToMany(
            File::class,
            'file_links',
            'target_file_id',
            'source_file_id',
        )->withTimestamps();
    }

    /**
     * @return array{id: int, slug: string, name: string, folderId: int|null, content: string, format: string, updatedAt: string|null, isScratchpad: bool, template: array{id: int, slug: string, name: string}|null}
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
            'isScratchpad' => $this->is_scratchpad,
            'template' => $this->template?->toInertiaArray(),
        ];
    }

    /**
     * @return array{id: int, slug: string, name: string, folderId: int|null, isScratchpad: bool, template: array{id: int, slug: string, name: string}|null}
     */
    public function toTreeArray(): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'name' => $this->name,
            'folderId' => $this->folder_id,
            'isScratchpad' => $this->is_scratchpad,
            'template' => $this->template?->toInertiaArray(),
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
