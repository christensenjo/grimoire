<?php

namespace App\Models;

use Database\Factories\WorldFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class World extends Model
{
    /** @use HasFactory<WorldFactory> */
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'name',
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

    /**
     * @return array{folders: list<array{id: int, name: string, parentId: int|null}>, files: list<array{id: int, name: string, folderId: int|null}>}
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
     * @return array{id: int, name: string, description: string|null, updatedAt: string|null, updatedForHumans: string|null}
     */
    public function toInertiaArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'updatedAt' => $this->updated_at?->toISOString(),
            'updatedForHumans' => $this->updated_at?->diffForHumans(),
        ];
    }
}
