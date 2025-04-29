<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Storage;

class OGImageController extends Controller
{
    public function generate(Request $request)
    {
        $title = $request->input('title', 'Jakub Palacký');
        $path = $request->input('path', '/');

        // Get tags from request
        $tagsString = $request->input('tags', '');
        $tags = $tagsString ? explode(',', $tagsString) : [];

        // Create a cache key based on all parameters
        $cacheKey = md5($title . $path . $tagsString);
        $cachePath = "og-images/{$cacheKey}.png";

        // Check if the image already exists in cache
        if (!Storage::disk('public')->exists($cachePath)) {
            // Create the directory if it doesn't exist
            Storage::disk('public')->makeDirectory('og-images');

            // Generate image using Imagick
            $this->createImageWithImagick(
                $title,
                $path,
                $tags,
                storage_path('app/public/' . $cachePath)
            );
        }

        // Return the cached image
        return Response::file(storage_path('app/public/' . $cachePath), [
            'Content-Type' => 'image/png',
            'Cache-Control' => 'public, max-age=86400'
        ]);
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
