<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GenerateAiTemplateRequest extends FormRequest
{
    /**
     * Allow authenticated organization users to generate templates.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Validate the AI template generation request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'prompt' => [
                'required',
                'string',
                'min:10',
                'max:2000',
            ],
        ];
    }

    /**
     * Custom validation messages.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'prompt.required' => 'Please describe the certificate you want to generate.',
            'prompt.min' => 'The template description must be at least 10 characters.',
            'prompt.max' => 'The template description must not exceed 2000 characters.',
        ];
    }
}