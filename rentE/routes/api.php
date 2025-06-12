<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\HouseController;

Route::group([

    'middleware' => 'api',
    'prefix' => 'auth'

], function () {

    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/userProfile', [AuthController::class, 'userProfile']);
    Route::put('/updateUser/{id}', [AuthController::class, 'editUser']);
    Route::get('/tenants', [AuthController::class, 'listTenants']);
    Route::get('/landLords', [AuthController::class, 'listLandLords']);
    Route::get('/users/{id}', [AuthController::class, 'showUser']);
    Route::delete('/deleteUser/{id}', [AuthController::class, 'deleteUser']);


    // House routes
    Route::get('/list-houses', [HouseController::class, 'index']);
    Route::post('/createHouse', [HouseController::class, 'store']);
    Route::get('/list-house/{house}', [HouseController::class, 'show']);
    Route::put('/updateHouse/{house}', [HouseController::class, 'update']);

    Route::delete('/deleteHouse/{house}', [HouseController::class, 'destroy']);


});
