<?php

namespace App\Models;

use App\Models\Concerns\HasWorkspaceSlug;
use Database\Factories\WorldFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class World extends Model
{
    /** @use HasFactory<WorldFactory> */
    use HasFactory, HasWorkspaceSlug;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'slug',
        'description',
    ];

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return HasMany<Folder, $this>
     */
    public function folders(): HasMany
    {
        return $this->hasMany(Folder::class);
    }

    /**
     * @return HasMany<File, $this>
     */
    public function files(): HasMany
    {
        return $this->hasMany(File::class);
    }

    public function resolveRouteBinding($value, $field = null): self
    {
        $world = static::query()
            ->where($field ?? $this->getRouteKeyName(), $value)
            ->where('user_id', auth()->id())
            ->first();

        if ($world === null) {
            throw (new ModelNotFoundException)->setModel(static::class, [$value]);
        }

        return $world;
    }

    /**
     * @return array{folders: list<array{id: int, slug: string, name: string, parentId: int|null}>, files: list<array{id: int, slug: string, name: string, folderId: int|null}>}
     */
    public function toTreeInertiaArray(): array
    {
        return [
            'folders' => $this->folders()
                ->orderBy('name')
                ->get()
                ->map(fn (Folder $folder): array => $folder->toInertiaArray())
                ->values()
                ->all(),
            'files' => $this->files()
                ->orderBy('name')
                ->get()
                ->map(fn (File $file): array => $file->toTreeArray())
                ->values()
                ->all(),
        ];
    }

    /**
     * @return array{id: int, slug: string, name: string, description: string|null, updatedAt: string|null, updatedForHumans: string|null}
     */
    public function toInertiaArray(): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'name' => $this->name,
            'description' => $this->description,
            'updatedAt' => $this->updated_at?->toISOString(),
            'updatedForHumans' => $this->updated_at?->diffForHumans(),
        ];
    }

    /**
     * @return Builder<World>
     */
    protected function slugScopeQuery(): Builder
    {
        return static::query()->where('user_id', $this->user_id);
    }

    /**
     * @return array{user_id: int|null}
     */
    protected function slugRedirectScope(): array
    {
        return ['user_id' => $this->user_id];
    }
}
