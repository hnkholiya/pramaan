<?php

namespace Database\Seeders;

use App\Models\Organization;
use App\Models\User;
use App\Services\TemplateService;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(TemplateService $templates): void
    {
        // Admin user (can access /admin)
        $admin = User::firstOrCreate(
            ['email' => 'admin@pramaan.test'],
            ['name' => 'Platform Admin', 'password' => 'password', 'is_admin' => true],
        );

        // Demo organization owner
        $demo = User::firstOrCreate(
            ['email' => 'demo@pramaan.test'],
            ['name' => 'Demo Org', 'password' => 'password'],
        );

        if (! $demo->organization()->exists()) {
            $org = Organization::create([
                'user_id' => $demo->id,
                'name' => 'Pramaan Demo University',
                'slug' => 'pramaan-demo-university',
                'email' => 'demo@pramaan.test',
                'status' => 'active',
            ]);

            if ($org->templates()->count() === 0) {
                $templates->create($org, [
                    'name' => 'Certificate of Completion',
                    'description' => 'Sample completion certificate',
                    'canvas_width' => 1200,
                    'canvas_height' => 850,
                    'orientation' => 'landscape',
                    'elements' => [
                        ['type' => 'TEXT', 'name' => 'Title', 'config' => ['text' => 'Certificate of Completion'], 'position' => ['x'=>250,'y'=>120], 'size' => ['width'=>700,'height'=>70], 'styles' => ['font_size'=>44,'bold'=>true,'align'=>'center']],
                        ['type' => 'TEXT', 'name' => 'Body', 'config' => ['text' => 'This is to certify that'], 'position' => ['x'=>250,'y'=>260], 'size' => ['width'=>700,'height'=>40], 'styles' => ['font_size'=>24,'align'=>'center']],
                        ['type' => 'DYNAMIC_FIELD', 'name' => 'Recipient Name', 'data_key' => 'recipient_name', 'position' => ['x'=>250,'y'=>320], 'size' => ['width'=>700,'height'=>60], 'styles' => ['font_size'=>38,'bold'=>true,'align'=>'center']],
                        ['type' => 'DYNAMIC_FIELD', 'name' => 'Course', 'data_key' => 'course_name', 'position' => ['x'=>250,'y'=>400], 'size' => ['width'=>700,'height'=>40], 'styles' => ['font_size'=>24,'align'=>'center']],
                        ['type' => 'CERTIFICATE_NUMBER', 'name' => 'Cert No', 'position' => ['x'=>60,'y'=>60], 'size' => ['width'=>300,'height'=>30], 'styles' => ['font_size'=>14]],
                        ['type' => 'QR_CODE', 'name' => 'QR', 'position' => ['x'=>1000,'y'=>620], 'size' => ['width'=>140,'height'=>140], 'config' => ['size'=>120]],
                    ],
                ]);
            }
        }

        $this->command?->info('Seeded admin@pramaan.test / password and demo@pramaan.test / password');
    }
}
