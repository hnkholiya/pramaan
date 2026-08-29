<?php

namespace App\Services;

use App\Models\Certificate;

/**
 * Generates a cryptographically random, unique public verification token.
 *
 * The token is used in public URLs (/verify/{token}) and never exposes
 * internal sequential database identifiers.
 */
class VerificationTokenService
{
    public function generate(): string
    {
        do {
            $token = bin2hex(random_bytes(24)); // 48 chars
        } while (Certificate::where('verification_token', $token)->exists());

        return $token;
    }
}
