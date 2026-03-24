<?php

namespace App\Services;

use App\Models\FacedRecord;

class VaiScoreService
{
    public function calculate(FacedRecord $record): int
    {
        $score = 0;

        // Social Category (Max 25)
        if ($record->is_4ps) $score += 10;
        if ($record->is_ip && $record->ip_group && $record->ip_group !== 'None') $score += 10;
        if ($record->others_category) $score += 5;

        // Monthly Income (Max 25)
        $income = (float) $record->monthly_income;
        if ($income < 5000)       $score += 25;
        elseif ($income < 10000)  $score += 15;
        elseif ($income < 15000)  $score += 5;

        // Family Member Vulnerabilities (Max 30, +5 per member with any vulnerability)
        $record->loadMissing('familyMembers.vulnerabilities');
        $vulnScore = 0;
        foreach ($record->familyMembers as $member) {
            if ($member->vulnerabilities->isNotEmpty()) {
                $vulnScore += 5;
            }
        }
        $score += min($vulnScore, 30);

        // Shelter Damage (Max 30)
        if ($record->shelter_damage === 'Totally Damaged')    $score += 30;
        elseif ($record->shelter_damage === 'Partially Damaged') $score += 15;

        return $score;
    }
}