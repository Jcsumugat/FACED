<?php

namespace App\Http\Controllers;

use App\Models\FacedRecord;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $query = FacedRecord::with([
            'familyMembers.vulnerabilities',
            'assistanceRecords'
        ]);

        // Barangay Staff only sees their barangay
        if ($user->isBarangayStaff()) {
            $query->where('barangay', $user->assigned_barangay);
        }

        $records = $query->get();

        $stats = [
            'total_households' => $records->count(),
            'total_persons'    => $records->sum(fn ($r) =>
                $r->familyMembers->count() + 1
            ),
            'validated'        => $records->where('status', 'Validated')->count(),
            'total_damage'     => $records->where('shelter_damage', 'Totally Damaged')->count(),
            'partial_damage'   => $records->where('shelter_damage', 'Partially Damaged')->count(),
            'total_aid_value'  => $records->sum(fn ($r) =>
                $r->assistanceRecords->sum('cost')
            ),
        ];

        $barangay_data = $records->groupBy('barangay')->map(fn ($group, $barangay) => [
            'name'  => $barangay,
            'count' => $group->count(),
        ])->values();

        $damage_data = [
            ['name' => 'Totally Damaged',   'value' => $stats['total_damage']],
            ['name' => 'Partially Damaged', 'value' => $stats['partial_damage']],
            ['name' => 'No Damage',         'value' => $records->where('shelter_damage', 'None')->count()],
        ];

        $top_vulnerable = $records->sortByDesc('vai_score')->take(5)->map(fn ($r) => [
            'id'             => $r->id,
            'serial_number'  => $r->serial_number,
            'last_name'      => $r->last_name,
            'first_name'     => $r->first_name,
            'barangay'       => $r->barangay,
            'status'         => $r->status,
            'shelter_damage' => $r->shelter_damage,
            'vai_score'      => $r->vai_score,
        ])->values();

        return Inertia::render('Dashboard', [
            'stats'          => $stats,
            'barangay_data'  => $barangay_data,
            'damage_data'    => $damage_data,
            'top_vulnerable' => $top_vulnerable,
        ]);
    }
}