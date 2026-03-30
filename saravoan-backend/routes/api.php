<?php
// routes/api.php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\LabRequestController;
use App\Http\Controllers\TelegramController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);

    // Lab requests
    Route::get('/lab-requests',       [LabRequestController::class, 'index']);
    Route::post('/lab-requests',      [LabRequestController::class, 'store']);
    Route::get('/lab-requests/{id}',  [LabRequestController::class, 'show']);
    Route::delete('/lab-requests/{id}', [LabRequestController::class, 'destroy']);
// Telegram notification (called when doctor prints)
    Route::post('/notify/print', [TelegramController::class, 'sendPrintNotification']);
});
