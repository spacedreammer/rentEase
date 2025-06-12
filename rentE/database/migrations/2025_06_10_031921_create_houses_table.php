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
        Schema::create('houses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // landlord
            $table->string('title');
            $table->text('description');
            $table->decimal('price', 10, 2);
            $table->string('location');
            $table->json('images'); // Store multiple images as JSON
            $table->enum('status', ['available', 'rented', 'maintenance'])->default('available');
            $table->integer('bedrooms')->default(1);
            $table->integer('bathrooms')->default(1);
            $table->integer('size')->nullable(); // Size in square feet or meters
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('houses');
    }
};
