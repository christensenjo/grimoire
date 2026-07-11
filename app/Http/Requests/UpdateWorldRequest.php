<?php

namespace App\Http\Requests;

use App\Rules\SlugifiableName;
use Illuminate\Foundation\Http\FormRequest;

class UpdateWorldRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:120', new SlugifiableName],
            'description' => ['nullable', 'string', 'max:2000'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Give your World a name.',
            'name.max' => 'World names may not be longer than 120 characters.',
            'description.max' => 'World descriptions may not be longer than 2,000 characters.',
        ];
    }
}
