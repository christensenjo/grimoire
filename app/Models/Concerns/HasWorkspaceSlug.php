<?php

namespace App\Models\Concerns;

use App\Models\SlugRedirect;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

trait HasWorkspaceSlug
{
    protected static function bootHasWorkspaceSlug(): void
    {
        static::saving(function (Model $model): void {
            if (! $model->isDirty('name')) {
                return;
            }

            /** @var Model&HasWorkspaceSlug $model */
            $oldSlug = $model->exists ? $model->getOriginal('slug') : null;
            $newSlug = $model->makeUniqueSlug((string) $model->getAttribute('name'));

            $model->deleteConflictingSlugRedirect($newSlug);
            $model->setAttribute('slug', $newSlug);

            if ($model->exists && is_string($oldSlug) && $oldSlug !== $newSlug) {
                $model->recordSlugRedirect($oldSlug);
            }
        });

        static::deleting(function (Model $model): void {
            /** @var Model&HasWorkspaceSlug $model */
            $model->slugRedirectsQuery()->delete();
        });
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function makeUniqueSlug(string $name): string
    {
        $baseSlug = Str::slug($name);
        $slug = $baseSlug;
        $suffix = 2;

        while ($this->slugExists($slug)) {
            $slug = "{$baseSlug}-{$suffix}";
            $suffix++;
        }

        return $slug;
    }

    protected function slugExists(string $slug): bool
    {
        return $this->slugScopeQuery()
            ->where('slug', $slug)
            ->when($this->exists, fn (Builder $query): Builder => $query->whereKeyNot($this->getKey()))
            ->exists();
    }

    protected function recordSlugRedirect(string $fromSlug): void
    {
        $attributes = [
            'redirectable_type' => $this->getMorphClass(),
            'from_slug' => $fromSlug,
            ...$this->slugRedirectScope(),
        ];

        SlugRedirect::query()->updateOrCreate($attributes, [
            'redirectable_id' => $this->getKey(),
        ]);
    }

    protected function deleteConflictingSlugRedirect(string $slug): void
    {
        SlugRedirect::query()
            ->where('redirectable_type', $this->getMorphClass())
            ->where($this->slugRedirectScope())
            ->where('from_slug', $slug)
            ->delete();
    }

    protected function slugRedirectsQuery(): Builder
    {
        return SlugRedirect::query()
            ->where('redirectable_type', $this->getMorphClass())
            ->where('redirectable_id', $this->getKey());
    }

    /**
     * @return Builder<Model>
     */
    abstract protected function slugScopeQuery(): Builder;

    /**
     * @return array{user_id?: int|null, world_id?: int|null}
     */
    abstract protected function slugRedirectScope(): array;
}
