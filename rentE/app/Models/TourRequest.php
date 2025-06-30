<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TourRequest extends Model
{
    use HasFactory;
    protected $fillable = [
        'house_id',
        'tenant_id',
        'landlord_id',
        'preferred_date',
        'preferred_time',
        'message',
        'status',
    ];

    // Relationships
    public function house()
    {
        return $this->belongsTo(House::class);
    }

    public function tenant()
    {
        return $this->belongsTo(User::class, 'tenant_id');
    }

    public function landlord()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
