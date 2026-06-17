<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}

        <meta name="author" content="Jakub Palacký">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta name="google-adsense-account" content="ca-pub-2237148760200150">

        <link rel="apple-touch-icon" sizes="180x180" href="/media/vypal.png">
        <link rel="icon" type="image/png" sizes="32x32" href="/media/vypal.png">
        <link rel="icon" type="image/png" sizes="16x16" href="/media/vypal.png">

        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: oklch(1 0 0);
            }

            html.dark {
                background-color: oklch(0.145 0 0);
            }
        </style>

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

        <script defer src="https://umami.vypal.me/script.js" data-website-id="7b165982-1021-46e6-aa14-d99fc5049972"></script>

        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia

        <noscript>
            <div style="padding: 20px; font-family: sans-serif;">
                <h1>Jakub Palacký - vyPal.me</h1>
                <p>Vítejte na mém osobním portfoliu. Zde prezentuji své softwarové projekty, webové aplikace a systémovou infrastrukturu.</p>
                <p>Tato doména slouží jako hlavní rozcestník pro mé vývojářské aktivity a doprovodné projekty, včetně bezplatných hostingových platforem a přidružených řídicích panelů.</p>
            </div>
        </noscript>

        <div id="app-fallback-ad-crawler" style="display:none !important; aria-hidden: true;">
            <h1>Jakub Palacký - Softwarový Vývojář</h1>
            <p>Prezentace projektů, vývoj aplikací na zakázku, správa serverové infrastruktury a cloudových řešení. Tato stránka je aktivní a plně v provozu.</p>
        </div>
    </body>
</html>
