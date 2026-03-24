<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AssistanceRecord extends Model
{
    use HasFactory;

    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'faced_record_id',
        'recipient_member_id',
        'recipient_name',
        'date',
        'emergency_type',
        'assistance_provided',
        'unit',
        'quantity',
        'cost',
        'provider',
        'status',
    ];

    protected $casts = [
        'date'     => 'date',
        'quantity' => 'decimal:2',
        'cost'     => 'decimal:2',
    ];

    public function facedRecord()
    {
        return $this->belongsTo(FacedRecord::class, 'faced_record_id');
    }

    public function recipientMember()
    {
        return $this->belongsTo(FamilyMember::class, 'recipient_member_id');
    }

    public function isLocked(): bool
    {
        return $this->status === 'Locked';
    }

    public function isApproved(): bool
    {
        return $this->status === 'Approved';
    }
}