<?php

namespace App\Http\Controllers;

use App\Models\FacedRecord;
use App\Models\FamilyMember;
use App\Models\FamilyMemberVulnerability;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class FamilyMemberController extends Controller
{
    public function store(Request $request, FacedRecord $record)
    {
        $validated = $request->validate([
            'name'                   => 'required|string|max:200',
            'relationship'           => 'required|string',
            'birthdate'              => 'required|date',
            'age'                    => 'nullable|integer',
            'sex'                    => 'required|in:Male,Female',
            'birthplace'             => 'nullable|string|max:150',
            'occupation'             => 'nullable|string|max:100',
            'educational_attainment' => 'nullable|string|max:100',
            'vulnerabilities'        => 'nullable|array',
            'vulnerabilities.*'      => 'string|in:PWD,Senior Citizen,Pregnant/Lactating,Solo Parent,Others',
        ]);

        $member = FamilyMember::create([
            'id'              => Str::uuid(),
            'faced_record_id' => $record->id,
            'name'            => $validated['name'],
            'relationship'    => $validated['relationship'],
            'birthdate'       => $validated['birthdate'],
            'age'             => $validated['age'] ?? null,
            'sex'             => $validated['sex'],
            'birthplace'      => $validated['birthplace'] ?? null,
            'occupation'      => $validated['occupation'] ?? null,
            'educational_attainment' => $validated['educational_attainment'] ?? null,
        ]);

        foreach ($validated['vulnerabilities'] ?? [] as $vuln) {
            FamilyMemberVulnerability::create([
                'family_member_id'   => $member->id,
                'vulnerability_type' => $vuln,
            ]);
        }

        return back()->with('success', "{$member->name} added to the household.");
    }

    public function update(Request $request, FacedRecord $record, FamilyMember $member)
    {
        $validated = $request->validate([
            'name'                   => 'required|string|max:200',
            'relationship'           => 'required|string',
            'birthdate'              => 'required|date',
            'age'                    => 'nullable|integer',
            'sex'                    => 'required|in:Male,Female',
            'birthplace'             => 'nullable|string|max:150',
            'occupation'             => 'nullable|string|max:100',
            'educational_attainment' => 'nullable|string|max:100',
            'vulnerabilities'        => 'nullable|array',
            'vulnerabilities.*'      => 'string|in:PWD,Senior Citizen,Pregnant/Lactating,Solo Parent,Others',
        ]);

        $member->update([
            'name'                   => $validated['name'],
            'relationship'           => $validated['relationship'],
            'birthdate'              => $validated['birthdate'],
            'age'                    => $validated['age'] ?? null,
            'sex'                    => $validated['sex'],
            'birthplace'             => $validated['birthplace'] ?? null,
            'occupation'             => $validated['occupation'] ?? null,
            'educational_attainment' => $validated['educational_attainment'] ?? null,
        ]);

        // Re-sync vulnerabilities
        $member->vulnerabilities()->delete();
        foreach ($validated['vulnerabilities'] ?? [] as $vuln) {
            FamilyMemberVulnerability::create([
                'family_member_id'   => $member->id,
                'vulnerability_type' => $vuln,
            ]);
        }

        return back()->with('success', "{$member->name} updated successfully.");
    }

    public function destroy(FacedRecord $record, FamilyMember $member)
    {
        $name = $member->name;
        $member->delete();

        return back()->with('success', "{$name} removed from the household.");
    }
}