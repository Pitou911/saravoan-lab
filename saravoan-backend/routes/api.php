<?php
// routes/api.php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\LabRequestController;
use App\Http\Controllers\TelegramController;
use App\Http\Controllers\TestPackageController;
use App\Http\Controllers\AdminController;

// ── Public ─────────────────────────────────────────────────────
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// ── Authenticated (doctor + admin) ─────────────────────────────
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);

    // Lab requests
    Route::get('/lab-requests',            [LabRequestController::class, 'index']);
    Route::post('/lab-requests',           [LabRequestController::class, 'store']);
    Route::get('/lab-requests/{id}',       [LabRequestController::class, 'show']);
    Route::delete('/lab-requests/{id}',    [LabRequestController::class, 'destroy']);

    // Telegram / print logging
    Route::post('/notify/print',           [TelegramController::class, 'sendPrintNotification']);
    Route::post('/log/invoice',            [TelegramController::class, 'logInvoicePrint']);

    // Test packages
    Route::get('/packages',                [TestPackageController::class, 'index']);
    Route::post('/packages',               [TestPackageController::class, 'store']);
    Route::delete('/packages/{id}',        [TestPackageController::class, 'destroy']);

    // Other test options — active only (for doctor dropdown)
    Route::get('/other-tests',             [AdminController::class, 'getActiveOtherTests']);

    // ── Admin only ──────────────────────────────────────────────
    Route::prefix('admin')->group(function () {
        Route::get('/stats',               [AdminController::class, 'stats']);
        Route::get('/activity',            [AdminController::class, 'activityLogs']);
        Route::get('/doctors',             [AdminController::class, 'doctors']);
        Route::get('/requests',            [AdminController::class, 'allRequests']);
        Route::post('/admins',             [AdminController::class, 'createAdmin']);

        // Other test options CRUD
        Route::get('/other-tests',         [AdminController::class, 'getOtherTests']);
        Route::post('/other-tests',        [AdminController::class, 'storeOtherTest']);
        Route::put('/other-tests/{id}',    [AdminController::class, 'updateOtherTest']);
        Route::delete('/other-tests/{id}', [AdminController::class, 'destroyOtherTest']);
    });
});
