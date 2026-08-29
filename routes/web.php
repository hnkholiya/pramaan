<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\BatchController;
use App\Http\Controllers\CertificateController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\OrganizationController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PublicController;
use App\Http\Controllers\TemplateController;
use App\Http\Controllers\WebhookController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| PUBLIC
|--------------------------------------------------------------------------
*/

Route::get('/', [PublicController::class, 'home'])->name('home');
Route::get('/verify', [PublicController::class, 'verify'])
    ->name('public.verify');
Route::get('/verify/{token}', [PublicController::class, 'verify'])->name('public.verify.show');





/*
|--------------------------------------------------------------------------
| AUTH
|--------------------------------------------------------------------------
*/

Route::middleware('auth')->group(function () {
    // Profile (Breeze)
    Route::get('/profile', [\App\Http\Controllers\ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [\App\Http\Controllers\ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [\App\Http\Controllers\ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/organization/dashboard', [DashboardController::class, 'index'])->name('organization.dashboard');

    // Organization setup
    Route::get('/organization/create', [OrganizationController::class, 'create'])->name('organization.create');
    Route::post('/organization', [OrganizationController::class, 'store'])->name('organization.store');
    Route::get('/organization', [OrganizationController::class, 'show'])->name('organization.show');
    Route::put('/organization', [OrganizationController::class, 'update'])->name('organization.update');

    // Templates
    Route::get('/organization/templates', [TemplateController::class, 'index'])->name('organization.templates.index');
    Route::get('/organization/templates/create', [TemplateController::class, 'create'])->name('organization.templates.create');
    Route::post('/organization/templates', [TemplateController::class, 'store'])->name('organization.templates.store');
    Route::get('/organization/templates/{template}', [TemplateController::class, 'show'])->name('organization.templates.show');
    Route::get('/organization/templates/{template}/editor', [TemplateController::class, 'editor'])->name('organization.templates.editor');
    Route::get('/organization/templates/{template}/preview', [TemplateController::class, 'preview'])->name('organization.templates.preview');
    Route::put('/organization/templates/{template}', [TemplateController::class, 'update'])->name('organization.templates.update');
    Route::delete('/organization/templates/{template}', [TemplateController::class, 'destroy'])->name('organization.templates.destroy');
    Route::post('/organization/templates/{template}/elements', [TemplateController::class, 'storeElement'])->name('organization.templates.elements.store');
    Route::put('/organization/templates/{template}/elements/{element}', [TemplateController::class, 'updateElement'])->name('organization.templates.elements.update');
    Route::delete('/organization/templates/{template}/elements/{element}', [TemplateController::class, 'destroyElement'])->name('organization.templates.elements.destroy');
    Route::post('/organization/templates/{template}/save-layout', [TemplateController::class, 'saveLayout'])->name('organization.templates.save-layout');

    // Batches
    Route::get('/organization/batches', [BatchController::class, 'index'])->name('organization.batches.index');
    Route::get('/organization/batches/create', [BatchController::class, 'create'])->name('organization.batches.create');
    Route::post('/organization/batches', [BatchController::class, 'store'])->name('organization.batches.store');
    Route::get('/organization/batches/{batch}', [BatchController::class, 'show'])->name('organization.batches.show');
    Route::post('/organization/batches/{batch}/validate', [BatchController::class, 'validate'])->name('organization.batches.validate');
    Route::post('/organization/batches/{batch}/map', [BatchController::class, 'map'])->name('organization.batches.map');
    Route::post('/organization/batches/{batch}/quote', [BatchController::class, 'quote'])->name('organization.batches.quote');
    Route::post('/organization/batches/{batch}/pay', [BatchController::class, 'pay'])->name('organization.batches.pay');
    Route::post('/organization/batches/{batch}/generate', [BatchController::class, 'generate'])->name('organization.batches.generate');
    Route::post('/organization/batches/{batch}/anchor', [BatchController::class, 'anchor'])->name('organization.batches.anchor');

    // Certificates
    Route::get('/organization/certificates', [CertificateController::class, 'index'])->name('organization.certificates.index');
    Route::get('/organization/certificates/{certificate}/download', [CertificateController::class, 'download'])->name('organization.certificates.download');

    // Payments
    Route::get('/organization/payments', [PaymentController::class, 'index'])->name('organization.payments.index');
    Route::post('/organization/payments/{payment}/callback', [PaymentController::class, 'callback'])->name('organization.payments.callback');
});

/*
|--------------------------------------------------------------------------
| WEBHOOKS (no session auth)
|--------------------------------------------------------------------------
*/

Route::post('/webhooks/razorpay', [WebhookController::class, 'razorpay'])->name('webhooks.razorpay');

/*
|--------------------------------------------------------------------------
| ADMIN
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [AdminController::class, 'dashboard'])->name('dashboard');
    Route::get('/organizations', [AdminController::class, 'organizations'])->name('organizations');
    Route::get('/batches', [AdminController::class, 'batches'])->name('batches');
    Route::get('/certificates', [AdminController::class, 'certificates'])->name('certificates');
    Route::get('/payments', [AdminController::class, 'payments'])->name('payments');
    Route::get('/activity', [AdminController::class, 'activity'])->name('activity');
});
