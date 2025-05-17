<?php

namespace App\Http\Controllers;

use App\Models\Poll;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class OGImageController extends Controller
{
    public function generate(Request $request)
    {
        $title = $request->input('title', 'Jakub Palacký');
        $path = $request->input('path', '/');

        // Get tags from request
        $tagsString = $request->input('tags', '');
        $tags = $tagsString ? explode(',', $tagsString) : [];

        // Check if this is a poll OG image request
        $pollId = $request->input('poll_id');
        $pollData = null;
        if ($pollId) {
            $pollData = $this->getPollData($pollId);
        }

        // Create a cache key based on all parameters
        $cacheKey = md5($title . $path . $tagsString . ($pollId ?? ''));
        $cachePath = "og-images/{$cacheKey}.png";

        // Check if the image already exists in cache
        if (!Storage::disk('public')->exists($cachePath) || config('app.debug')) {
            // Create the directory if it doesn't exist
            Storage::disk('public')->makeDirectory('og-images', 0777, true, true);

            if ($pollData) {
                // Generate poll-specific OG image
                $this->createPollImageWithImagick(
                    $pollData,
                    storage_path('app/public/' . $cachePath)
                );
            } else {
                // Generate standard OG image
                $this->createImageWithImagick(
                    $title,
                    $path,
                    $tags,
                    storage_path('app/public/' . $cachePath)
                );
            }
        }

        // Return the cached image
        if (config('app.debug')) {
            return Response::file(storage_path('app/public/' . $cachePath), [
                'Content-Type' => 'image/png',
                'Cache-Control' => 'no-cache, no-store, must-revalidate'
            ]);
        }
        return Response::file(storage_path('app/public/' . $cachePath), [
            'Content-Type' => 'image/png',
            'Cache-Control' => 'public, max-age=86400'
        ]);
    }

    /**
     * Fetch poll data for image generation
     */
    private function getPollData($pollId)
    {
        $poll = Poll::with(['options' => function ($query) {
            $query->withCount('votes');
        }])->withCount('allVotes')->find($pollId);

        if (!$poll) {
            return null;
        }

        // Calculate percentages and prepare sorted options
        $topOptions = collect($poll->options)
            ->map(function ($option) use ($poll) {
                $percentage = $poll->all_votes_count > 0
                    ? round(($option->votes_count / $poll->all_votes_count) * 100)
                    : 0;

                return [
                    'text' => $option->text,
                    'votes' => $option->votes_count,
                    'percentage' => $percentage
                ];
            })
            ->sortByDesc('votes')
            ->take(3)
            ->values()
            ->toArray();

        return [
            'title' => $poll->title,
            'total_votes' => $poll->all_votes_count,
            'options' => $topOptions
        ];
    }

    /**
     * Create an OG image for polls
     */
    private function createPollImageWithImagick($pollData, $outputPath)
    {
        // Create a new image with a dark background
        $image = new \Imagick();
        $image->newImage(1200, 630, new \ImagickPixel('#111111'));
        $image->setImageFormat('png');

        // Create a radial gradient for the background effect
        $gradient = new \Imagick();
        $gradient->newPseudoImage(1200, 630, 'radial-gradient:rgba(136,71,187,0.2)-rgba(17,17,17,0.0)');

        // Composite the gradient onto the background
        $image->compositeImage($gradient, \Imagick::COMPOSITE_OVER, 0, 0);

        // Load and resize the logo
        $logo = new \Imagick(public_path('media/vypal.png'));
        $logo->resizeImage(100, 100, \Imagick::FILTER_LANCZOS, 1, true);
        $logo->roundCorners(10, 10);
        $image->compositeImage($logo, \Imagick::COMPOSITE_OVER, 60, 40);

        // Add the branding text
        $brandText = new \ImagickDraw();
        $brandText->setFont(resource_path('fonts/Inter-Bold.ttf'));
        $brandText->setFontSize(34);
        $brandText->setFillColor('white');
        $brandText->annotation(180, 97, 'vypal.me');
        $image->drawImage($brandText);

        // Add "Poll" indicator with rounded background
        $pollTag = "POLL";
        $pageTextDraw = new \ImagickDraw();
        $pageTextDraw->setFont(resource_path('fonts/Inter-Bold.ttf'));
        $pageTextDraw->setFontSize(34);
        $metrics = $image->queryFontMetrics($pageTextDraw, $pollTag);

        $pageIndicator = new \ImagickDraw();
        $pageIndicator->setFillColor(new \ImagickPixel('#8847BB'));
        $pageIndicator->roundRectangle(
            1140 - $metrics['textWidth'] - 24,
            50,
            1140,
            104,
            10,
            10
        );
        $image->drawImage($pageIndicator);

        $pageText = new \ImagickDraw();
        $pageText->setFont(resource_path('fonts/Inter-Bold.ttf'));
        $pageText->setFontSize(34);
        $pageText->setFillColor('white');
        $pageText->setTextAlignment(\Imagick::ALIGN_CENTER);
        $pageText->annotation(1140 - ($metrics['textWidth'] / 2) - 12, 88, $pollTag);
        $image->drawImage($pageText);

        // Add poll title (wrapped if necessary)
        $titleWrapped = $this->wordWrapImageMagick($image, $pollData['title'], resource_path('fonts/Inter-Bold.ttf'), 60, 960);
        $lineHeight = 68;
        $totalHeight = count($titleWrapped) * $lineHeight;
        $startY = 210;

        foreach ($titleWrapped as $index => $line) {
            $titleText = new \ImagickDraw();
            $titleText->setFont(resource_path('fonts/Inter-Bold.ttf'));
            $titleText->setFontSize(60);
            $titleText->setFillColor('white');
            $titleText->setTextAlignment(\Imagick::ALIGN_CENTER);
            $titleText->annotation(600, $startY + ($index * $lineHeight), $line);
            $image->drawImage($titleText);
        }

        // Add total votes count
        $votesText = $pollData['total_votes'] . " vote" . ($pollData['total_votes'] != 1 ? "s" : "");
        $votesIndicator = new \ImagickDraw();
        $votesIndicator->setFont(resource_path('fonts/Inter-Regular.ttf'));
        $votesIndicator->setFontSize(32);
        $votesIndicator->setFillColor('rgba(255,255,255,0.7)');
        $votesIndicator->setTextAlignment(\Imagick::ALIGN_CENTER);
        $votesIndicator->annotation(600, $startY + $totalHeight + 40, $votesText);
        $image->drawImage($votesIndicator);

        // Calculate start position for poll options
        $startOptionsY = 380;
        $barHeight = 36;
        $barSpacing = 56;
        $barWidth = 900;

        // Draw options with percentage bars
        foreach ($pollData['options'] as $index => $option) {
            $posY = $startOptionsY + ($index * $barSpacing);

            // Background bar
            $bgBar = new \ImagickDraw();
            $bgBar->setFillColor(new \ImagickPixel('rgba(255,255,255,0.1)'));
            $bgBar->roundRectangle(
                150,
                $posY,
                150 + $barWidth,
                $posY + $barHeight,
                12,
                12
            );
            $image->drawImage($bgBar);

            // Percentage bar
            $percentageWidth = $barWidth * ($option['percentage'] / 100);
            if ($percentageWidth > 0) {
                $percentBar = new \ImagickDraw();
                $percentBar->setFillColor(new \ImagickPixel('#8847BB'));
                $percentBar->roundRectangle(
                    150,
                    $posY,
                    150 + $percentageWidth,
                    $posY + $barHeight,
                    12,
                    12
                );
                $image->drawImage($percentBar);
            }

            // Option text - truncate if too long
            $optionText = mb_strlen($option['text']) > 40 ? mb_substr($option['text'], 0, 37) . '...' : $option['text'];
            $textDraw = new \ImagickDraw();
            $textDraw->setFont(resource_path('fonts/Inter-Regular.ttf'));
            $textDraw->setFontSize(26);
            $textDraw->setFillColor('white');
            $textDraw->annotation(160, $posY + 26, $optionText);
            $image->drawImage($textDraw);

            // Percentage text
            $percentText = new \ImagickDraw();
            $percentText->setFont(resource_path('fonts/Inter-Bold.ttf'));
            $percentText->setFontSize(26);
            $percentText->setFillColor('white');
            $percentText->setTextAlignment(\Imagick::ALIGN_RIGHT);
            $percentText->annotation(1040, $posY + 27, $option['percentage'] . "%");
            $image->drawImage($percentText);
        }

        // Footer URL
        $footerText = new \ImagickDraw();
        $footerText->setFont(resource_path('fonts/Inter-Regular.ttf'));
        $footerText->setFontSize(28);
        $footerText->setFillColor('rgba(255,255,255,0.5)');
        $footerText->setTextAlignment(\Imagick::ALIGN_CENTER);
        $footerText->annotation(600, 580, 'vypal.me/polls');
        $image->drawImage($footerText);

        // Write the image
        $image->writeImage($outputPath);

        // Clean up
        $image->clear();
        $image->destroy();
        $gradient->clear();
        $gradient->destroy();
        $logo->clear();
        $logo->destroy();
    }

    /**
     * Create an OG image using the Imagick library
     */
    private function createImageWithImagick($title, $path, $tags, $outputPath)
    {
        // Create a new image with a dark background
        $image = new \Imagick();
        $image->newImage(1200, 630, new \ImagickPixel('#111111'));
        $image->setImageFormat('png');

        // Create a radial gradient for the background effect
        $gradient = new \Imagick();
        $gradient->newPseudoImage(1200, 630, 'radial-gradient:rgba(136,71,187,0.13)-rgba(17,17,17,0.0)');

        // Composite the gradient onto the background
        $image->compositeImage($gradient, \Imagick::COMPOSITE_OVER, 0, 0);

        // Format the page path for display
        $pageName = $path === '/'
            ? 'Home'
            : implode(' - ', array_map(function($segment) {
                return ucfirst($segment);
              }, array_filter(explode('/', $path))));

        // Load and resize the logo
        $logo = new \Imagick(public_path('media/vypal.png'));

        // Resize logo to 100x100px while maintaining aspect ratio
        $logo->resizeImage(100, 100, \Imagick::FILTER_LANCZOS, 1, true);
        $logo->roundCorners(10, 10);

        // Composite the logo onto the main image
        $image->compositeImage($logo, \Imagick::COMPOSITE_OVER, 60, 40);

        // Add the branding text
        $brandText = new \ImagickDraw();
        $brandText->setFont(resource_path('fonts/Inter-Bold.ttf'));
        $brandText->setFontSize(34);
        $brandText->setFillColor('white');
        $brandText->annotation(180, 97, 'vypal.me');
        $image->drawImage($brandText);

        $pageText = new \ImagickDraw();
        $pageText->setFont(resource_path('fonts/Inter-Regular.ttf'));
        $pageText->setFontSize(44);
        $pageText->setFillColor('white');
        $pageText->setTextAlignment(\Imagick::ALIGN_RIGHT);
        $pageText->annotation(1140, 97, $pageName);

        // Add page indicator with rounded background
        $pageMetrics = $image->queryFontMetrics($pageText, $pageName);

        $pageIndicator = new \ImagickDraw();
        $pageIndicator->setFillColor(new \ImagickPixel('rgba(255,255,255,0.1)'));
        $pageIndicator->roundRectangle(
            1140 - $pageMetrics['textWidth'] - 12,
            50,
            1140 + 16,
            110,
            10,
            10
        );
        $image->drawImage($pageIndicator);

        $image->drawImage($pageText);

        // Split title into lines if needed
        $titleWrapped = $this->wordWrapImageMagick($image, $title, resource_path('fonts/Inter-Bold.ttf'), 60, 960);
        $lineHeight = 104;
        $totalHeight = count($titleWrapped) * $lineHeight;
        $startY = 315 - ($totalHeight / 2) + 60; // Add font size for baseline

        // Add each line of the title
        foreach ($titleWrapped as $index => $line) {
            $titleText = new \ImagickDraw();
            $titleText->setFont(resource_path('fonts/Inter-Bold.ttf'));
            $titleText->setFontSize(82);
            $titleText->setFillColor('white');
            $titleText->setTextAlignment(\Imagick::ALIGN_CENTER);
            $titleText->annotation(600, $startY + ($index * $lineHeight), $line);
            $image->drawImage($titleText);
        }

        // Add tags if present
        if (!empty($tags)) {
            $this->addTagsToImage($image, $tags, $startY + $totalHeight);
        }

        // Write the image
        $image->writeImage($outputPath);

        // Clean up
        $image->clear();
        $image->destroy();
        $gradient->clear();
        $gradient->destroy();
        $logo->clear();
        $logo->destroy();
    }

    private function addTagsToImage($image, $tags, $startY)
    {
        // Limit to a reasonable number of tags
        $tags = array_slice($tags, 0, 10);

        $tagTextFont = resource_path('fonts/Inter-Regular.ttf');
        $tagFontSize = 40;
        $tagPadding = 16;
        $tagMargin = 15;
        $maxTagsPerRow = 4;

        // Split tags into two rows if needed
        $firstRowTags = array_slice($tags, 0, $maxTagsPerRow);
        $secondRowTags = array_slice($tags, $maxTagsPerRow);

        // Process first row
        $totalRowWidth = 0;
        $tagWidths = [];

        foreach ($firstRowTags as $tag) {
            $tagDraw = new \ImagickDraw();
            $tagDraw->setFont($tagTextFont);
            $tagDraw->setFontSize($tagFontSize);

            $metrics = $image->queryFontMetrics($tagDraw, $tag);
            $tagWidth = $metrics['textWidth'] + ($tagPadding * 2);

            $tagWidths[] = $tagWidth;
            $totalRowWidth += $tagWidth + $tagMargin;
        }

        if (!empty($firstRowTags)) {
            $totalRowWidth -= $tagMargin;
            $startX = (1200 - $totalRowWidth) / 2;
            $currentX = $startX;

            // Draw first row of tags
            foreach ($firstRowTags as $index => $tag) {
                $tagWidth = $tagWidths[$index];

                // Tag background pill
                $tagBg = new \ImagickDraw();
                $tagBg->setFillColor(new \ImagickPixel('#8847BB'));
                $tagBg->roundRectangle(
                    $currentX,
                    $startY - 46,
                    $currentX + $tagWidth,
                    $startY + 16,
                    15,
                    15
                );
                $image->drawImage($tagBg);

                // Tag text
                $tagText = new \ImagickDraw();
                $tagText->setFont($tagTextFont);
                $tagText->setFontSize($tagFontSize);
                $tagText->setFillColor('white');
                $tagText->annotation($currentX + $tagPadding, $startY, $tag);
                $image->drawImage($tagText);

                $currentX += $tagWidth + $tagMargin;
            }
        }

        // Process second row if needed
        if (!empty($secondRowTags)) {
            $totalRowWidth = 0;
            $tagWidths = [];

            foreach ($secondRowTags as $tag) {
                $tagDraw = new \ImagickDraw();
                $tagDraw->setFont($tagTextFont);
                $tagDraw->setFontSize($tagFontSize);

                $metrics = $image->queryFontMetrics($tagDraw, $tag);
                $tagWidth = $metrics['textWidth'] + ($tagPadding * 2);

                $tagWidths[] = $tagWidth;
                $totalRowWidth += $tagWidth + $tagMargin;
            }

            $totalRowWidth -= $tagMargin;
            $startX = (1200 - $totalRowWidth) / 2;
            $currentX = $startX;

            // Draw second row of tags
            foreach ($secondRowTags as $index => $tag) {
                $tagWidth = $tagWidths[$index];

                // Tag background pill
                $tagBg = new \ImagickDraw();
                $tagBg->setFillColor(new \ImagickPixel('#8847BB'));
                $tagBg->roundRectangle(
                    $currentX,
                    $startY + 34,  // Offset below first row
                    $currentX + $tagWidth,
                    $startY + 90,
                    15,
                    15
                );
                $image->drawImage($tagBg);

                // Tag text
                $tagText = new \ImagickDraw();
                $tagText->setFont($tagTextFont);
                $tagText->setFontSize($tagFontSize);
                $tagText->setFillColor('white');
                $tagText->annotation($currentX + $tagPadding, $startY + 74, $tag);
                $image->drawImage($tagText);

                $currentX += $tagWidth + $tagMargin;
            }
        }
    }

    /**
     * Word wrap text for Imagick
     */
    private function wordWrapImageMagick($image, $text, $font, $fontSize, $maxWidth)
    {
        $words = explode(' ', $text);
        $lines = [];
        $currentLine = '';

        $draw = new \ImagickDraw();
        $draw->setFont($font);
        $draw->setFontSize($fontSize);

        foreach ($words as $word) {
            $testLine = trim($currentLine . ' ' . $word);
            $metrics = $image->queryFontMetrics($draw, $testLine);

            if ($metrics['textWidth'] > $maxWidth - 80 && $currentLine !== '') {
                $lines[] = $currentLine;
                $currentLine = $word;
            } else {
                $currentLine = $testLine;
            }
        }

        // Add the last line
        if ($currentLine !== '') {
            $lines[] = $currentLine;
        }

        return $lines;
    }
}
