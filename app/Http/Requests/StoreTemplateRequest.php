<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTemplateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->organization()->exists() ?? false;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'canvas_width' => ['nullable', 'integer', 'min:400', 'max:4000'],
            'canvas_height' => ['nullable', 'integer', 'min:300', 'max:3000'],
            'orientation' => ['nullable', 'in:landscape,portrait'],
            'elements' => ['nullable', 'array'],
            'elements.*.type' => ['required', 'in:TEXT,DYNAMIC_FIELD,IMAGE,CERTIFICATE_NUMBER,VERIFICATION_URL,QR_CODE'],
        ];
    }
}
