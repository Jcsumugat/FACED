<?php

namespace App\Http\Controllers;

use App\Models\FacedRecord;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $user  = $request->user();
        $query = FacedRecord::with(['familyMembers', 'assistanceRecords']);

        if ($user->isBarangayStaff()) {
            $query->where('barangay', $user->assigned_barangay);
        }

        if ($request->filled('barangay')) {
            $query->where('barangay', $request->barangay);
        }

        if ($request->filled('month')) {
            $query->whereMonth('date_registered', $request->month);
        }

        if ($request->filled('min_vai')) {
            $query->where('vai_score', '>=', $request->min_vai);
        }

        $records = $query->get();

        $barangay_stats = $records->groupBy('barangay')->map(fn ($group, $barangay) => [
            'name'             => $barangay,
            'families'         => $group->count(),
            'persons'          => $group->sum(fn ($r) => $r->familyMembers->count() + 1),
            'totally_damaged'  => $group->where('shelter_damage', 'Totally Damaged')->count(),
            'assistance_value' => $group->sum(fn ($r) => $r->assistanceRecords->sum('cost')),
            'validated_count'  => $group->where('status', 'Validated')->count(),
        ])->values();

        $summary = [
            'total_families' => $records->count(),
            'total_persons'  => $records->sum(fn ($r) => $r->familyMembers->count() + 1),
            'total_aid'      => $records->sum(fn ($r) => $r->assistanceRecords->sum('cost')),
            'active_barangays' => $records->pluck('barangay')->unique()->count(),
        ];

        return Inertia::render('Reports', [
            'records'        => $records->map(fn ($r) => [
                'id'             => $r->id,
                'serial_number'  => $r->serial_number,
                'last_name'      => $r->last_name,
                'first_name'     => $r->first_name,
                'barangay'       => $r->barangay,
                'vai_score'      => $r->vai_score,
                'shelter_damage' => $r->shelter_damage,
                'total_aid'      => $r->assistanceRecords->sum('cost'),
                'date_registered' => $r->date_registered,
            ]),
            'barangay_stats' => $barangay_stats,
            'summary'        => $summary,
            'filters'        => $request->only(['barangay', 'month', 'min_vai']),
        ]);
    }
}