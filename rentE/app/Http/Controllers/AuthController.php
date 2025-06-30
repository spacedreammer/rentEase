<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class AuthController extends Controller
{
    public function register(Request $request)
    {

        $formFields = $request->validate([
            'fname'     => 'required|string|max:255',
            'lname'     => 'required|string|max:255',
            'email'    => 'required|string|email|unique:users',
            'password' => 'required|string|min:6',
            'role'     => 'nullable|in:tenant,agent,landlord',
            'phone'    => 'nullable|string',
            'avatar'   => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'bio'      => 'nullable|string|max:1000',
        ]);

        $formFields['password'] = bcrypt($formFields['password']);
        $formFields['role'] = $request->input('role', 'tenant');
        $user = User::create($formFields);
        $token = Auth::login($user);

        return response()->json([
            'message' => 'Registered successfully',
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => Auth::factory()->getTTL() * 60,
        ]);
    }


    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if (!$token = Auth::attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }
        return response()->json([
            'message' => 'Logged in successfully',
            'user' => $user,
            'access_token' => $token,
            'role' => $user->role,
            'token_type' => 'bearer',
            'expires_in' => Auth::factory()->getTTL() * 60,
        ]);
    }

    public function userProfile()
    {
        return response()->json([
            'id' => Auth::id(),
            'fname' => Auth::user()->fname,
            'lname' => Auth::user()->lname,
            'email' => Auth::user()->email,
            'role' => Auth::user()->role,
        ]);
    }

    public function listTenants()
    {
        $tenants = User::where('role', 'tenant')->get();
        return response()->json($tenants);
    }

    public function listLandLords()
    {
        $tenants = User::where('role', 'landlord')->get();
        return response()->json($tenants);
    }


    public function logout()
    {
        Auth::logout();
        return response()->json(['message' => 'Logged out successfully']);
    }


    public function editUser(Request $request, $id)
    {


        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }
        // Validate the request data

        $formFields = $request->validate([
            'fname' => 'required',
            'lname' => 'required',
            'email' => 'required|email',
            'password' => ['nullable', 'min:6'],
            'role'     => 'required|in:tenant,agent,landlord',
            'phone'    => 'nullable|string',
            "avatar"   => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'bio'      => 'nullable|string|max:1000',
        ]);
        $user->fname = $formFields['fname'];
        $user->lname = $formFields['lname'];
        $user->email = $formFields['email'];
        $user->phone = $formFields['phone'] ?? $user->phone;
        $user->bio   = $formFields['bio'] ?? $user->bio;
        $user->role  = $formFields['role'];

        if (isset($formFields['password'])  && !empty($formFields['password'])) {
            // Hash the password before saving
            $user->password = bcrypt($formFields['password']);
        }

        $user->save();

        return response()->json([
            'message' => 'User updated successfully',
            'user' => $user->id,
            'fname' => $user->fname,
            'email' => $user->email
        ]);
    }

    public function showUser($id)
{
    $user = User::find($id); 
    if (!$user) {
        return response()->json(['message' => 'User not found'], 404);
    }
    return response()->json($user);
}


public function updateProfile(Request $request)
{

    $user = Auth::user(); // <--- Get the authenticated user
    if (!$user || !$user instanceof \App\Models\User) {
        return response()->json(['message' => 'Unauthenticated or invalid user instance.'], 401);
    }

    // Validate the request data
    $formFields = $request->validate([
        'fname' => 'required|string|max:255',
        'lname' => 'required|string|max:255',
        'email' => [
            'required',
            'string',
            'email',
            'max:255',
            Rule::unique('users')->ignore($user->id), // Ignore current user's email
        ],
        // 'password' => ['nullable', 'min:6'], // Users typically change password on a separate form
        'phone'    => 'nullable|string|max:20',
        // 'avatar'   => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048', // If user can update their own avatar
        'bio'      => 'nullable|string|max:1000',
    ]);

    // Update fields directly
    $user->fname = $formFields['fname'];
    $user->lname = $formFields['lname'];
    $user->email = $formFields['email'];

    // Handle nullable fields explicitly (or rely on TrimStrings middleware)
    $user->phone = !empty($formFields['phone']) ? $formFields['phone'] : null;
    $user->bio   = !empty($formFields['bio']) ? $formFields['bio'] : null;

    // If you want user to update their own password via this endpoint, include the logic here.
    // if (isset($formFields['password']) && !empty($formFields['password'])) {
    //     $user->password = Hash::make($formFields['password']);
    // }

    // If you want user to update their own avatar via this endpoint, include the logic here.
    // if ($request->hasFile('avatar')) {
    //     if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
    //         Storage::disk('public')->delete($user->avatar);
    //     }
    //     $avatarPath = $request->file('avatar')->store('avatars', 'public');
    //     $user->avatar = $avatarPath;
    // } elseif ($request->has('avatar') && ($request->input('avatar') === null || $request->input('avatar') === '')) {
    //      if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
    //         Storage::disk('public')->delete($user->avatar);
    //     }
    //     $user->avatar = null;
    // }

    $user->save();

    return response()->json([
        'message' => 'Profile updated successfully!',
        'user' => $user // Return the full updated user object
    ], 200);
}



    public function deleteUser($id)
    {

        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }
        $user->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }
}
