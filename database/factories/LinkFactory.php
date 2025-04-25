<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class LinkFactory extends Factory
{
    public function definition()
    {
        return [
            'title' => $this->faker->sentence(3),
            'type' => $this->faker->randomElement(['website', 'article', 'video']),
            'url' => $this->faker->url(),
            'description' => $this->faker->paragraph(),
            'order' => $this->faker->numberBetween(1, 100),
        ];
    }
}
