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
use Illuminate\Database\Eloquent\Relations\HasOne;

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
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'last_accessed_at' => 'datetime',
        ];
    }

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

    /**
     * @return HasMany<Image, $this>
     */
    public function images(): HasMany
    {
        return $this->hasMany(Image::class);
    }

    /**
     * @return HasOne<File, $this>
     */
    public function scratchpadFile(): HasOne
    {
        return $this->hasOne(File::class)->where('is_scratchpad', true);
    }

    public function markAccessed(): void
    {
        static::withoutTimestamps(function (): void {
            $this->forceFill(['last_accessed_at' => now()])->saveQuietly();
        });
    }

    /**
     * Whether this world is already the one the dashboard Scratchpad would show
     * (most recently accessed world that has a Scratchpad).
     */
    public function isMostRecentScratchpadWorld(): bool
    {
        $mostRecentId = static::query()
            ->where('user_id', $this->user_id)
            ->whereHas('scratchpadFile')
            ->orderByRecentAccess()
            ->value('id');

        return $mostRecentId === $this->id;
    }

    /**
     * @param  Builder<World>  $query
     * @return Builder<World>
     */
    public function scopeOrderByRecentAccess(Builder $query): Builder
    {
        return $query
            ->orderByRaw('last_accessed_at is null')
            ->orderByDesc('last_accessed_at')
            ->orderByDesc('updated_at')
            ->orderByDesc('id');
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
     * @return array{folders: list<array{id: int, slug: string, name: string, parentId: int|null, isImagesFolder: bool}>, files: list<array{id: int, slug: string, name: string, folderId: int|null, isScratchpad: bool, template: array{id: int, slug: string, name: string}|null}>}
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
                ->with('template')
                ->orderBy('name')
                ->get()
                ->map(fn (File $file): array => $file->toTreeArray())
                ->values()
                ->all(),
        ];
    }

    /**
     * @return array{id: int, slug: string, name: string, description: string|null, updatedAt: string|null, updatedForHumans: string|null, scratchpadSlug: string|null}
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
            'scratchpadSlug' => $this->relationLoaded('scratchpadFile')
                ? $this->scratchpadFile?->slug
                : null,
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
