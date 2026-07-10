<?php

namespace App\Http\Requests;

use App\Models\Folder;
use App\Models\World;
use App\Rules\SlugifiableName;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class UpdateFolderRequest extends FormRequest
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
            'parent_id' => [
                'nullable',
                'integer',
                Rule::exists('folders', 'id')->where('world_id', $world->id),
            ],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            if ($validator->errors()->isNotEmpty()) {
                return;
            }

            /** @var Folder $folder */
            $folder = $this->route('folder');
            $parentId = $this->input('parent_id');

            if ($folder->wouldCreateCycle($parentId === null ? null : (int) $parentId)) {
                $validator->errors()->add(
                    'parent_id',
                    'A Folder cannot be moved into itself or one of its descendants.',
                );
            }
        });
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Give your Folder a name.',
            'name.max' => 'Folder names may not be longer than 120 characters.',
            'parent_id.exists' => 'That parent Folder is not in this World.',
        ];
    }
}
