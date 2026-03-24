<?php

namespace App\Http\Controllers;

use App\Models\FacedRecord;
use App\Models\SitrepConfig;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class SitRepController extends Controller
{
    public function index()
    {
        $validated = FacedRecord::with([
            'familyMembers.vulnerabilities',
            'assistanceRecords'
        ])->where('status', 'Validated')->get();

        $stats = [
            'barangays' => $validated->pluck('barangay')->unique()->count(),
            'families'  => $validated->count(),
            'persons'   => $validated->sum(fn ($r) => $r->familyMembers->count() + 1),
            'totally_damaged'  => $validated->where('shelter_damage', 'Totally Damaged')->count(),
            'partially_damaged' => $validated->where('shelter_damage', 'Partially Damaged')->count(),
            'pwd'       => $validated->sum(fn ($r) =>
                $r->familyMembers->sum(fn ($m) =>
                    $m->vulnerabilities->where('vulnerability_type', 'PWD')->count()
                )
            ),
            'senior'    => $validated->sum(fn ($r) =>
                $r->familyMembers->sum(fn ($m) =>
                    $m->vulnerabilities->where('vulnerability_type', 'Senior Citizen')->count()
                )
            ),
            'pregnant'  => $validated->sum(fn ($r) =>
                $r->familyMembers->sum(fn ($m) =>
                    $m->vulnerabilities->where('vulnerability_type', 'Pregnant/Lactating')->count()
                )
            ),
        ];

        $saved = SitrepConfig::latest()->first();

        return Inertia::render('SitRep', [
            'stats'  => $stats,
            'saved'  => $saved,
        ]);
    }

    public function generateSummary(Request $request)
    {
        $request->validate([
            'disaster_type' => 'required|string',
            'disaster_name' => 'required|string',
            'disaster_date' => 'required|string',
            'families'      => 'required|integer',
            'persons'       => 'required|integer',
            'barangays'     => 'required|integer',
            'totally_damaged'   => 'required|integer',
            'partially_damaged' => 'required|integer',
        ]);

        $prompt = "Write a short professional incident summary for a DROMIC SitRep for Barbaza, Antique. "
            . "Context: {$request->disaster_type} {$request->disaster_name} occurred on {$request->disaster_date}. "
            . "Impacted: {$request->families} families ({$request->persons} persons) across {$request->barangays} barangays. "
            . "Damage: {$request->totally_damaged} houses totally damaged, {$request->partially_damaged} partially. "
            . "Make it official sounding for a government report. Keep it under 100 words.";

        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'x-goog-api-key' => config('services.gemini.key'),
        ])->post('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent', [
            'contents' => [['parts' => [['text' => $prompt]]]],
        ]);

        $summary = $response->json('candidates.0.content.parts.0.text', 'Unable to generate summary.');

        return response()->json(['summary' => $summary]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'sitrep_number' => 'required|string',
            'date'          => 'required|date',
            'period_from'   => 'required|date',
            'period_to'     => 'required|date',
            'disaster_type' => 'required|string',
            'disaster_name' => 'required|string',
            'disaster_date' => 'required|date',
            'prepared_by'   => 'nullable|string',
            'position'      => 'nullable|string',
            'office'        => 'nullable|string',
            'summary'       => 'nullable|string',
        ]);

        SitrepConfig::create([
            ...$validated,
            'created_by' => $request->user()->id,
        ]);

        return back()->with('success', 'SitRep saved successfully.');
    }
}