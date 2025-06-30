<?php

namespace App\Http\Controllers;

use App\Models\TourRequest;
use App\Models\House;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class TourRequestController extends Controller
{
    // ... (Your existing store method) ...

    /**
     * Display a listing of tour requests for the authenticated tenant.
     * This method is for the tenant dashboard.
     */
    public function indexTenantRequests()
    {
        $tenant = Auth::user();

        if (!$tenant || $tenant->role !== 'tenant') {
            return response()->json(['message' => 'Unauthorized. Only tenants can view their tour requests.'], 403);
        }

        $tourRequests = TourRequest::where('tenant_id', $tenant->id)
                                   ->with(['house' => function($query) {
                                       $query->select('id', 'title', 'location', 'price', 'images'); // Include images for tenant view
                                   }, 'landlord' => function($query) {
                                       $query->select('id', 'fname', 'lname', 'email', 'phone');
                                   }])
                                   ->orderBy('created_at', 'desc')
                                   ->get();

        return response()->json($tourRequests);
    }

    /**
     * Display a listing of tour requests for the authenticated landlord's properties.
     * This method is for the landlord dashboard.
     */
    public function indexLandlordRequests()
    {
        $landlord = Auth::user();

        if (!$landlord || $landlord->role !== 'landlord') {
            return response()->json(['message' => 'Unauthorized. Only landlords can view these requests.'], 403);
        }

        // Get IDs of all houses owned by this landlord
        $houseIds = $landlord->houses()->pluck('id');

        if ($houseIds->isEmpty()) {
            return response()->json([], 200); // No houses, so no requests
        }

        // Fetch tour requests where landlord_id matches authenticated landlord's ID
        // and house_id is one of the landlord's houses.
        // Eager load 'house' and 'tenant' relationships.
        $tourRequests = TourRequest::where('landlord_id', $landlord->id)
                                   ->whereIn('house_id', $houseIds) // Ensures it's for THEIR houses
                                   ->with(['house' => function($query) {
                                       $query->select('id', 'title', 'location', 'price', 'images'); // Include images
                                   }, 'tenant' => function($query) {
                                       $query->select('id', 'fname', 'lname', 'email', 'phone');
                                   }])
                                   ->orderBy('created_at', 'desc')
                                   ->get();

        return response()->json($tourRequests);
    }

    /**
     * Accept a specific tour request.
     */
    public function acceptTourRequest(TourRequest $tourRequest)
    {
        $landlord = Auth::user();

        if (!$landlord || $landlord->role !== 'landlord') {
            return response()->json(['message' => 'Unauthorized. Only landlords can accept requests.'], 403);
        }

        // Ensure the landlord owns the house associated with this tour request
        if ($tourRequest->landlord_id !== $landlord->id) {
            return response()->json(['message' => 'Unauthorized. You do not manage this request.'], 403);
        }

        // Ensure the request is still pending
        if ($tourRequest->status !== 'pending') {
            return response()->json(['message' => 'Tour request cannot be accepted. Current status: ' . $tourRequest->status], 400);
        }

        $tourRequest->status = 'accepted';
        $tourRequest->save();

        // Optional: Send notification to tenant (e.g., email, in-app notification)
        Log::info("Tour Request {$tourRequest->id} for House {$tourRequest->house_id} accepted by Landlord {$landlord->id}.");

        return response()->json(['message' => 'Tour request accepted successfully!', 'tour_request' => $tourRequest]);
    }

    /**
     * Reject a specific tour request.
     */
    public function rejectTourRequest(TourRequest $tourRequest)
    {
        $landlord = Auth::user();

        if (!$landlord || $landlord->role !== 'landlord') {
            return response()->json(['message' => 'Unauthorized. Only landlords can reject requests.'], 403);
        }

        // Ensure the landlord owns the house associated with this tour request
        if ($tourRequest->landlord_id !== $landlord->id) {
            return response()->json(['message' => 'Unauthorized. You do not manage this request.'], 403);
        }

        // Ensure the request is still pending (or even accepted, if you allow re-rejection)
        if ($tourRequest->status !== 'pending') {
            return response()->json(['message' => 'Tour request cannot be rejected. Current status: ' . $tourRequest->status], 400);
        }

        $tourRequest->status = 'rejected';
        $tourRequest->save();

        // Optional: Send notification to tenant
        Log::info("Tour Request {$tourRequest->id} for House {$tourRequest->house_id} rejected by Landlord {$landlord->id}.");

        return response()->json(['message' => 'Tour request rejected successfully!', 'tour_request' => $tourRequest]);
    }

    // You might also add methods here for:
    // - show (view details of a single tour request)
    // - cancelTourRequest (for tenant to cancel their own request)
}