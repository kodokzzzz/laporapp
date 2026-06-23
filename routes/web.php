<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\OperatorController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PublicController;
use App\Http\Controllers\ReporterController;
use App\Http\Controllers\UnitController;
use App\Http\Controllers\UserManagementController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::get('/', [PublicController::class, 'index'])->name('home');
Route::get('/check-status', [PublicController::class, 'checkStatus'])->name('check-status');
Route::post('/check-status', [PublicController::class, 'getStatus'])->name('check-status.search');
Route::get('/statistik', [PublicController::class, 'statistics'])->name('public.statistics');

// Public reporting
Route::get('/lapor', [PublicController::class, 'create'])->name('public.reports.create');
Route::post('/lapor', [PublicController::class, 'store'])->name('public.reports.store');
Route::get('/lapor/sukses', [PublicController::class, 'success'])->name('public.reports.success');

// Authenticated routes
Route::middleware(['auth', 'active'])->group(function () {
    
    // Dashboard redirect based on role
    Route::get('/dashboard', function () {
        $role = auth()->user()->role;
        if ($role === 'admin') {
            return redirect()->route('admin.dashboard');
        } elseif ($role === 'operator') {
            return redirect()->route('operator.dashboard');
        }
        return redirect()->route('reporter.dashboard');
    })->name('dashboard');

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllRead'])->name('notifications.read-all');
    Route::get('/notifications/unread-count', [NotificationController::class, 'getUnreadCount'])->name('notifications.unread-count');

    // Profile routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Reporter routes
    Route::middleware('role:pelapor,operator,admin')->prefix('reporter')->name('reporter.')->group(function () {
        Route::get('/dashboard', [ReporterController::class, 'dashboard'])->name('dashboard');
        Route::get('/reports', [ReporterController::class, 'index'])->name('reports.index');
        Route::get('/reports/create', [ReporterController::class, 'create'])->name('reports.create');
        Route::post('/reports', [ReporterController::class, 'store'])->name('reports.store');
        Route::get('/reports/{report}', [ReporterController::class, 'show'])->name('reports.show');
        Route::post('/reports/{report}/comment', [ReporterController::class, 'addComment'])->name('reports.comment');
        Route::post('/reports/{report}/resolve', [ReporterController::class, 'markResolved'])->name('reports.resolve');
        Route::post('/reports/{report}/escalate', [ReporterController::class, 'escalate'])->name('reports.escalate');
    });

    // Operator routes
    Route::middleware('role:operator,admin')->prefix('operator')->name('operator.')->group(function () {
        Route::get('/dashboard', [OperatorController::class, 'dashboard'])->name('dashboard');
        Route::get('/reports', [OperatorController::class, 'index'])->name('reports.index');
        Route::get('/reports/{report}', [OperatorController::class, 'show'])->name('reports.show');
        Route::post('/reports/{report}/status', [OperatorController::class, 'updateStatus'])->name('reports.status');
        Route::post('/reports/{report}/assign', [OperatorController::class, 'assign'])->name('reports.assign');
        Route::post('/reports/{report}/priority', [OperatorController::class, 'setPriority'])->name('reports.priority');
        Route::post('/reports/{report}/deadline', [OperatorController::class, 'setDeadline'])->name('reports.deadline');
        Route::post('/reports/{report}/forward', [OperatorController::class, 'forward'])->name('reports.forward');
        Route::post('/reports/{report}/comment', [OperatorController::class, 'addComment'])->name('reports.comment');
        Route::post('/reports/{report}/attachment', [OperatorController::class, 'addResponseAttachment'])->name('reports.attachment');
    });

    // Admin routes
    Route::middleware('role:admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');
        Route::get('/reports', [AdminController::class, 'reports'])->name('reports.index');
        
        // User management
        Route::get('/users', [UserManagementController::class, 'index'])->name('users.index');
        Route::post('/users', [UserManagementController::class, 'store'])->name('users.store');
        Route::put('/users/{user}', [UserManagementController::class, 'update'])->name('users.update');
        Route::post('/users/{user}/toggle-active', [UserManagementController::class, 'toggleActive'])->name('users.toggle-active');
        Route::post('/users/{user}/reset-password', [UserManagementController::class, 'resetPassword'])->name('users.reset-password');
        
        // Categories
        Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');
        Route::post('/categories', [CategoryController::class, 'store'])->name('categories.store');
        Route::put('/categories/{category}', [CategoryController::class, 'update'])->name('categories.update');
        Route::delete('/categories/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy');
        
        // Units
        Route::get('/units', [UnitController::class, 'index'])->name('units.index');
        Route::post('/units', [UnitController::class, 'store'])->name('units.store');
        Route::put('/units/{unit}', [UnitController::class, 'update'])->name('units.update');
        Route::delete('/units/{unit}', [UnitController::class, 'destroy'])->name('units.destroy');
    });
});

require __DIR__.'/auth.php';
