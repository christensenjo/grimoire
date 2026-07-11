<?php

namespace App\Models;

use App\Models\Concerns\HasWorkspaceSlug;
use Database\Factories\FolderFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Folder extends Model
{
    /** @use HasFactory<FolderFactory> */
    use HasFactory, HasWorkspaceSlug;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'slug',
        'parent_id',
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
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Folder::class, 'parent_id');
    }

    /**
     * @return HasMany<Folder, $this>
     */
    public function children(): HasMany
    {
        return $this->hasMany(Folder::class, 'parent_id');
    }

    /**
     * @return HasMany<File, $this>
     */
    public function files(): HasMany
    {
        return $this->hasMany(File::class);
    }

    public function isAncestorOf(Folder $folder): bool
    {
        $current = $folder->parent;

        while ($current !== null) {
            if ($current->is($this)) {
                return true;
            }

            $current = $current->parent;
        }

        return false;
    }

    public function wouldCreateCycle(?int $newParentId): bool
    {
        if ($newParentId === null) {
            return false;
        }

        if ($newParentId === $this->id) {
            return true;
        }

        $newParent = static::query()->find($newParentId);

        if ($newParent === null) {
            return false;
        }

        return $this->isAncestorOf($newParent) || $this->is($newParent);
    }

    /**
     * @return array{id: int, slug: string, name: string, parentId: int|null}
     */
    public function toInertiaArray(): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'name' => $this->name,
            'parentId' => $this->parent_id,
        ];
    }

    /**
     * @return Builder<Folder>
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
