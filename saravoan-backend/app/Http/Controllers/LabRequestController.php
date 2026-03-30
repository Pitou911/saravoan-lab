<?php
// app/Http/Controllers/LabRequestController.php

namespace App\Http\Controllers;

use App\Models\LabRequest;
use Illuminate\Http\Request;

class LabRequestController extends Controller
{
    public function index(Request $request)
    {
        $requests = LabRequest::where('doctor_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($requests);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'patient_name'      => 'required|string|max:255',
            'patient_telephone' => 'nullable|string|max:50',
            'date_of_birth'     => 'nullable|date',
            'gender'            => 'nullable|in:male,female',
            'patient_id'        => 'nullable|string|max:100',
            'weight'            => 'nullable|numeric',
            'request_date'      => 'required|date',
            'request_time'      => 'nullable|date_format:H:i',
            'clinical_history'  => 'nullable|string',
            'doctor_name'       => 'required|string|max:255',
            'other_tests'       => 'nullable|string',
            'selected_tests'    => 'required|array|min:1',
        ]);

        $labRequest = LabRequest::create([
            ...$validated,
            'doctor_id' => $request->user()->id,
        ]);

        return response()->json([
            'message' => 'Lab request created successfully',
            'data'    => $labRequest,
        ], 201);
    }

    public function show(Request $request, $id)
    {
        $labRequest = LabRequest::where('doctor_id', $request->user()->id)
            ->findOrFail($id);

        return response()->json($labRequest);
    }

    public function destroy(Request $request, $id)
    {
        $labRequest = LabRequest::where('doctor_id', $request->user()->id)
            ->findOrFail($id);

        $labRequest->delete();

        return response()->json(['message' => 'Deleted successfully']);
    }
}
