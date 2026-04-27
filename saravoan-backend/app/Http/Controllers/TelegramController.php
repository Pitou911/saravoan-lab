<?php
// app/Http/Controllers/TelegramController.php

namespace App\Http\Controllers;

use App\Models\PrintLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class TelegramController extends Controller
{
    private string $botToken;
    private string $chatId;

    public function __construct()
    {
        $this->botToken = config('services.telegram.bot_token');
        $this->chatId   = config('services.telegram.chat_id');
    }

    public function sendPrintNotification(Request $request)
    {
        $validated = $request->validate([
            'patient_name'      => 'required|string',
            'patient_telephone' => 'nullable|string',
            'date_of_birth'     => 'nullable|string',
            'gender'            => 'nullable|string',
            'patient_id'        => 'nullable|string',
            'weight'            => 'nullable|string',
            'request_date'      => 'nullable|string',
            'request_time'      => 'nullable|string',
            'clinical_history'  => 'nullable|string',
            'doctor_name'       => 'required|string',
            'other_tests'       => 'nullable|string',
            'selected_tests'    => 'required|array',
            'doctor_email'      => 'nullable|string',
        ]);

        // Log the action regardless of Telegram success
        PrintLog::create([
            'doctor_id'   => $request->user()->id,
            'tests'       => $validated['selected_tests'],
            'patient_name'=> $validated['patient_name'],
            'action_type' => 'lab_request',
        ]);

        $message = $this->buildMessage($validated);

        $response = Http::withoutVerifying()->post("https://api.telegram.org/bot{$this->botToken}/sendMessage", [
            'chat_id'    => $this->chatId,
            'text'       => $message,
            'parse_mode' => 'HTML',
        ]);

        if ($response->failed()) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to send Telegram notification.',
                'details' => $response->json(),
            ], 500);
        }

        return response()->json([
            'success' => true,
            'message' => 'Telegram notification sent.',
        ]);
    }

    public function logInvoicePrint(Request $request)
    {
        $validated = $request->validate([
            'patient_name'   => 'required|string',
            'selected_tests' => 'required|array',
        ]);

        PrintLog::create([
            'doctor_id'    => $request->user()->id,
            'tests'        => $validated['selected_tests'],
            'patient_name' => $validated['patient_name'],
            'action_type'  => 'invoice',
        ]);

        return response()->json(['success' => true]);
    }

    private function buildMessage(array $data): string
    {
        $now    = now()->format('d/m/Y H:i:s');
        $gender = match($data['gender'] ?? '') {
            'male'   => 'Male',
            'female' => 'Female',
            default  => '—',
        };

        // Group selected tests by category
        // Each item is now an object: { id, name, category, sample_type, collection_container }
        $grouped = [];
        foreach ($data['selected_tests'] as $test) {
            if (is_array($test)) {
                $catLabel = $test['category'] ?? 'Other';
                $testName = $test['name']     ?? '—';
            } else {
                // Legacy string format: "CATKEY::TestName"
                $parts    = explode('::', $test, 2);
                $catKey   = $parts[0] ?? 'Other';
                $testName = $parts[1] ?? $test;
                $catLabel = ucwords(strtolower(str_replace('_', ' ', $catKey)));
            }
            $grouped[$catLabel][] = $testName;
        }

        $testsText = '';
        foreach ($grouped as $category => $tests) {
            $testsText .= "\n<b>📂 {$category}</b>\n";
            foreach ($tests as $test) {
                $testsText .= "  • {$test}\n";
            }
        }

        $totalTests = count($data['selected_tests']);

        $lines = [
            "🧪 <b>LAB REQUEST PRINTED</b>",
            "🏥 <i>Saravoan Medical Laboratory</i>",
            "🕐 <b>Printed at:</b> {$now}",
            "",
            "━━━━━━━━━━━━━━━━━━━━",
            "👤 <b>PATIENT INFORMATION</b>",
            "━━━━━━━━━━━━━━━━━━━━",
            "📛 <b>Name:</b> {$data['patient_name']}",
            "🆔 <b>ID:</b> " . ($data['patient_id'] ?? '—'),
            "📞 <b>Phone:</b> " . ($data['patient_telephone'] ?? '—'),
            "🎂 <b>DOB:</b> " . ($data['date_of_birth'] ?? '—'),
            "⚧️ <b>Gender:</b> {$gender}",
            "⚖️ <b>Weight:</b> " . ($data['weight'] ? $data['weight'] . ' kg' : '—'),
            "📅 <b>Date:</b> " . ($data['request_date'] ?? '—'),
            "⏰ <b>Time:</b> " . ($data['request_time'] ?? '—'),
            "",
            "━━━━━━━━━━━━━━━━━━━━",
            "👨‍⚕️ <b>DOCTOR INFORMATION</b>",
            "━━━━━━━━━━━━━━━━━━━━",
            "🩺 <b>Doctor:</b> {$data['doctor_name']}",
            "📧 <b>Email:</b> " . ($data['doctor_email'] ?? '—'),
            "",
            "━━━━━━━━━━━━━━━━━━━━",
            "🔬 <b>SELECTED TESTS ({$totalTests})</b>",
            "━━━━━━━━━━━━━━━━━━━━",
            $testsText,
        ];

        if (!empty($data['clinical_history'])) {
            $lines[] = "━━━━━━━━━━━━━━━━━━━━";
            $lines[] = "📋 <b>Clinical History:</b> {$data['clinical_history']}";
        }

        if (!empty($data['other_tests'])) {
            $lines[] = "🔍 <b>Other Tests:</b> {$data['other_tests']}";
        }

        $lines[] = "";
        $lines[] = "━━━━━━━━━━━━━━━━━━━━";
        $lines[] = "✅ <i>Notification sent automatically on print</i>";

        return implode("\n", $lines);
    }
}
