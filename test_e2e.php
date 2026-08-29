<?php

require __DIR__.'/vendor/autoload.php';
$app = require __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Enums\BatchStatus;
use App\Enums\PaymentStatus;
use App\Models\User;
use App\Services\ActivityLogService;
use App\Services\AiService;
use App\Services\Blockchain\BlockchainService;
use App\Services\CertificateService;
use App\Services\CertificateNumberService;
use App\Services\CsvService;
use App\Services\FieldMappingService;
use App\Services\Merkle\MerkleTreeService;
use App\Services\OrganizationService;
use App\Services\Payment\PaymentService;
use App\Services\PdfService;
use App\Services\PricingService;
use App\Services\QrCodeService;
use App\Services\StorageService;
use App\Services\TemplateService;
use App\Services\VerificationService;
use App\Services\VerificationTokenService;

$pass = function (bool $ok, string $msg): void {
    echo ($ok ? "  [OK] " : "  [FAIL] ").$msg.PHP_EOL;
    if (! $ok) {
        throw new \Exception("FAILED: $msg");
    }
};

echo "=== PRAMAAN SERVICE E2E TEST ===\n";

// 1. User + Org
$orgService = app(OrganizationService::class);
$user = User::firstOrCreate(['email' => 'ceo@acme.test'], ['name' => 'CEO', 'password' => bcrypt('secret123')]);
$org = $user->organization ?: $orgService->createForUser($user, ['name' => 'Acme University']);
echo "1. Organization: {$org->name} (slug={$org->slug})\n";
$pass($org->slug === 'acme-university', 'org created with unique slug');

// 2. Template + elements
$ts = app(TemplateService::class);
$template = $ts->create($org, [
    'name' => 'Course Completion',
    'canvas_width' => 1200,
    'canvas_height' => 850,
    'orientation' => 'landscape',
    'elements' => [
        ['type' => 'TEXT', 'name' => 'Title', 'config' => ['text' => 'Certificate of Completion'], 'position' => ['x'=>350,'y'=>150], 'size' => ['width'=>500,'height'=>60], 'styles'=>['font_size'=>40,'bold'=>true,'align'=>'center']],
        ['type' => 'DYNAMIC_FIELD', 'name' => 'Recipient Name', 'data_key' => 'recipient_name', 'position' => ['x'=>350,'y'=>300], 'size' => ['width'=>500,'height'=>50], 'styles'=>['font_size'=>32,'align'=>'center']],
        ['type' => 'DYNAMIC_FIELD', 'name' => 'Course Name', 'data_key' => 'course_name', 'position' => ['x'=>350,'y'=>380], 'size' => ['width'=>500,'height'=>40], 'styles'=>['font_size'=>24,'align'=>'center']],
        ['type' => 'CERTIFICATE_NUMBER', 'name' => 'Cert No', 'position' => ['x'=>60,'y'=>60], 'size' => ['width'=>300,'height'=>30], 'styles'=>['font_size'=>14]],
        ['type' => 'VERIFICATION_URL', 'name' => 'Verify URL', 'position' => ['x'=>350,'y'=>640], 'size' => ['width'=>500,'height'=>30], 'styles'=>['font_size'=>12,'align'=>'center']],
        ['type' => 'QR_CODE', 'name' => 'QR', 'position' => ['x'=>1000,'y'=>600], 'size' => ['width'=>140,'height'=>140]],
    ],
]);
$v1 = $template->activeVersion();
$pass($v1 && $v1->version === 1, 'template version 1 created and active');
$pass($template->elements()->count() === 6, '6 elements created');

// 3. CSV upload + batch
$csv = "recipient_name,recipient_email,course_name,issue_date\n"
      ."Alice Smith,alice@x.com,Computer Science,2026-01-15\n"
      ."Bob Jones,bob@x.com,Mathematics,2026-01-20\n"
      ."Charlie,bad-email,Physics,2026-02-01\n"
      ."Dave,dave@x.com,,2026-03-01\n";
$csvSvc = app(CsvService::class);
$batch = $csvSvc->createBatch($org, $template, 'recipients.csv', $csv);
$pass($batch->total_records === 4, 'batch has 4 records');
$pass($batch->status === BatchStatus::Uploaded, 'batch status=uploaded');

// 4. Validate records
$summary = $csvSvc->validateRecords($batch, ['recipient_name', 'recipient_email', 'course_name'], ['recipient_email'=>'email']);
$pass($summary['valid'] === 2 && $summary['invalid'] === 2, "validation: 2 valid, 2 invalid (got {$summary['valid']}/{$summary['invalid']})");
$batch->refresh();

