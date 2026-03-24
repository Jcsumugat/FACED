<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class FamilyMember extends Model
{
    use HasFactory;

    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'faced_record_id',
        'name',
        'relationship',
        'birthdate',
        'age',
        'sex',
        'birthplace',
        'occupation',
        'educational_attainment',
    ];

    protected $casts = [
        'birthdate' => 'date',
        'age'       => 'integer',
    ];

    public function facedRecord()
    {
        return $this->belongsTo(FacedRecord::class, 'faced_record_id');
    }

    public function vulnerabilities()
    {
        return $this->hasMany(FamilyMemberVulnerability::class, 'family_member_id');
    }

    public function assistanceRecords()
    {
        return $this->hasMany(AssistanceRecord::class, 'recipient_member_id');
    }

    public function hasVulnerability(): bool
    {
        return $this->vulnerabilities()->exists();
    }
}