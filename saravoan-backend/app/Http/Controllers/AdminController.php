<?php
// app/Http/Controllers/AdminController.php

namespace App\Http\Controllers;

use App\Models\OtherTestOption;
use App\Models\PrintLog;
use App\Models\User;
use App\Models\LabRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    // ── Middleware check: admin only ───────────────────────────────
    private function requireAdmin(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            abort(403, 'Admin access required.');
        }
    }

    // ── Other Test Options ─────────────────────────────────────────
    public function getOtherTests()
    {
        return response()->json(
            OtherTestOption::orderBy('category')->orderBy('name')->get()
        );
    }

    // Doctors only see active ones
    public function getActiveOtherTests()
    {
        return response()->json(
            OtherTestOption::where('is_active', true)
                ->orderBy('category')
                ->orderBy('name')
                ->get()
        );
    }

    public function storeOtherTest(Request $request)
{
    $this->requireAdmin($request);

    $validated = $request->validate([
        'name'                 => 'required|string|max:255|unique:other_test_options,name',
        'category'             => 'nullable|string|max:100',
        'sample_type'          => 'nullable|string|max:100',
        'collection_container' => 'nullable|string|max:100',
        'price'                => 'nullable|numeric|min:0',
    ]);

    $option = OtherTestOption::create([...$validated, 'is_active' => true]);

    return response()->json([
        'message' => 'Test option created.',
        'data'    => $option,
    ], 201);
}

    public function updateOtherTest(Request $request, $id)
{
    $this->requireAdmin($request);

    $option = OtherTestOption::findOrFail($id);

    $validated = $request->validate([
        'name'                 => 'sometimes|string|max:255|unique:other_test_options,name,' . $id,
        'category'             => 'nullable|string|max:100',
        'sample_type'          => 'nullable|string|max:100',
        'collection_container' => 'nullable|string|max:100',
        'price'                => 'nullable|numeric|min:0',
        'is_active'            => 'sometimes|boolean',
    ]);

    $option->update($validated);

    return response()->json(['message' => 'Updated.', 'data' => $option]);
}

    public function destroyOtherTest(Request $request, $id)
    {
        $this->requireAdmin($request);
        OtherTestOption::findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted.']);
    }

    // ── Dashboard stats ────────────────────────────────────────────
    public function stats(Request $request)
    {
        $this->requireAdmin($request);

        return response()->json([
            'total_doctors'  => User::where('role', 'doctor')->count(),
            'total_requests' => LabRequest::count(),
            'today_requests' => LabRequest::whereDate('created_at', today())->count(),
            'other_tests'    => OtherTestOption::count(),
        ]);
    }

    // ── All lab requests (admin view) ──────────────────────────────
    public function allRequests(Request $request)
    {
        $this->requireAdmin($request);

        return response()->json(
            LabRequest::with('doctor:id,name,email')
                ->orderBy('created_at', 'desc')
                ->limit(100)
                ->get()
        );
    }

    // ── Doctors list ───────────────────────────────────────────────
    public function doctors(Request $request)
    {
        $this->requireAdmin($request);

        return response()->json(
            User::where('role', 'doctor')
                ->withCount('labRequests')
                ->orderBy('name')
                ->get(['id', 'name', 'email', 'created_at'])
        );
    }

    // ── Activity log ───────────────────────────────────────────────
    public function activityLogs(Request $request)
    {
        $this->requireAdmin($request);

        return response()->json(
            PrintLog::with('doctor:id,name,email')
                ->orderBy('created_at', 'desc')
                ->limit(300)
                ->get()
        );
    }

    // ── Create admin account (only existing admin can do this) ─────
    public function createAdmin(Request $request)
    {
        $this->requireAdmin($request);

        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users',
            'password' => 'required|min:8',
        ]);

        $admin = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role'     => 'admin',
        ]);

        return response()->json(['message' => 'Admin created.', 'data' => $admin], 201);
    }
}
