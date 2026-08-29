<?php

namespace App\Http\Controllers;

use App\Services\VerificationService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicController extends Controller
{
    public function __construct(
        private VerificationService $verification,
    ) {}

    public function home()
    {
        return Inertia::render('Public/Home');
    }

    /**
     * Public certificate verification.
     *
     * Supports:
     * /verify
     * /verify?number=PRM-...
     * /verify/{token}
     */
    public function verify(Request $request, ?string $token = null)
    {
        // QR / token verification
        if ($token !== null && $token !== '') {
            $result = $this->verification->verifyByToken($token);

            return Inertia::render('Public/Verify', [
                'result' => $result,
            ]);
        }

        // Manual certificate-number verification
        $number = trim((string) $request->query('number', ''));

        if ($number === '') {
            return Inertia::render('Public/Verify', [
                'result' => null,
            ]);
        }

        $result = $this->verification->verifyByNumber($number);

        return Inertia::render('Public/Verify', [
            'result' => $result,
        ]);
    }
}