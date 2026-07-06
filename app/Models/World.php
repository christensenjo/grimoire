<?php

namespace App\Models;

use Database\Factories\WorldFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
