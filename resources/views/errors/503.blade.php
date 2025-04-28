<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ config('app.name') }} - Maintenance</title>
    <style>
        :root {
            --primary: #8847BB;
            --primary-light: #9a58cd;
            --background: #0f0f13;
            --foreground: #f8f8fc;
            --surface: #1a1a22;
            --muted: #8e8ea0;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: var(--background);
            color: var(--foreground);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            line-height: 1.6;
        }

        .container {
            max-width: 600px;
            width: 100%;
            text-align: center;
            position: relative;
        }

        .maintenance-card {
            background-color: var(--surface);
            border-radius: 16px;
            padding: 3rem 2rem;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            position: relative;
            overflow: hidden;
        }

        .glow {
            position: absolute;
            top: -50px;
            left: -50px;
            width: 200px;
            height: 200px;
            background: var(--primary);
            border-radius: 50%;
            filter: blur(80px);
            opacity: 0.15;
        }

        .glow-2 {
            right: -50px;
            left: auto;
            bottom: -50px;
            top: auto;
        }

        h1 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 1.5rem;
            background: linear-gradient(135deg, var(--foreground) 0%, var(--muted) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .icon {
            margin-bottom: 2rem;
            display: inline-block;
        }

        .icon svg {
            fill: var(--primary);
            width: 80px;
            height: 80px;
        }

        p {
            margin-bottom: 1.5rem;
            color: var(--muted);
            font-size: 1.1rem;
        }

        .highlight {
            color: var(--primary-light);
            font-weight: 500;
        }

        .estimated-time {
            display: inline-block;
            margin-top: 1rem;
            padding: 0.75rem 1.5rem;
            background-color: rgba(138, 71, 187, 0.1);
            border-radius: 8px;
            font-weight: 500;
        }

        footer {
            margin-top: 2rem;
            color: var(--muted);
            font-size: 0.9rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="maintenance-card">
            <div class="glow"></div>
            <div class="glow glow-2"></div>

            <div class="icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm-6 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm12 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
                </svg>
            </div>

            <h1>We're improving things</h1>

            <p>
                {{ config('app.name') }} is currently undergoing scheduled maintenance.
                We're working to make things <span class="highlight">better for you</span>.
            </p>

            <p>Thank you for your patience while we make these improvements.</p>
        </div>

        <footer>
            &copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
        </footer>
    </div>
</body>
</html>
