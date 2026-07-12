<?php

namespace App\Http\Requests;

use App\Models\File;
use App\Models\World;
use App\Rules\SlugifiableName;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class UpdateFileRequest extends FormRequest
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
            'content' => ['nullable', 'string'],
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

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            if ($validator->errors()->isNotEmpty()) {
                return;
            }

            /** @var File $file */
            $file = $this->route('file');

            if (!$file->is_scratchpad) {
                return;
            }

            if (!$this->exists('folder_id')) {
                return;
            }

            $folderId = $this->input('folder_id');

            if ($folderId !== null && $folderId !== '') {
                $validator->errors()->add('folder_id', 'The Scratchpad must stay at the World root.');
            }
        });
    }
}
