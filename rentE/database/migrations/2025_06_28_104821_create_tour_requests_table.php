<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tour_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('house_id')->constrained()->onDelete('cascade'); // Link to the house
            $table->foreignId('tenant_id')->constrained('users')->onDelete('cascade'); // Link to the requesting tenant
            $table->foreignId('landlord_id')->constrained('users')->onDelete('cascade'); // Link to the landlord of the house

            $table->date('preferred_date');
            $table->time('preferred_time')->nullable(); // Optional preferred time
            $table->text('message')->nullable(); // Message from the tenant
            $table->enum('status', ['pending', 'accepted', 'rejected', 'completed', 'cancelled'])->default('pending');
            $table->timestamps();

            // Add index for faster lookups
            $table->index(['house_id', 'tenant_id', 'landlord_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tour_requests');
    }
};