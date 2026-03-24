<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SitrepConfig extends Model
{
    use HasFactory;

    protected $fillable = [
        'sitrep_number',
        'date',
        'period_from',
        'period_to',
        'disaster_type',
        'disaster_name',
        'disaster_date',
        'prepared_by',
        'position',
        'office',
        'summary',
        'created_by',
    ];

    protected $casts = [
        'date'         => 'date',
        'period_from'  => 'date',
        'period_to'    => 'date',
        'disaster_date' => 'date',
    ];

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}