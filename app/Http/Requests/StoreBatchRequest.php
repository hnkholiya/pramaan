<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBatchRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->organization()->exists() ?? false;
    }

    public function rules(): array
    {
        return [
            'template_id' => ['required', 'exists:document_templates,id'],
            'csv' => ['required', 'file', 'mimes:csv,txt', 'max:5120'],
        ];
    }

    public function messages(): array
    {
        return [
            'csv.mimes' => 'The upload must be a CSV file.',
            'csv.max' => 'The CSV file must be 5MB or smaller.',
        ];
    }
}
