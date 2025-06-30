<?php

namespace App\Http\Controllers;

use App\Models\House;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class HouseController extends Controller
{
    public function index(Request $request) 
    {
        $query = House::query(); // Start building the query

        // Filter by location
        if ($request->has('location')) {
            $location = $request->input('location');
            $query->where('location', 'like', '%' . $location . '%');
        }

        // Filter by move-in date
        // Assuming your 'House' model has a 'available_from' (or similar) date column
        // Adjust 'available_from' to your actual column name if different
        if ($request->has('move_in_date')) {
            $moveInDate = $request->input('move_in_date');
            // This will filter houses that are available ON or BEFORE the specified date.
            // Adjust logic if you need houses available EXACTLY on that date, or AFTER that date.
            $query->where('available_from', '<=', $moveInDate);
        }

        // Filter by price range
        if ($request->has('min_price')) {
            $minPrice = $request->input('min_price');
            $query->where('price', '>=', $minPrice);
        }
        if ($request->has('max_price')) {
            $maxPrice = $request->input('max_price');
            $query->where('price', '<=', $maxPrice);
        }

        // Filter by property type
        // Assuming your 'House' model has a 'property_type' column
        // The values here should match the values you send from the frontend (e.g., 'House', 'Apartment', 'Studio')
        if ($request->has('property_type')) {
            $propertyType = $request->input('property_type');
            $query->where('property_type', $propertyType);
        }

        // Execute the query and get the results
        $houses = $query->get();

        // If you have relationships (like images), you might want to eager load them
        // For example, if a House hasMany Images:
        // $houses = $query->with('images')->get();

        return response()->json($houses, 200);
    }



    public function show(House $house) // Using Route Model Binding
    {

        $house->load('user'); // Eager load the user (landlord) relationship

        // Optional: Hide sensitive user data if not already done by User model's $hidden array
        if ($house->user) {
            $house->user->makeHidden(['password', 'email_verified_at', 'created_at', 'updated_at']);
        }
    
        return response()->json($house);
        // try {
        //     $user = Auth::user();
        //     if (!$user) {
        //         return response()->json(['message' => 'Unauthenticated.'], 401);
        //     }
        //     // 1. Check if the house exists
        //     if (!$house) {
        //         return response()->json(['message' => 'House not found.'], 404);
        //     }
        //     // 2. Check if the user is authorized to view this house
        //     if ($house->user_id !== $user->id) {
        //         return response()->json(['message' => 'Unauthorized. You do not own this house.'], 403);
        //     }


        //     return response()->json($house, 200); // Return the found house model
        // } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {

        //     return response()->json([
        //         'message' => 'House not found.',
        //     ], 404);
        // }
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
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048', // Each element in the array must be a URL
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


    public function getMyHouses(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        // Ensure the user is a landlord
        if ($user->role !== 'landlord') {
            return response()->json(['message' => 'Unauthorized. You are not a landlord.'], 403);
        }

        
        $myHouses = House::where('user_id', $user->id)->get();

        return response()->json($myHouses, 200);
    }

    

    // app/Http/Controllers/HouseController.php

public function update(Request $request, House $house)
{
    $userId = Auth::id();
    $user = Auth::user();

    if ($house->user_id != $userId) {
        return response()->json(['message' => 'You are not authorized to update this house'], 403); // Added 403 status
    } elseif ($user->role !== 'landlord') {
        return response()->json(['message' => 'Unauthorized. You are not a landlord.'], 403);
    }

    $validatedData = $request->validate([
        'title' => 'required|string|max:255',
        'location' => 'required|string|max:255',
        'price' => 'required|numeric',
        'description' => 'nullable|string',

        // 'images' is optional on update, as existing images might be kept or new ones uploaded
        // 'images' => 'array', // Removed required
        'images.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',

        'existing_images' => 'nullable|array', // New: for images that should be kept
        'existing_images.*' => 'nullable|string', // Should be the URL paths

        'status' => 'nullable|in:available,rented,maintenance',
        'bedrooms' => 'nullable|integer|min:1',
        'bathrooms' => 'nullable|integer|min:1',
        'size' => 'nullable|integer|min:0',
    ]);

    // Handle image uploads and existing images
    $finalImagePaths = [];

    // 1. Process new images
    if ($request->hasFile('images')) {
        foreach ($request->file('images') as $image) {
            $path = $image->store('house_images', 'public');
            $finalImagePaths[] = Storage::url($path);
        }
    }

    // 2. Add existing images that were NOT removed by the frontend
    // The frontend sends `existing_images` array containing the URLs of images to keep.
    if ($request->has('existing_images')) {
        foreach ($request->input('existing_images') as $existingImageUrl) {
            // Basic validation to ensure it's a valid URL or path
            if (is_string($existingImageUrl) && (str_starts_with($existingImageUrl, '/storage/') || filter_var($existingImageUrl, FILTER_VALIDATE_URL))) {
                $finalImagePaths[] = $existingImageUrl;
            }
        }
    }
    
    // IMPORTANT: Compare previous images with final list and delete removed ones from storage
    $oldImages = $house->images ?? []; // Get current images stored in DB
    $imagesToDelete = array_diff($oldImages, $finalImagePaths); // Find images that are in old list but not in final list

    foreach ($imagesToDelete as $imagePath) {
        // Extract filename from the URL to delete from storage
        $filename = basename(parse_url($imagePath, PHP_URL_PATH));
        if (Storage::disk('public')->exists('house_images/' . $filename)) {
            Storage::disk('public')->delete('house_images/' . $filename);
        }
    }

    $validatedData['images'] = $finalImagePaths; // Update the 'images' field with the new array

    // Remove `images` and `existing_images` from validated data to avoid mass assignment issues
    // if not explicitly defined in $fillable in House model, though it is in fillable so no need to remove.
    unset($validatedData['images']); // Ensure this doesn't overwrite the line above.
    unset($validatedData['existing_images']); // Ensure this doesn't overwrite the line above.

    // Update house attributes from validatedData
    $house->fill($request->except(['images', 'existing_images', '_method'])); // Fill all except images and method
    $house->images = $finalImagePaths; // Manually assign the image array
    $house->save(); // Save the model

    return response()->json([
        'message' => 'House updated successfully',
        'house' => $house
    ]);
}


    // public function update(Request $request, House $house)
    // {
    //     $userId = Auth::id();
    //     $user = Auth::user();

    //     if ($house->user_id != $userId) {
    //         return response()->json("You are not authorized to update this house");
    //     } elseif ($user->role !== 'landlord') {
    //         return response()->json(['message' => 'Unauthorized. You are not a landlord.'], 403);
    //     }

    //     $validatedData = $request->validate([
    //         'title' => 'required|string|max:255',
    //         'location' => 'required|string|max:255',
    //         'price' => 'required|numeric',
    //         'description' => 'nullable|string',

    //         'images' => 'required|array', // Expect an array
    //         'images.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048', // Each element in the array must be a URL
    //         'status' => 'nullable|in:available,rented,maintenance', // Add validation for other columns
    //         'bedrooms' => 'nullable|integer|min:1',
    //         'bathrooms' => 'nullable|integer|min:1',
    //         'size' => 'nullable|integer|min:0',
    //     ]);


    //     // Handle image uploads for update
    //     $currentImagePaths = $house->images ?? []; // Get existing images (from JSON cast)
    //     $newImagePaths = [];
    //     if ($request->hasFile('images')) {
          

    //         foreach ($request->file('images') as $image) {
    //             $path = $image->store('house_images', 'public');
    //             $newImagePaths[] = Storage::url($path);
    //         }
           
    //         $validatedData['images'] = $newImagePaths;
    //     } else {
    //         // If no new images are uploaded, and clear_existing_images is true, clear them
    //         if ($request->boolean('clear_existing_images')) {
    //             foreach ($currentImagePaths as $oldPath) {
    //                 $filename = basename(parse_url($oldPath, PHP_URL_PATH));
    //                 Storage::disk('public')->delete('house_images/' . $filename);
    //             }
    //             $validatedData['images'] = []; // Set to empty array
    //         } else {
    //              // If no new images and not clearing, keep existing images
    //              $validatedData['images'] = $currentImagePaths;
    //         }
    //     }
        
    //     $house->update($validatedData);

    //     return response()->json([
    //         'message' => 'House updated Successfull',
    //         'house' => $house
    //     ]);
    // }


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
