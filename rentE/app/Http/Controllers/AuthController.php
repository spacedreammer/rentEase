<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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
