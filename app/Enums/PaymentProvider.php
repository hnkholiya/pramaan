<?php

namespace App\Enums;

enum PaymentProvider: string
{
    case Razorpay = 'razorpay';
    case Mock = 'mock'; // development/testing provider

    public function label(): string
    {
        return match ($this) {
            self::Razorpay => 'Razorpay',
            self::Mock => 'Mock (test)',
        };
    }
}
