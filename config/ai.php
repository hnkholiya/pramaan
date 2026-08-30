<?php

return [

    'default' => env('AI_PROVIDER', 'gemini'),

    'providers' => [

        'gemini' => [
            'driver' => 'gemini',
            'key' => env('GEMINI_API_KEY'),
            'url' => env(
                'GEMINI_BASE_URL',
                'https://generativelanguage.googleapis.com/v1beta/'
            ),
            'models' => [
                'text' => [
                    'default' => env(
                        'GEMINI_MODEL',
                        'gemini-3.6-flash'
                    ),
                ],
            ],
        ],

        'openai' => [
            'driver' => 'openai',
            'key' => env('OPENAI_API_KEY'),
            'url' => env(
                'OPENAI_URL',
                'https://api.openai.com/v1'
            ),
        ],

        'openai-compatible' => [
            'driver' => 'openai-compatible',
            'url' => env('OPENAI_COMPATIBLE_URL'),
            'key' => env('OPENAI_COMPATIBLE_API_KEY'),
        ],

    ],

];
