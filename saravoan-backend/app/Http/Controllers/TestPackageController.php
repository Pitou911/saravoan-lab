<?php
// app/Http/Controllers/TestPackageController.php

namespace App\Http\Controllers;

use App\Models\TestPackage;
use App\Models\OtherTestOption;
use Illuminate\Http\Request;

class TestPackageController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(
            TestPackage::where('doctor_id', $request->user()->id)
                ->orderBy('name')
                ->get()
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'           => 'required|string|max:255',
            'description'    => 'nullable|string',
            'selected_tests' => 'required|array|min:1',
        ]);

        $package = TestPackage::create([
            ...$validated,
            'doctor_id' => $request->user()->id,
        ]);

        return response()->json([
            'message' => 'Package saved.',
            'data'    => $package,
        ], 201);
    }

    public function destroy(Request $request, $id)
    {
        $package = TestPackage::where('doctor_id', $request->user()->id)->findOrFail($id);
        $package->delete();
        return response()->json(['message' => 'Package deleted.']);
    }
}
