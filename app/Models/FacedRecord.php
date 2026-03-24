<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class FacedRecord extends Model
{
    use HasFactory;

    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'serial_number',
        'status',
        'region',
        'province',
        'municipality',
        'district',
        'barangay',
        'evacuation_center',
        'last_name',
        'first_name',
        'middle_name',
        'name_extension',
        'civil_status',
        'mothers_maiden_name',
        'religion',
        'occupation',
        'birthdate',
        'age',
        'sex',
        'birthplace',
        'monthly_income',
        'id_presented',
        'id_number',
        'contact_primary',
        'contact_alternate',
        'permanent_address',
        'is_4ps',
        'is_ip',
        'ip_group',
        'others_category',
        'bank_provider',
        'account_name',
        'account_type',
        'account_number',
        'house_ownership',
        'shelter_damage',
        'consent_checked',
        'signed_form_url',
        'remarks',
        'vai_score',
        'date_registered',
        'created_by',
    ];

    protected $casts = [
        'is_4ps'          => 'boolean',
        'is_ip'           => 'boolean',
        'consent_checked' => 'boolean',
        'monthly_income'  => 'decimal:2',
        'vai_score'       => 'integer',
        'birthdate'       => 'date',
        'date_registered' => 'date',
    ];

    public function familyMembers()
    {
        return $this->hasMany(FamilyMember::class, 'faced_record_id');
    }

    public function assistanceRecords()
    {
        return $this->hasMany(AssistanceRecord::class, 'faced_record_id');
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function getFullNameAttribute(): string
    {
        $ext = $this->name_extension ? ' ' . $this->name_extension : '';
        return "{$this->last_name}, {$this->first_name} {$this->middle_name}{$ext}";
    }

    public function getTotalAidAttribute(): float
    {
        return $this->assistanceRecords->sum('cost');
    }
}