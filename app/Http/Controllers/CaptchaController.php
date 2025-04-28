<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Cache;

class CaptchaController extends Controller
{
    public function generate(Request $request)
    {
        $token = Str::random(32);

        // Store token in cache for verification later
        Cache::put("captcha:{$token}", [
            'completed' => false,
            'expired' => false,
            'game' => $request->input('game'),
            'difficulty' => $request->input('difficulty', 'medium'),
        ], now()->addMinutes(30));

        return response()->json([
            'token' => $token,
            'gameId' => $request->input('game'),
            'difficulty' => $request->input('difficulty', 'medium'),
        ]);
    }

    public function verify(Request $request)
    {
        $token = $request->input('token');
        $result = $request->input('result');

        $captchaData = Cache::get("captcha:{$token}");

        if (!$captchaData) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid CAPTCHA token'
            ], 400);
        }

        if ($captchaData['expired']) {
            return response()->json([
                'success' => false,
                'message' => 'CAPTCHA has expired'
            ], 400);
        }

        if ($captchaData['completed']) {
            return response()->json([
                'success' => true,
                'message' => 'CAPTCHA already verified'
            ]);
        }

        // In a production environment, you would verify the result on the server side
        // For the demo, we'll accept any result that claims success
        if ($result['success']) {
            Cache::put("captcha:{$token}", [
                'completed' => true,
                'expired' => false,
                'game' => $captchaData['game'],
                'difficulty' => $captchaData['difficulty'],
            ], now()->addMinutes(30));

            return response()->json([
                'success' => true,
                'message' => 'CAPTCHA verified successfully'
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'CAPTCHA verification failed'
        ], 400);
    }
}
