<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}

        <title>{{ config('app.name', 'Jakub Palacký - Portfolio') }}</title>
        <meta name="title" content="@yield('meta_title', 'Jakub Palacký - Everything Developer')">
        <meta name="description" content="@yield('meta_description', 'Everything Developer specializing in backend, frontend, mobile and embedded applications. View my portfolio of projects and skills.')">
        <meta name="keywords" content="@yield('meta_keywords', 'portfolio, developer, backend, frontend, mobile, embedded, applications, projects, skills')">
        <meta name="author" content="Jakub Palacký">

        <meta property="og:type" content="website">
        <meta property="og:url" content="{{ url()->current() }}">
        <meta property="og:title" content="@yield('meta_title', 'Jakub Palacký - Everything Developer')">
        <meta property="og:description" content="@yield('meta_description', 'Everything Developer specializing in backend, frontend, mobile and embedded applications. View my portfolio of projects and skills.')">
        <meta property="og:image" content="@yield('og_image', asset('media/vypal.png'))">

        <meta property="twitter:card" content="summary_large_image">
        <meta property="twitter:url" content="{{ url()->current() }}">
        <meta property="twitter:title" content="@yield('meta_title', 'Your Name - Everything Developer')">
        <meta property="twitter:description" content="@yield('meta_description', 'Everything Developer specializing in backend, frontend, mobile and embedded applications. View my portfolio of projects and skills.')">
        <meta property="twitter:image" content="@yield('og_image', asset('media/vypal.png'))">

        <link rel="canonical" href="{{ url()->current() }}">

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
    </body>
</html>
