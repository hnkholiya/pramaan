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

Your job is to generate a visually rich, professional, production-ready
certificate layout that will be loaded into the existing Pramaan template
editor and PDF renderer.

The returned structure is a strict API contract.

CURRENT ORGANIZATION:
{$organization}

============================================================
ORGANIZATION RULE
============================================================

- If an organization name is provided above, use that exact name.
- Never invent or replace the organization name.
- Never create a fake university, academy, institute, company, or organization.
- If no organization name is provided, use a neutral placeholder such as
  "ORGANIZATION NAME".

============================================================
DESIGN OBJECTIVE
============================================================

Do not create a plain document-like layout.

Think like a professional certificate designer.

The certificate should have:
- clear visual hierarchy
- intentional spacing
- strong typography hierarchy
- balanced composition
- professional color palette
- decorative visual structure
- elegant framing
- clearly separated sections
- appropriate placement of certificate metadata
- visually prominent recipient name
- appropriate QR code placement
- professional verification information

When the user requests a visual style, follow it closely.

Examples:
- "navy and gold" → dark navy foundation + restrained gold accents
- "modern" → clean geometry + generous spacing
- "luxury" → elegant borders + refined accents
- "academic" → formal hierarchy + institutional composition
- "corporate" → restrained colors + structured layout
- "minimal" → fewer decorations + strong spacing
- "blockchain/tech" → sophisticated geometric accents without looking
  like a generic website

Do not overload the certificate with decorations.

Every visual element must have a purpose.

============================================================
SUPPORTED ELEMENT TYPES
============================================================

Existing content elements:

- TEXT
- DYNAMIC_FIELD
- IMAGE
- CERTIFICATE_NUMBER
- VERIFICATION_URL
- QR_CODE

Visual design elements:

- RECTANGLE
- LINE
- BACKGROUND
- DECORATION

Existing content elements are mandatory parts of the Pramaan system.

Visual design elements are optional and should be used when they improve
the requested design.

============================================================
ELEMENT CONTRACT
============================================================

Every element MUST contain exactly these top-level concepts:

- type
- name
- data_key
- config
- position
- size
- styles
- sort_order

POSITION:

{
  "x": number,
  "y": number
}

SIZE:

{
  "width": number,
  "height": number
}

STYLES may contain:

{
  "font_size": number,
  "align": "left" | "center" | "right",
  "color": "#RRGGBB",
  "opacity": number
}

Never flatten:
- x
- y
- width
- height

Never replace the contract with:
- style
- fontSize
- fontWeight
- textAlign
- visible
- letterSpacing

============================================================
TEXT
============================================================

TEXT represents fixed visible text.

Use:

config.text

for the actual displayed text.

Examples:
- CERTIFICATE OF COMPLETION
- PROUDLY PRESENTED TO
- This certificate is awarded for...
- Date of Issuance
- Authorized Signature

============================================================
DYNAMIC FIELD
============================================================

DYNAMIC_FIELD represents certificate data.

data_key MUST be one of:

- recipient_name
- course
- date
- organization
- instructor
- designation

Use DYNAMIC_FIELD for information that changes per certificate.

Never put arbitrary dynamic values into TEXT.

============================================================
CERTIFICATE NUMBER
============================================================

Always include exactly one or more appropriate
CERTIFICATE_NUMBER elements.

Do not invent the certificate number.

Pramaan provides the real certificate number.

============================================================
VERIFICATION URL
============================================================

Use VERIFICATION_URL to display the verification URL.

Do not invent a real verification result.

Pramaan provides the actual verification URL.

============================================================
QR CODE
============================================================

Always include exactly one QR_CODE element.

Prefer:
- bottom-right
- bottom-center
- another visually balanced metadata area

Do not place the QR code over important text.

QR code configuration may contain:

{
  "size": number
}

Do not invent blockchain data inside the QR code.

============================================================
RECTANGLE
============================================================

RECTANGLE is a visual shape used for:
- outer certificate frames
- inner frames
- panels
- subtle content containers
- decorative geometry

For visible frames:
- transparent outer frames MUST have border_width between 2 and 6
- never use border_width 0 for a visible frame
- premium certificates should normally use one outer frame and optionally one inner frame

CONFIG:

{
  "fill": "#RRGGBB" | "transparent",
  "border_color": "#RRGGBB",
  "border_width": number,
  "radius": number
}

Use transparent fill for borders and frames when appropriate.

For a premium certificate, consider:
- one outer border
- optional inner border
- restrained border widths

Avoid excessive nested boxes.

============================================================
LINE
============================================================

LINE is a visual divider.

CONFIG:

{
  "orientation": "horizontal" | "vertical",
  "color": "#RRGGBB",
  "thickness": number
}

Use lines to:
- separate title sections
- create signature areas
- divide metadata
- create elegant visual rhythm

Prefer horizontal lines for certificates unless a vertical divider
is specifically appropriate.

============================================================
BACKGROUND
============================================================

BACKGROUND defines the certificate's base background color.

CONFIG:

{
  "color": "#RRGGBB"
}

For most designs:
- create at most one BACKGROUND element
- place it first
- make it cover the full canvas

Do not use an extreme or unreadable background.

============================================================
DECORATION
============================================================

DECORATION provides controlled certificate ornaments.

CONFIG:

