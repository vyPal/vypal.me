<?php

// database/seeders/LinksTableSeeder.php
namespace Database\Seeders;

use App\Models\Link;
use App\Models\Sublink;
use Illuminate\Database\Seeder;

class LinksTableSeeder extends Seeder
{
    public function run()
    {
        // Clear existing data
        Sublink::query()->delete();
        Link::query()->delete();

        // Create links
        $portfolioLink = Link::create([
            'title' => 'Portfolio',
            'type' => 'other',
            'url' => 'https://vypal.me',
            'description' => 'Check out my portfolio and other projects',
            'order' => 1,
        ]);

        Sublink::create([
            'title' => 'GitHub',
            'url' => 'https://github.com/vyPal',
            'order' => 1,
            'link_id' => $portfolioLink->id,
        ]);

        Link::create([
            'title' => 'Social',
            'type' => 'separator',
            'order' => 2,
        ]);

        Link::create([
            'title' => 'LinkedIn',
            'type' => 'social',
            'url' => 'https://linkedin.com/in/jakub-palacky',
            'description' => 'Check out my LinkedIn profile',
            'order' => 3,
        ]);

        Link::create([
            'title' => 'Twitter',
            'type' => 'social',
            'url' => 'https://twitter.com/vyPal420',
            'description' => 'Check out my Twitter profile',
            'order' => 4,
        ]);

        Link::create([
            'title' => 'Contributed to',
            'type' => 'separator',
            'order' => 5,
        ]);

        $pumpkinLink = Link::create([
            'title' => 'Pumpkin',
            'type' => 'code',
            'url' => 'https://pumpkinmc.org',
            'description' => 'A high-performance Minecraft server',
            'order' => 6,
        ]);

        // Create sublinks for the pumpkin link
        Sublink::create([
            'link_id' => $pumpkinLink->id,
            'title' => 'GitHub',
            'url' => 'https://github.com/Pumpkin-MC/Pumpkin',
            'order' => 1,
        ]);

        Sublink::create([
            'link_id' => $pumpkinLink->id,
            'title' => 'Discord',
            'url' => 'https://discord.gg/Y4yMjpZkcj',
            'order' => 2,
        ]);
    }
}
