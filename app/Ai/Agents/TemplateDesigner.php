<?php

namespace App\Ai\Agents;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Contracts\Conversational;
use Laravel\Ai\Contracts\HasStructuredOutput;
use Laravel\Ai\Contracts\HasTools;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Messages\Message;
use Laravel\Ai\Promptable;
use Laravel\Ai\Attributes\Timeout;
use Stringable;

#[Timeout(90)]
class TemplateDesigner implements Agent, Conversational, HasStructuredOutput, HasTools
{
    use Promptable;
    private string $organizationName;

    public function __construct(string $organizationName = '')
    {
        $this->organizationName = trim($organizationName);
    }

    /**
     * Instructions for Pramaan's certificate template designer.
     */
    public function instructions(): Stringable|string
    {
        $organization = $this->organizationName !== ''
            ? $this->organizationName
            : 'NO ORGANIZATION NAME PROVIDED';

        return <<<PRAMAAN_INSTRUCTIONS
You are Pramaan's professional certificate template designer.

Your job is to generate a structured certificate layout that will
be loaded into the existing Pramaan template editor.

The returned structure is a strict API contract.

CURRENT ORGANIZATION:
{$organization}

IMPORTANT ORGANIZATION RULE:
- If an organization name is provided above, use that exact name.
- Never invent or replace the organization name.
- Never create a fake university, academy, institute, company, or organization.
- If no organization name is provided, use a neutral placeholder such as
  "ORGANIZATION NAME".

Every element MUST contain these top-level fields:

- type
- name
- data_key
- config
- position
- size
- styles
- sort_order

POSITION FORMAT:

{
  "x": number,
  "y": number
}

SIZE FORMAT:

{
  "width": number,
  "height": number
}

STYLES FORMAT:

{
  "font_size": number,
  "align": "left" | "center" | "right",
  "color": "#RRGGBB"
}

Never flatten x, y, width, or height.

Never use these fields instead of the required structure:

- x
- y
- width
- height
- style
- fontSize
- fontWeight
- textAlign
- visible
- letterSpacing

Allowed element types ONLY:

- TEXT
- DYNAMIC_FIELD
- IMAGE
- CERTIFICATE_NUMBER
- VERIFICATION_URL
- QR_CODE

For TEXT:
config.text contains the actual visible text.

For DYNAMIC_FIELD:
data_key contains the field name.

Useful data keys:

- recipient_name
- course
- date
- organization
- instructor
- designation

Always include:

- certificate title
- recipient name
- certificate number
- QR code

Prefer:

canvas_width = 1280
canvas_height = 720
orientation = landscape

Keep all elements inside the canvas.

Use professional typography and a clean certificate hierarchy.

sort_order starts at 0 and increases sequentially.

Do not generate HTML, CSS, JavaScript, PHP, SVG or executable code.

Do not invent:

- certificate hashes
- transaction hashes
- blockchain state
- payment state
- verification results
- certificate authenticity claims

The AI is responsible only for design assistance.
Pramaan's backend remains the source of truth.

Create between 5 and 12 useful elements.

If an organization name is displayed as static TEXT, its config.text
must use the exact CURRENT ORGANIZATION value above.

Never use a fictional organization name.
PRAMAAN_INSTRUCTIONS;
    }

    /**
     * Conversation state is intentionally empty for this agent.
     *
     * @return iterable<Message>
     */
    public function messages(): iterable
    {
        return [];
    }

    /**
     * Template generation does not require external tools.
     *
     * @return iterable<Tool>
     */
    public function tools(): iterable
    {
        return [];
    }

    /**
     * Structured output schema for the Pramaan template editor.
     */
    public function schema(JsonSchema $schema): array
    {
        return [
            'name' => $schema
                ->string()
                ->required(),

            'description' => $schema
                ->string()
                ->required(),

            'canvas_width' => $schema
                ->integer()
                ->min(800)
                ->max(3000)
                ->required(),

            'canvas_height' => $schema
                ->integer()
                ->min(500)
                ->max(2000)
                ->required(),

            'orientation' => $schema
                ->string()
                ->enum([
                    'landscape',
                    'portrait',
                ])
                ->required(),

            'elements' => $schema
                ->array()
                ->items(
                    $schema->object([
                        'type' => $schema
                            ->string()
                            ->enum([
                                'TEXT',
                                'DYNAMIC_FIELD',
                                'IMAGE',
                                'CERTIFICATE_NUMBER',
                                'VERIFICATION_URL',
                                'QR_CODE',
                            ])
                            ->required(),

                        'name' => $schema
                            ->string()
                            ->required(),

                        'data_key' => $schema
                            ->string()
                            ->nullable(),

                        'config' => $schema
                            ->object([
                                'text' => $schema
                                    ->string()
                                    ->nullable(),

                                'size' => $schema
                                    ->integer()
                                    ->min(20)
                                    ->max(500)
                                    ->nullable(),
                            ])
                            ->nullable(),

                        'position' => $schema
                            ->object([
                                'x' => $schema
                                    ->integer()
                                    ->min(0)
                                    ->max(3000)
                                    ->required(),

                                'y' => $schema
                                    ->integer()
                                    ->min(0)
                                    ->max(2000)
                                    ->required(),
                            ])
                            ->required(),

                        'size' => $schema
                            ->object([
                                'width' => $schema
                                    ->integer()
                                    ->min(20)
                                    ->max(3000)
                                    ->required(),

                                'height' => $schema
                                    ->integer()
                                    ->min(20)
                                    ->max(2000)
                                    ->required(),
                            ])
                            ->required(),

                        'styles' => $schema
                            ->object([
                                'font_size' => $schema
                                    ->integer()
                                    ->min(6)
                                    ->max(120)
                                    ->nullable(),

                                'align' => $schema
                                    ->string()
                                    ->enum([
                                        'left',
                                        'center',
                                        'right',
                                    ])
                                    ->nullable(),

                                'color' => $schema
                                    ->string()
                                    ->nullable(),
                            ])
                            ->nullable(),

                        'sort_order' => $schema
                            ->integer()
                            ->min(0)
                            ->required(),
                    ])
                )
                ->required(),
        ];
    }
}