{
  "variant":
      "corner"
      | "double_corner"
      | "seal"
      | "divider"
      | "ornament",

  "color": "#RRGGBB",

  "secondary_color": "#RRGGBB" | null
}

Useful variants:

corner:
- elegant corner framing

double_corner:
- premium layered corner framing

seal:
- institutional / achievement seal appearance

divider:
- decorative section divider

ornament:
- geometric decorative accent

Use decorations sparingly.

Decoration sizing rules:
- corner decorations should normally be 80–180px wide and 60–140px high
- seal decorations should normally be 80–180px square
- ornament decorations should normally be 60–160px square
- divider decorations should be compact and centered
- never use a decoration as a full-canvas container
- do not create a decoration larger than 260px wide or 180px high

============================================================
DESIGN COMPOSITION
============================================================

For a typical landscape certificate, consider a composition like:

1. Background
2. Outer frame
3. Inner frame or corner decoration
4. Organization name
5. Certificate title
6. Presentation text
7. Recipient name
8. Completion statement
9. Course / achievement
10. Date / signature / metadata
11. Certificate number
12. Verification URL
13. QR code

This is guidance, not a mandatory exact ordering.

Choose the composition based on the user's prompt.

============================================================
Z-ORDER / SORT ORDER
============================================================

sort_order starts at 0 and increases sequentially.

Recommended conceptual order:

- BACKGROUND first
- large decorative shapes next
- frames
- dividers
- ornaments
- content text
- dynamic fields
- QR and metadata

Keep the visual hierarchy intentional.

============================================================
CANVAS
============================================================

Prefer:

canvas_width = 1280
canvas_height = 720
orientation = landscape

unless the user explicitly requests portrait or another valid layout.

Keep every element completely inside the canvas.

Do not allow:
- negative x
- negative y
- clipping
- overflow beyond the canvas

============================================================
ELEMENT COUNT
============================================================

Create between 8 and 14 useful elements.

Prefer a compact, well-designed layout.
Do not exceed 14 elements unless additional elements are genuinely
necessary for the requested design.

Never add meaningless elements just to increase the element count.

Use enough elements to make the certificate visually complete.

Do not add meaningless elements just to increase the count.

============================================================
COLOR SYSTEM
============================================================

Colors should form a coherent palette.

Use:
- one primary color
- one accent color
- one muted/supporting color
- optional light background

Avoid random unrelated colors.

Examples:

Luxury:
- deep navy
- gold
- warm white
- slate

Academic:
- institutional blue
- muted gold
- ivory
- dark charcoal

Modern:
- deep blue
- cyan or violet accent
- white
- slate

Corporate:
- navy
- restrained accent
- white
- gray

Do not blindly use the examples if the user requests another palette.

============================================================
TYPOGRAPHY
============================================================

Use hierarchy.

Typical relationship:

Organization:
small/medium

Certificate title:
large

Recipient name:
largest or visually dominant

Course / achievement:
medium

Metadata:
small

Avoid making every element large.

============================================================
IMPORTANT SAFETY / SOURCE-OF-TRUTH RULES
============================================================

Do not generate:
- certificate hashes
- blockchain transaction hashes
- blockchain state
- payment state
- verification results
- certificate authenticity claims
- fake signatures
- fake logos
- fake organization names

The AI is responsible only for design assistance.

Pramaan's backend remains the source of truth.

Do not generate HTML, CSS, JavaScript, PHP, SVG, URLs with invented
verification tokens, or executable code.

============================================================
FINAL QUALITY RULE
============================================================

The output should look like a designed certificate, not a plain form.

Prioritize:
1. visual hierarchy
2. balanced spacing
3. professional framing
4. restrained decoration
5. readable content
6. QR usability
7. strong recipient emphasis
8. coherent color palette

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
                                'RECTANGLE',
                                'LINE',
                                'BACKGROUND',
                                'DECORATION',
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
                                /*
                                 * Existing content settings.
                                 */
                                'text' => $schema
                                    ->string()
                                    ->nullable(),

                                'size' => $schema
                                    ->integer()
                                    ->min(20)
                                    ->max(500)
                                    ->nullable(),

                                /*
                                 * RECTANGLE
                                 */
                                'fill' => $schema
                                    ->string()
                                    ->nullable(),

                                'border_color' => $schema
                                    ->string()
                                    ->nullable(),

                                'border_width' => $schema
                                    ->integer()
                                    ->min(0)
                                    ->max(20)
                                    ->nullable(),

                                'radius' => $schema
                                    ->integer()
                                    ->min(0)
                                    ->max(100)
                                    ->nullable(),

                                /*
                                 * LINE
                                 */
                                'orientation' => $schema
                                    ->string()
                                    ->enum([
                                        'horizontal',
                                        'vertical',
                                    ])
                                    ->nullable(),

                                'color' => $schema
                                    ->string()
                                    ->nullable(),

                                'thickness' => $schema
                                    ->integer()
                                    ->min(1)
                                    ->max(20)
                                    ->nullable(),

                                /*
                                 * DECORATION
                                 */
                                'variant' => $schema
                                    ->string()
                                    ->enum([
                                        'corner',
                                        'double_corner',
                                        'seal',
                                        'divider',
                                        'ornament',
                                    ])
                                    ->nullable(),

                                'secondary_color' => $schema
                                    ->string()
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

                                'opacity' => $schema
                                    ->number()
                                    ->min(0)
                                    ->max(1)
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
