<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('links', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('type'); // 'website', 'blog', 'social', 'code', 'separator'
            $table->string('url')->nullable();
            $table->text('description')->nullable();
            $table->integer('order')->default(0); // For link ordering
            $table->timestamps();
        });

        // Create a separate table for sublinks
        Schema::create('sublinks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('link_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->string('url');
            $table->integer('order')->default(0); // For sublink ordering
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('sublinks');
        Schema::dropIfExists('links');
    }
};
