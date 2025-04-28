import UtilitiesLayout from '@/layouts/UtilitiesLayout';
import { CaptchaGame, CaptchaGameResult, captchaSystem } from '@/utilities/captcha/CaptchaEngine';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

// Import the liquid level matcher game (assuming it's been registered with the system)
import '@/utilities/captcha/games/LiquidLevelMatcher';

export default function CaptchaDemo() {
    const [captchaVerified, setCaptchaVerified] = useState<boolean>(false);
    const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
    const [demoMode, setDemoMode] = useState<'interactive' | 'code'>('interactive');
    const [availableGames, setAvailableGames] = useState<CaptchaGame[]>([]);
    const [selectedGameId, setSelectedGameId] = useState<string | undefined>(undefined);
    const [isCopied, setIsCopied] = useState(false);

    // Get available games on component mount
    useEffect(() => {
        setAvailableGames(captchaSystem.getAllGames());
        if (captchaSystem.getAllGames().length > 0) {
            setSelectedGameId(captchaSystem.getAllGames()[0].id);
        }
    }, []);

    const handleCaptchaVerify = (success: boolean): void => {
        setCaptchaVerified(success);
    };

    const handleReset = (): void => {
        setCaptchaVerified(false);
    };

    const copyCode = (code: string): void => {
        navigator.clipboard.writeText(code);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const integrationCodeReact = `
        Coming Soon :tm:`;

    const apiEndpointCode = `
// API Endpoints
POST /api/captcha/generate
{
  "game": "liquid-level-matcher",  // optional
  "difficulty": "medium"           // optional (easy, medium, hard)
}

// Response
{
  "token": "abc123...",
  "gameId": "liquid-level-matcher",
  "difficulty": "medium"
}

POST /api/captcha/verify
{
  "token": "abc123...",
  "result": {
    "success": true,
    "accuracy": 0.95,
    // game-specific data
  }
}

// Response
{
  "success": true,
  "message": "CAPTCHA verified successfully"
}`;

    return (
        <UtilitiesLayout currentUtility="CAPTCHA Minigame">
            <Head title="CAPTCHA Minigame | Utilities" />

            <div className="mx-auto max-w-7xl">
                <h1 className="mb-6 text-3xl font-bold">CAPTCHA Minigame System</h1>
                <p className="mb-8 text-lg text-[#706f6c] dark:text-[#A1A09A]">
                    A fun and interactive way to verify human users through engaging mini-games instead of traditional boring CAPTCHAs.
                </p>

                <div className="mb-10 rounded-lg border bg-white p-6 shadow-sm dark:border-[#3E3E3A] dark:bg-[#161615]">
                    <div className="mb-6">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-semibold">Live Demo</h2>
                                <p className="mt-1 text-[#706f6c] dark:text-[#A1A09A]">Try it out and see how it works</p>
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setDemoMode('interactive')}
                                    className={`rounded-md px-4 py-2 text-sm font-medium ${
                                        demoMode === 'interactive'
                                            ? 'bg-[#1b1b18] text-white dark:bg-[#eeeeec] dark:text-[#1C1C1A]'
                                            : 'hover:bg-secondary/10 border border-[#e3e3e0] dark:border-[#3E3E3A]'
                                    }`}
                                >
                                    Interactive Demo
                                </button>
                                <button
                                    onClick={() => setDemoMode('code')}
                                    className={`rounded-md px-4 py-2 text-sm font-medium ${
                                        demoMode === 'code'
                                            ? 'bg-[#1b1b18] text-white dark:bg-[#eeeeec] dark:text-[#1C1C1A]'
                                            : 'hover:bg-secondary/10 border border-[#e3e3e0] dark:border-[#3E3E3A]'
                                    }`}
                                >
                                    Code Example
                                </button>
                            </div>
                        </div>
                    </div>

                    {demoMode === 'interactive' ? (
                        <div>
                            <div className="mb-6 space-y-4">
                                <div>
                                    <label className="mb-2 block text-sm font-medium">Game</label>
                                    <select
                                        value={selectedGameId}
                                        onChange={(e) => setSelectedGameId(e.target.value)}
                                        className="w-full rounded-md border border-[#e3e3e0] px-3 py-2 dark:border-[#3E3E3A] dark:bg-[#0a0a0a]"
                                    >
                                        {availableGames.map((game) => (
                                            <option key={game.id} value={game.id}>
                                                {game.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium">Difficulty</label>
                                    <div className="flex space-x-3">
                                        <button
                                            onClick={() => setDifficulty('easy')}
                                            className={`rounded-md px-4 py-2 text-sm font-medium ${
                                                difficulty === 'easy'
                                                    ? 'bg-[#1b1b18] text-white dark:bg-[#eeeeec] dark:text-[#1C1C1A]'
                                                    : 'hover:bg-secondary/10 border border-[#e3e3e0] dark:border-[#3E3E3A]'
                                            }`}
                                        >
                                            Easy
                                        </button>
                                        <button
                                            onClick={() => setDifficulty('medium')}
                                            className={`rounded-md px-4 py-2 text-sm font-medium ${
                                                difficulty === 'medium'
                                                    ? 'bg-[#1b1b18] text-white dark:bg-[#eeeeec] dark:text-[#1C1C1A]'
                                                    : 'hover:bg-secondary/10 border border-[#e3e3e0] dark:border-[#3E3E3A]'
                                            }`}
                                        >
                                            Medium
                                        </button>
                                        <button
                                            onClick={() => setDifficulty('hard')}
                                            className={`rounded-md px-4 py-2 text-sm font-medium ${
                                                difficulty === 'hard'
                                                    ? 'bg-[#1b1b18] text-white dark:bg-[#eeeeec] dark:text-[#1C1C1A]'
                                                    : 'hover:bg-secondary/10 border border-[#e3e3e0] dark:border-[#3E3E3A]'
                                            }`}
                                        >
                                            Hard
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-lg border border-[#e3e3e0] p-6 dark:border-[#3E3E3A]">
                                {captchaVerified ? (
                                    <div className="py-10 text-center">
                                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#def4e3] dark:bg-[#1a3324]">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="28"
                                                height="28"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="#2a9d58"
                                                strokeWidth="3"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        </div>
                                        <h3 className="mt-4 text-xl font-bold">Verification Successful!</h3>
                                        <p className="mt-2 mb-6 text-[#706f6c] dark:text-[#A1A09A]">
                                            You've successfully completed the CAPTCHA challenge.
                                        </p>
                                        <button
                                            onClick={handleReset}
                                            className="rounded-md bg-[#1b1b18] px-5 py-2.5 text-white hover:bg-black dark:bg-[#eeeeec] dark:text-[#1C1C1A] dark:hover:bg-white"
                                        >
                                            Try Again
                                        </button>
                                    </div>
                                ) : (
                                    <CaptchaMinigameWithStyles onVerify={handleCaptchaVerify} difficulty={difficulty} gameId={selectedGameId} />
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            <div>
                                <h3 className="mb-3 text-lg font-medium">React Component Integration</h3>
                                <div className="relative">
                                    <pre className="overflow-auto rounded-md bg-[#1c1c1a] p-4 text-sm text-[#f6f6f4] dark:bg-[#0a0a0a]">
                                        <code>{integrationCodeReact}</code>
                                    </pre>
                                    <button
                                        onClick={() => copyCode(integrationCodeReact)}
                                        className="absolute top-4 right-4 rounded-md bg-[#2d2d29]/50 px-2 py-1 text-xs font-medium text-white hover:bg-[#2d2d29] dark:bg-[#2d2d29]/30 dark:hover:bg-[#2d2d29]/50"
                                    >
                                        {isCopied ? 'Copied!' : 'Copy'}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <h3 className="mb-3 text-lg font-medium">API Endpoints</h3>
                                <div className="relative">
                                    <pre className="overflow-auto rounded-md bg-[#1c1c1a] p-4 text-sm text-[#f6f6f4] dark:bg-[#0a0a0a]">
                                        <code>{apiEndpointCode}</code>
                                    </pre>
                                    <button
                                        onClick={() => copyCode(apiEndpointCode)}
                                        className="absolute top-4 right-4 rounded-md bg-[#2d2d29]/50 px-2 py-1 text-xs font-medium text-white hover:bg-[#2d2d29] dark:bg-[#2d2d29]/30 dark:hover:bg-[#2d2d29]/50"
                                    >
                                        {isCopied ? 'Copied!' : 'Copy'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="grid gap-8 lg:grid-cols-2">
                    <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-[#3E3E3A] dark:bg-[#161615]">
                        <h2 className="mb-4 text-xl font-semibold">How It Works</h2>
                        <div className="space-y-4 text-[#706f6c] dark:text-[#A1A09A]">
                            <p>
                                CAPTCHA Minigames transform traditional verification systems into engaging mini-games that validate human users
                                through gameplay rather than frustrating identification tasks.
                            </p>

                            <p>
                                Each game tests human abilities like hand-eye coordination, pattern recognition, or spatial reasoning in a way that's
                                difficult for bots to simulate but fun for humans to complete.
                            </p>

                            <ol className="ml-5 list-decimal space-y-2">
                                <li>The system presents a random mini-game to the user</li>
                                <li>The user completes the challenge within the time limit</li>
                                <li>The system verifies the result on the server</li>
                                <li>Upon success, the form or content becomes accessible</li>
                            </ol>

                            <p>
                                The verification checks both the correctness of the solution and how the user interacted with the game (timing,
                                movement patterns, etc.) to ensure human-like behavior.
                            </p>
                        </div>
                    </div>

                    <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-[#3E3E3A] dark:bg-[#161615]">
                        <h2 className="mb-4 text-xl font-semibold">Available Games</h2>

                        <div className="space-y-6">
                            <div className="flex gap-4 border-b border-[#e3e3e0] pb-4 dark:border-[#3E3E3A]">
                                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-md bg-[#8847BB]/10">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="#8847BB"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M9 3h6v11h4l-7 7-7-7h4z" />
                                        <path d="M3 3h18" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-medium">Color Sorter Challenge</h3>
                                    <p className="mt-1 text-sm text-[#706f6c] dark:text-[#A1A09A]">
                                        Sort the colored liquids between containers to group each color together. Test your problem-solving skills!
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4 border-b border-[#e3e3e0] pb-4 dark:border-[#3E3E3A]">
                                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-md bg-[#5E4290]/10">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="#5E4290"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <circle cx="8" cy="8" r="4" />
                                        <path d="M10.3 15.1A8 8 0 0 1 20.5 21" />
                                        <path d="M7 13.8A8 8 0 0 0 3.5 21" />
                                        <path d="M17 3.3a8 8 0 0 1-5.9 17.4" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-medium">
                                        Pattern Memory{' '}
                                        <span className="ml-2 rounded bg-[#8847BB]/10 px-2 py-0.5 text-xs text-[#8847BB]">Coming Soon</span>
                                    </h3>
                                    <p className="mt-1 text-sm text-[#706f6c] dark:text-[#A1A09A]">
                                        Memorize and recreate a pattern that appears briefly on the screen.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-md bg-[#F9BAEE]/10">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="#F9BAEE"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                                        <line x1="9" x2="15" y1="15" y2="9" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-medium">
                                        Balance the Scale{' '}
                                        <span className="ml-2 rounded bg-[#8847BB]/10 px-2 py-0.5 text-xs text-[#8847BB]">Coming Soon</span>
                                    </h3>
                                    <p className="mt-1 text-sm text-[#706f6c] dark:text-[#A1A09A]">
                                        Add or remove weights to balance a virtual scale within a time limit.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 rounded-lg border bg-white p-6 shadow-sm dark:border-[#3E3E3A] dark:bg-[#161615]">
                    <h2 className="mb-4 text-xl font-semibold">Why Use CAPTCHA Minigames?</h2>

                    <div className="grid gap-6 md:grid-cols-3">
                        <div className="rounded-lg border border-[#e3e3e0] p-5 dark:border-[#3E3E3A]">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#8847BB]/10">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#8847BB"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M10 20H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-2" />
                                    <path d="M15 11v-1" />
                                    <path d="M11 12v-1" />
                                    <path d="M17 14H7" />
                                    <path d="M17 18h-5" />
                                </svg>
                            </div>
                            <h3 className="mb-2 text-lg font-medium">Improved User Experience</h3>
                            <p className="text-sm text-[#706f6c] dark:text-[#A1A09A]">
                                Replace frustrating, monotonous CAPTCHAs with engaging mini-games that users actually enjoy completing.
                            </p>
                        </div>

                        <div className="rounded-lg border border-[#e3e3e0] p-5 dark:border-[#3E3E3A]">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#5E4290]/10">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#5E4290"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <circle cx="12" cy="12" r="9" />
                                    <path d="M12 7v5l2.5 1.5" />
                                    <path d="M8.5 8.5a6 6 0 1 0 8.4-1.4" />
                                </svg>
                            </div>
                            <h3 className="mb-2 text-lg font-medium">Quick Completion</h3>
                            <p className="text-sm text-[#706f6c] dark:text-[#A1A09A]">
                                Most games can be completed in 5-15 seconds, keeping users engaged with your primary content.
                            </p>
                        </div>

                        <div className="rounded-lg border border-[#e3e3e0] p-5 dark:border-[#3E3E3A]">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#F9BAEE]/10">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#F9BAEE"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M12 2v8" />
                                    <path d="m4.93 10.93 1.41 1.41" />
                                    <path d="M2 18h2" />
                                    <path d="M20 18h2" />
                                    <path d="m19.07 10.93-1.41 1.41" />
                                    <path d="M22 22H2" />
                                    <path d="m8 22 4-10 4 10" />
                                </svg>
                            </div>
                            <h3 className="mb-2 text-lg font-medium">Effective Security</h3>
                            <p className="text-sm text-[#706f6c] dark:text-[#A1A09A]">
                                Multiple verification layers track not just the solution but also interaction patterns difficult for bots to simulate.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </UtilitiesLayout>
    );
}

// Implementing a styled version of the CaptchaMinigame component to match the design
// We'll style this directly in the demo page for simplicity
interface CaptchaMinigameWithStylesProps {
    onVerify: (success: boolean) => void;
    difficulty: 'easy' | 'medium' | 'hard';
    gameId?: string;
}

function CaptchaMinigameWithStyles({ onVerify, difficulty, gameId }: CaptchaMinigameWithStylesProps) {
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [game, setGame] = useState<CaptchaGame | null>(null);

    useEffect(() => {
        const initializeCaptcha = async (): Promise<void> => {
            try {
                setLoading(true);

                // For the demo, we're simulating an API call
                // In a real implementation, you'd call your API endpoint
                setTimeout(() => {
                    setToken('demo-token-123');

                    // Get the game component
                    const selectedGame = gameId ? captchaSystem.getAllGames().find((g) => g.id === gameId) : captchaSystem.getRandomGame(difficulty);

                    if (!selectedGame) {
                        throw new Error('No CAPTCHA games available');
                    }

                    setGame(selectedGame);
                    setLoading(false);
                }, 800);
            } catch (err) {
                setError('Failed to initialize CAPTCHA');
                console.error(err);
                setLoading(false);
            }
        };

        initializeCaptcha();
    }, [difficulty, gameId]);

    const handleGameComplete = async (result: CaptchaGameResult): Promise<void> => {
        if (!token) return;

        // For the demo, we're simulating verification
        // In a real implementation, you'd send this to your server
        setTimeout(() => {
            onVerify(result.success);
        }, 600);
    };

    const handleTimeout = (): void => {
        setError('Time expired. Please try again.');
        onVerify(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-16">
                <div className="flex flex-col items-center">
                    <div className="h-10 w-10 animate-spin rounded-full border-t-2 border-b-2 border-[#8847BB]"></div>
                    <p className="mt-4 text-[#706f6c] dark:text-[#A1A09A]">Loading CAPTCHA minigame...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-red-500"
                    >
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                    </svg>
                </div>
                <p className="mb-4 text-red-500">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="rounded-md bg-[#1b1b18] px-4 py-2 text-sm font-medium text-white hover:bg-black dark:bg-[#eeeeec] dark:text-[#1C1C1A] dark:hover:bg-white"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (!game) {
        return (
            <div className="py-12 text-center">
                <p>No CAPTCHA games available</p>
            </div>
        );
    }

    const GameComponent = game.component;

    return (
        <div className="captcha-minigame">
            <div className="mb-4 flex items-center justify-between">
                <span className="text-lg font-medium">{game.name}</span>
                <span className="rounded bg-[#8847BB]/10 px-2 py-1 text-xs font-medium text-[#8847BB]">CAPTCHA Minigame</span>
            </div>

            <div className="rounded-md border border-[#e3e3e0] bg-white p-6 dark:border-[#3E3E3A] dark:bg-[#1C1C1A]">
                <GameComponent onComplete={handleGameComplete} onTimeout={handleTimeout} difficulty={difficulty} />
            </div>
        </div>
    );
}
