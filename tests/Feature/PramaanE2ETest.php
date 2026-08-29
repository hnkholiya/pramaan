<?php

namespace Tests\Feature;

use App\Models\Certificate;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

/**
 * Full HTTP end-to-end test of the PRAMAAN flow.
 *
 * Covers: register -> login -> organization -> template -> batch (CSV)
 * -> validate -> map -> quote -> pay (mock) -> generate -> anchor -> verify.
 */
class PramaanE2ETest extends TestCase
{
    use RefreshDatabase;

    public function test_full_issuance_and_verification_flow(): void
    {
        // 1. Register
        $response = $this->post('/register', [
            'name' => 'Alice CEO',
            'email' => 'alice@pramaan.test',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);
        $response->assertRedirect('/dashboard');
        $this->assertAuthenticated();

        // 2. Create organization
        $this->post('/organization', ['name' => 'Acme Institute'])
            ->assertRedirect('/dashboard');

        $user = User::where('email', 'alice@pramaan.test')->first();
        $this->assertNotNull($user->organization, 'organization was created');

        // 3. Create template
        $tplResp = $this->post(route('organization.templates.store'), [
            'name' => 'Completion Certificate',
            'canvas_width' => 1200,
            'canvas_height' => 850,
            'orientation' => 'landscape',
            'elements' => [
                ['type' => 'TEXT', 'name' => 'Title', 'config' => ['text' => 'Certificate of Completion'], 'position' => ['x'=>300,'y'=>150], 'size' => ['width'=>600,'height'=>60], 'styles' => ['font_size'=>40,'bold'=>true,'align'=>'center']],
                ['type' => 'DYNAMIC_FIELD', 'name' => 'Recipient', 'data_key' => 'recipient_name', 'position' => ['x'=>300,'y'=>300], 'size' => ['width'=>600,'height'=>50], 'styles' => ['font_size'=>32,'align'=>'center']],
                ['type' => 'DYNAMIC_FIELD', 'name' => 'Course', 'data_key' => 'course_name', 'position' => ['x'=>300,'y'=>380], 'size' => ['width'=>600,'height'=>40], 'styles' => ['font_size'=>24,'align'=>'center']],
                ['type' => 'QR_CODE', 'name' => 'QR', 'position' => ['x'=>1000,'y'=>600], 'size' => ['width'=>140,'height'=>140], 'config' => ['size'=>120]],
                ['type' => 'CERTIFICATE_NUMBER', 'name' => 'No', 'position' => ['x'=>60,'y'=>60], 'size' => ['width'=>300,'height'=>30], 'styles' => ['font_size'=>14]],
            ],
        ]);
        $tplResp->assertSessionHasNoErrors();
        $tplResp->assertRedirect();
        $this->assertTrue($user->organization->templates()->count() >= 1, 'template persisted');

        $template = $user->organization->templates()->first();
        $this->assertNotNull($template);
        $this->assertNotNull($template->activeVersion(), 'template has active version');

        // 4. Create batch via CSV upload
        $csv = "recipient_name,recipient_email,course_name\n"
            ."John Doe,john@x.com,Physics\n"
            ."Jane Roe,jane@x.com,Chemistry\n"
            ."Bad,bad-email,Maths\n";
        $file = UploadedFile::fake()->createWithContent('recipients.csv', $csv);
        $this->post(route('organization.batches.store'), [
            'template_id' => $template->id,
            'csv' => $file,
        ])->assertSessionHasNoErrors();

        $batch = $user->organization->batches()->first();
        $this->assertNotNull($batch, 'batch created');
        $this->assertEquals(3, $batch->total_records);

        // 5. Validate
        $this->post(route('organization.batches.validate', $batch->id))->assertRedirect();
        $batch->refresh();
        $this->assertEquals(2, $batch->valid_records);
        $this->assertEquals(1, $batch->invalid_records);

        // 6. Map fields
        $this->post(route('organization.batches.map', $batch->id), [
            'mapping' => ['recipient_name' => 'recipient_name', 'recipient_email' => 'recipient_email', 'course_name' => 'course_name'],
        ])->assertRedirect();

        // 7. Quote
        $this->post(route('organization.batches.quote', $batch->id))->assertRedirect();
        $batch->refresh();
        $this->assertNotNull($batch->quote, 'quote created');

        // 8. Pay (mock capture)
        $this->post(route('organization.batches.pay', $batch->id))->assertRedirect();
        $batch->refresh();
        $this->assertEquals('paid', $batch->status->value, 'batch marked paid');
        $this->assertNotNull($user->organization->payments()->where('status', 'captured')->first(), 'payment captured');

        // 9. Generate certificates
        $this->post(route('organization.batches.generate', $batch->id))->assertRedirect();
        $batch->refresh();
        $this->assertEquals('completed', $batch->status->value, 'batch completed');
        $this->assertEquals(2, $batch->certificates()->count());

        // 10. Anchor to blockchain
        $this->post(route('organization.batches.anchor', $batch->id))->assertRedirect();
        $batch->refresh();
        $this->assertNotNull($batch->merkleAnchor, 'merkle anchor created');
        $this->assertEquals('confirmed', $batch->merkleAnchor->status->value, 'anchor confirmed');

        // 11. Public verification (no auth)
        $cert = $batch->certificates()->first();
        $this->get(route('public.verify.show', ['token' => $cert->verification_token]))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Public/Verify'));

        // 12. Certificate download with auth
        $this->get(route('organization.certificates.download', $cert->id))
            ->assertOk();

        // 13. Cross-organization isolation: another user must NOT access this cert
        $this->post('/logout');
        $this->post('/register', [
            'name' => 'Bob CEO',
            'email' => 'bob@other.test',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);
        $this->post('/organization', ['name' => 'Other Org']);
        $other = User::where('email', 'bob@other.test')->first();
        $this->assertNotNull($other->organization);

        $this->get(route('organization.certificates.download', $cert->id))
            ->assertForbidden();

        $this->get(route('organization.batches.show', $batch->id))
            ->assertForbidden();
    }
}
