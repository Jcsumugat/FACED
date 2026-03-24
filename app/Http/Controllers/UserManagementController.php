<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserManagementController extends Controller
{
    public function index()
    {
        $accounts = User::select([
                'id', 'name', 'email', 'role',
                'assigned_barangay', 'created_at'
            ])
            ->latest()
            ->get();

        return Inertia::render('UserManagement', [
            'accounts' => $accounts,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'               => 'required|string|max:255',
            'email'              => 'required|email|unique:users,email',
            'password'           => 'required|string|min:8|confirmed',
            'role'               => 'required|in:Barangay Staff,MSWDO / Admin',
            'assigned_barangay'  => 'nullable|required_if:role,Barangay Staff|string',
        ]);

        User::create([
            'name'              => $validated['name'],
            'email'             => $validated['email'],
            'password'          => Hash::make($validated['password']),
            'role'              => $validated['role'],
            'assigned_barangay' => $validated['role'] === 'Barangay Staff'
                                    ? $validated['assigned_barangay']
                                    : null,
        ]);

        return redirect()->route('users.index')
            ->with('success', "Account for {$validated['name']} created successfully.");
    }

    public function destroy(User $user)
    {
        if ($user->id === request()->user()->id) {
            return back()->with('error', 'You cannot delete your own account.');
        }

        $name = $user->name;
        $user->delete();

        return redirect()->route('users.index')
            ->with('success', "Account for {$name} has been deleted.");
    }
}