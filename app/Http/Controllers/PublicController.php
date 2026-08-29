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

    public function verifyForm()
    {
        return Inertia::render('Public/Verify', [
            'result' => null,
        ]);
    }

    public function verify(Request $request, string $token = null)
    {
        if ($token) {
            $result = $this->verification->verifyByToken($token);
        } else {
            $number = (string) $request->query('number', '');
            if ($number === '') {
                return Inertia::render('Public/Verify', ['result' => null]);
            }
            $result = $this->verification->verifyByNumber($number);
        }

        return Inertia::render('Public/Verify', [
            'result' => $result,
        ]);
    }
}
