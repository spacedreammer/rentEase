<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class House extends Model
{
    protected $fillable = [
        'title',
        'description',
        'price',
        'location',
        'images',
        'user_id',

        'status',
        'bedrooms',
        'bathrooms',
        'size',
    ];

    protected $casts = [
        'images' => 'array', // Crucial: Casts the 'images' JSON column to a PHP array
        'price' => 'decimal:2', // Good practice for decimal types
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