// 5. Field mapping (coverage)
$mappingSvc = app(FieldMappingService::class);
$mappingSvc->saveMapping($batch, ['recipient_name'=>'recipient_name','recipient_email'=>'recipient_email','course_name'=>'course_name','issue_date'=>'issue_date']);
$mappingSvc->assertCoverage($batch, ['recipient_name','course_name']);
$pass(true, 'field mapping saved with coverage');
$batch->refresh();

// 6. Quote
$priceSvc = app(PricingService::class);
$quote = $priceSvc->buildQuote($batch);
$pass($quote->certificate_count === 2, 'quote counts 2 valid certificates');
$pass($quote->total > 0, "quote total = {$quote->total} ".$quote->currency);

// 7. Payment (mock) order + capture
$paySvc = app(PaymentService::class);
$payment = $paySvc->createOrderForQuote($quote);
$pass($payment->status === PaymentStatus::Created, 'payment order created (mock)');
$captured = $paySvc->verifyAndCapture($payment, [
    'razorpay_order_id' => $payment->provider_order_id,
    'razorpay_payment_id' => 'pay_mock_001',
    'razorpay_signature' => 'mock_paid_signature',
]);
$pass($captured->status === PaymentStatus::Captured, 'payment captured server-side');
$batch->refresh();
$pass($batch->status === BatchStatus::Paid, 'batch marked paid');

// 8. Generate certificates + PDFs + hashes
$certSvc = app(CertificateService::class);
$certSvc->generateBatchCertificates($batch);
$batch->refresh();
$certs = $batch->certificates()->get();
$pass($certs->count() === 2, "2 certificates generated (got {$certs->count()})");
$pass($certs->every(fn($c) => $c->pdf_path && $c->pdf_hash && strlen($c->pdf_hash)===64 && $c->verification_token), 'certificates have pdf, sha256, token');

// PDF actually non-empty and valid
$pdfSvc = app(PdfService::class);
$pdfBytes = app(StorageService::class)->get($certs->first()->pdf_path);
$pass(str_starts_with($pdfBytes ?? '', '%PDF'), 'generated PDF is valid (%PDF magic)');

// 9. Merkle + blockchain anchor
$anchor = $certSvc->anchorBatch($batch);
$pass($anchor->merkle_root && strlen($anchor->merkle_root)===64, 'merkle root computed');
$pass($anchor->status->value === 'confirmed', 'blockchain anchor confirmed (mock)');
$pass($anchor->transaction_hash !== null, 'transaction hash present');
$pass($anchor->blockchainRecords()->count() === 2, 'per-certificate merkle proofs stored');

// 10. Public verification
$verSvc = app(VerificationService::class);
$result = $verSvc->verifyByToken($certs->first()->verification_token);
$pass($result['valid'] === true, 'public verification VALID');
$pass($result['checks']['document_integrity']['valid'], '  document integrity ok');
$pass($result['checks']['merkle_proof']['valid'], '  merkle proof ok');
$pass($result['checks']['blockchain_anchor']['valid'], '  blockchain anchor ok');

// 11. Negative: modified PDF must FAIL
$tamperSvc = new CertificateService(app(CertificateNumberService::class), app(VerificationTokenService::class), app(PdfService::class), app(\App\Services\HashService::class), app(StorageService::class), app(MerkleTreeService::class), app(\App\Services\Blockchain\BlockchainService::class), app(ActivityLogService::class));
$first = $certs->first();
$path = $first->pdf_path;
$original = app(StorageService::class)->get($path);
app(StorageService::class)->store($path, $original . 'TAMPERED');
$tamperedResult = $verSvc->verifyByToken($first->verification_token);
app(StorageService::class)->store($path, $original); // restore
$pass($tamperedResult['valid'] === false && $tamperedResult['checks']['document_integrity']['valid'] === false, 'tampered PDF correctly detected as INVALID');

// 12. AI (fallback)
$ai = app(AiService::class);
$wording = $ai->suggestCertificateWording($template, 'Alice Smith');
$pass(!empty($wording['title']), 'AI wording suggestion returned: '.$wording['title']);

// 13. QR data uri
$qr = app(QrCodeService::class)->dataUri('https://example.test/verify/abc');
$pass(str_contains($qr, 'data:image/png;base64'), 'QR PNG data URI generated');

echo "\nALL SERVICE E2E TESTS PASSED\n";
