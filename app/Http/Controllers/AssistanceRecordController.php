<?php

namespace App\Http\Controllers;

use App\Models\AssistanceRecord;
use App\Models\FacedRecord;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AssistanceRecordController extends Controller
{
    public function store(Request $request, FacedRecord $record)
    {
        $validated = $request->validate([
            'recipient_member_id' => 'nullable|string',
            'recipient_name'      => 'required|string|max:200',
            'date'                => 'required|date',
            'emergency_type'      => 'required|string|max:150',
            'assistance_provided' => 'required|string|max:200',
            'unit'                => 'required|string|max:50',
            'quantity'            => 'required|numeric|min:0',
            'cost'                => 'required|numeric|min:0',
            'provider'            => 'nullable|string|max:150',
        ]);

        AssistanceRecord::create([
            'id'             => Str::uuid(),
            'faced_record_id' => $record->id,
            'status'         => 'Pending Approval',
            ...$validated,
        ]);

        return redirect()->route('records.show', $record->id)
            ->with('success', 'Assistance record added successfully.');
    }

    public function approve(Request $request, FacedRecord $record, AssistanceRecord $assistance)
    {
        if (!$request->user()->isAdmin()) {
            abort(403);
        }

        $assistance->update(['status' => 'Approved']);

        return back()->with('success', 'Assistance record approved.');
    }

    public function lock(Request $request, FacedRecord $record, AssistanceRecord $assistance)
    {
        if (!$request->user()->isAdmin()) {
            abort(403);
        }

        $assistance->update(['status' => 'Locked']);

        return back()->with('success', 'Assistance record locked.');
    }
}