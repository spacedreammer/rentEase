<?php

namespace App\Http\Controllers;

use App\Models\House;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class HouseController extends Controller
{
    public function index()
    {

        $houses = House::all();
        return response()->json($houses, 200); // Return all houses
    }
    public function show(House $house) // Using Route Model Binding
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json(['message' => 'Unauthenticated.'], 401);
            }
            // 1. Check if the house exists
            if (!$house) {
                return response()->json(['message' => 'House not found.'], 404);
            }
            // 2. Check if the user is authorized to view this house
            if ($house->user_id !== $user->id) {
                return response()->json(['message' => 'Unauthorized. You do not own this house.'], 403);
            }


            return response()->json($house, 200); // Return the found house model
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {

            return response()->json([
                'message' => 'House not found.',
            ], 404);
        }
    }
    public function store(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        } elseif ($user->role !== 'landlord') {
            return response()->json(['message' => 'Unauthorized. You are not a landlord.'], 403);
        }

        $house = $request->validate([
            'title' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'price' => 'required|numeric',
            'description' => 'nullable|string',

            'images' => 'required|array', // Expect an array
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048', // Each element in the array must be a URL
            'status' => 'nullable|in:available,rented,maintenance', // Add validation for other columns
            'bedrooms' => 'nullable|integer|min:1',
            'bathrooms' => 'nullable|integer|min:1',
            'size' => 'nullable|integer|min:0',
        ]);

        $imagePaths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('house_images', 'public'); // Store in storage/app/public/house_images
                $imagePaths[] = Storage::url($path); // Get the public URL
            }
        }
        $house['images'] = $imagePaths;
        $house['user_id'] = $user->id;
        $houses = House::create($house);

        return response()->json([
            'message' => 'House created successfully',
            'house' => $houses,
            "user" => $user
        ], 201);
    }
    public function update(Request $request, House $house)
    {
        $userId = Auth::id();
        $user = Auth::user();

        if ($house->user_id != $userId) {
            return response()->json("You are not authorized to update this house");
        } elseif ($user->role !== 'landlord') {
            return response()->json(['message' => 'Unauthorized. You are not a landlord.'], 403);
        }

        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'price' => 'required|numeric',
            'description' => 'nullable|string',

            'images' => 'required|array', // Expect an array
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048', // Each element in the array must be a URL
            'status' => 'nullable|in:available,rented,maintenance', // Add validation for other columns
            'bedrooms' => 'nullable|integer|min:1',
            'bathrooms' => 'nullable|integer|min:1',
            'size' => 'nullable|integer|min:0',
        ]);


        // Handle image uploads for update
        $currentImagePaths = $house->images ?? []; // Get existing images (from JSON cast)
        $newImagePaths = [];
        if ($request->hasFile('images')) {
          

            foreach ($request->file('images') as $image) {
                $path = $image->store('house_images', 'public');
                $newImagePaths[] = Storage::url($path);
            }
           
            $validatedData['images'] = $newImagePaths;
        } else {
            // If no new images are uploaded, and clear_existing_images is true, clear them
            if ($request->boolean('clear_existing_images')) {
                foreach ($currentImagePaths as $oldPath) {
                    $filename = basename(parse_url($oldPath, PHP_URL_PATH));
                    Storage::disk('public')->delete('house_images/' . $filename);
                }
                $validatedData['images'] = []; // Set to empty array
            } else {
                 // If no new images and not clearing, keep existing images
                 $validatedData['images'] = $currentImagePaths;
            }
        }
        
        $house->update($validatedData);

        return response()->json([
            'message' => 'House updated Successfull',
            'house' => $house
        ]);
    }
    public function destroy(House $house)
    {
        try {
            $user = Auth::user();

            // 1. Authentication Check (defensive coding)
            if (!$user) {
                return response()->json(['message' => 'Unauthenticated.'], 401);
            } elseif ($user->role !== 'landlord') {
                return response()->json(['message' => 'Unauthorized. You are not a landlord.'], 403);
            }


            if ($user->id !== $house->user_id) {
                return response()->json(['message' => 'Unauthorized. You do not own this house.'], 403);
            }

            // 3. Delete the House
            $house->delete(); // This deletes the model from the database

            return response()->json(['message' => 'House deleted successfully'], 200);
        } catch (\Exception $e) {
            // Catch any unexpected errors during deletion
            return response()->json([
                'message' => 'An error occurred while deleting the house.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
