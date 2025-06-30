<?php

use App\Http\Controllers\AdminController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\HouseController; // Assuming you have this for house routes
use App\Http\Controllers\MessageController;
use App\Http\Controllers\TourRequestController;

Route::group([
    'prefix' => 'auth'
], function ($router) { // Use $router variable if you group things inside

    // Public routes (no authentication needed)
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/list-houses', [HouseController::class, 'index']);
    Route::get('/list-house/{house}', [HouseController::class, 'show']);

    // Protected routes (require a valid token)
    Route::group([
        'middleware' => 'auth:api',
    ], function () {

        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/userProfile', [AuthController::class, 'userProfile']);
        Route::put('/updateUser/{id}', [AuthController::class, 'editUser']);
        Route::get('/tenants', [AuthController::class, 'listTenants']);
        Route::get('/landLords', [AuthController::class, 'listLandLords']);
        Route::get('/users/{id}', [AuthController::class, 'showUser']); // Note: Auth::id() inside showUser might be better for current user
        Route::put('/updateProfile', [AuthController::class, 'updateProfile']);
        Route::delete('/deleteUser/{id}', [AuthController::class, 'deleteUser']);

        Route::get('/landlord/tour-requests', [TourRequestController::class, 'indexLandlordRequests']); // Landlord views requests for their properties
        Route::post('/tour-requests/{tourRequest}/accept', [TourRequestController::class, 'acceptTourRequest']); // Landlord accepts request
        Route::post('/tour-requests/{tourRequest}/reject', [TourRequestController::class, 'rejectTourRequest']); // Landlord rejects request
        // House routes that require authentication
        // If house listing requires auth

        Route::post('/createHouse', [HouseController::class, 'store']);
        Route::post('/tour-requests', [TourRequestController::class, 'store']);
        Route::get('/tenant/tour-requests', [TourRequestController::class, 'indexTenantRequests']);
        Route::get('/myHouses', [HouseController::class, 'getMyHouses']);
        Route::put('/updateHouse/{house}', [HouseController::class, 'update']);
        Route::delete('/deleteHouse/{house}', [HouseController::class, 'destroy']);


        // --- NEW MESSAGE ROUTES ---
        Route::get('/messages', [MessageController::class, 'index']); // List conversations
        Route::get('/messages/conversation/{otherUser}', [MessageController::class, 'showConversation']); // Get messages with a specific user
        Route::post('/messages', [MessageController::class, 'store']); // Send a new message
        Route::patch('/messages/{message}/read', [MessageController::class, 'markAsRead']);
        
        Route::prefix('admin')->group(function () {
            Route::get('/overview-stats', [AdminController::class, 'getOverviewStats']);
            // Add other admin routes here later (e.g., /admin/users, /admin/properties)
        });
    });
});
