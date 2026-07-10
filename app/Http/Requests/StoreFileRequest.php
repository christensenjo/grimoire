<?php

namespace App\Http\Requests;

use App\Models\World;
use App\Rules\SlugifiableName;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreFileRequest extends FormRequest
{
    /**
     * @return array<string, list<mixed>>
     */
    public function rules(): array
    {
        /** @var World $world */
        $world = $this->route('world');

        return [
            'name' => ['required', 'string', 'max:120', new SlugifiableName],
            'folder_id' => [
                'nullable',
                'integer',
                Rule::exists('folders', 'id')->where('world_id', $world->id),
            ],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Give your File a name.',
            'name.max' => 'File names may not be longer than 120 characters.',
            'folder_id.exists' => 'That Folder is not in this World.',
        ];
    }
}
