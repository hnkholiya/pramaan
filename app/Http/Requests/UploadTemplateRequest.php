<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UploadTemplateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->currentOrganization() !== null;
    }

    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'description' => [
                'nullable',
                'string',
                'max:2000',
            ],

            'orientation' => [
                'required',
                'in:landscape,portrait',
            ],

            'file' => [
                'required',
                'file',
                'mimes:pdf,png,jpg,jpeg,svg',
                'max:10240',
            ],
        ];
    }
}