<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\House;
use App\Models\TourRequest; // Assuming you have this model for tour requests
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; // Make sure to import Auth

class AdminController extends Controller
{
    // We will apply 'auth:api' middleware directly in the routes file now.
    // So, no __construct() middleware here, or if it's there, it will just be 'auth:api'.
    // If you had 'auth:api' in __construct(), it's fine to leave it, it won't conflict.

    public function getOverviewStats()
    {
        // This check is crucial for authorization
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized access. Admin role required.'], 403);
        }

        try {
            $totalUsers = User::count();
            $totalTenants = User::where('role', 'tenant')->count();
            $totalLandlords = User::where('role', 'landlord')->count();
            $totalAdmins = User::where('role', 'admin')->count();

            $totalProperties = House::count();
            $availableProperties = House::where('status', 'available')->count();
            $pendingProperties = House::where('status', 'pending')->count();

            // Optional: If you have a TourRequest model
            $totalTourRequests = TourRequest::count();
            $pendingTourRequests = TourRequest::where('status', 'pending')->count();

            return response()->json([
                'users' => [
                    'total' => $totalUsers,
                    'tenants' => $totalTenants,
                    'landlords' => $totalLandlords,
                    'admins' => $totalAdmins,
                ],
                'properties' => [
                    'total' => $totalProperties,
                    'available' => $availableProperties,
                    'pending_approval' => $pendingProperties,
                ],
                'tour_requests' => [
                    'total' => $totalTourRequests,
                    'pending' => $pendingTourRequests,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to fetch overview stats.', 'error' => $e->getMessage()], 500);
        }
    }
}
