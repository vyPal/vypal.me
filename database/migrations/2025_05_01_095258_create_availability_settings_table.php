<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('availability_settings', function (Blueprint $table) {
            $table->id();
            $table->dateTime('available_from')->nullable();
            $table->dateTime('available_until')->nullable();
            $table->boolean('is_available_now')->default(false);
            $table->string('busy_message')->default("I am currently busy with other projects.");
            $table->string('available_message')->default("I might have time now! Do you have a project in mind?");
            $table->json('project_backlog')->nullable(); // Store backlog items with additional properties
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('availability_settings');
    }
};
