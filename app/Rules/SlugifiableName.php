<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Str;

class SlugifiableName implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (!is_string($value) || Str::slug($value) !== '') {
            return;
        }

        $fail('The :attribute must include at least one letter or number.');
    }
}
