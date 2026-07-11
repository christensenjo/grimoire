<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class SlugRedirect extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'redirectable_type',
        'redirectable_id',
        'user_id',
        'world_id',
        'from_slug',
    ];

    /**
     * @return MorphTo<Model, $this>
     */
    public function redirectable(): MorphTo
    {
        return $this->morphTo();
    }
}
