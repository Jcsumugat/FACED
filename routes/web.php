<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FacedRecordController;
use App\Http\Controllers\AssistanceRecordController;
use App\Http\Controllers\SitRepController;
use App\Http\Controllers\UserManagementController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\FamilyMemberController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Auth routes (Breeze)
require __DIR__ . '/auth.php';

// Landing page
Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('welcome');

// Staff login page
Route::get('/login/staff', function () {
    return Inertia::render('Auth/LoginStaff', [
        'canResetPassword' => Route::has('password.request'),
        'status' => session('status'),
    ]);
})->middleware('guest')->name('login.staff');

// Staff register page
Route::get('/register/staff', function () {
    return Inertia::render('Auth/RegisterStaff');
})->middleware('guest')->name('register.staff');

// Authenticated routes
Route::middleware(['auth', 'verified'])->group(function () {

    // Dashboard — all roles
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    // FACED Records — all roles can view/create
    Route::resource('records', FacedRecordController::class);

    // Assistance Records — nested under a FACED record
    Route::post('records/{record}/assistance', [AssistanceRecordController::class, 'store'])
        ->name('assistance.store');
    Route::patch('records/{record}/assistance/{assistance}/approve', [AssistanceRecordController::class, 'approve'])
        ->name('assistance.approve');
    Route::patch('records/{record}/assistance/{assistance}/lock', [AssistanceRecordController::class, 'lock'])
        ->name('assistance.lock');

    // Reports — all roles
    Route::get('/reports', [ReportController::class, 'index'])
        ->name('reports.index');

    // SitRep — Admin only
    Route::middleware(['role:MSWDO / Admin'])->group(function () {
        Route::get('/sitrep', [SitRepController::class, 'index'])
            ->name('sitrep.index');
        Route::post('/sitrep/generate-summary', [SitRepController::class, 'generateSummary'])
            ->name('sitrep.generate');
        Route::post('/sitrep', [SitRepController::class, 'store'])
            ->name('sitrep.store');
    });

    // User Management — Admin only
    Route::middleware(['role:MSWDO / Admin'])->group(function () {
        Route::get('/users', [UserManagementController::class, 'index'])
            ->name('users.index');
        Route::post('/users', [UserManagementController::class, 'store'])
            ->name('users.store');
        Route::delete('/users/{user}', [UserManagementController::class, 'destroy'])
            ->name('users.destroy');
    });

    // Family Members — nested under FACED record
    Route::post('records/{record}/members', [FamilyMemberController::class, 'store'])
        ->name('members.store');
    Route::put('records/{record}/members/{member}', [FamilyMemberController::class, 'update'])
        ->name('members.update');
    Route::delete('records/{record}/members/{member}', [FamilyMemberController::class, 'destroy'])
        ->name('members.destroy');

    // Profile (Breeze default)
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});
