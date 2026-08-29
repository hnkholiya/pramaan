<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MapBatchFieldsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->organization()->exists() ?? false;
    }

    public function rules(): array
    {
        return [
            'mapping' => ['required', 'array'],
            'mapping.*' => ['required', 'string', 'max:255'],
        ];
    }
}
