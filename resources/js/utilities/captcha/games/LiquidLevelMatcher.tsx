import React, { useEffect, useState } from 'react';
import { CaptchaGameProps, CaptchaGameResult } from '../CaptchaEngine';

// Each slot in a beaker has a color
type SlotColor = 'red' | 'blue' | 'green' | 'purple' | 'orange';

// A beaker is an array of colors (max 4 slots)
type Beaker = SlotColor[];

interface LiquidSorterResult extends CaptchaGameResult {
    success: boolean;
    moves: number;
}

// Tailwind color classes for each color
const colorClasses: Record<SlotColor, string> = {
    red: 'bg-red-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-400',
};

export const LiquidSorter: React.FC<CaptchaGameProps> = ({ onComplete, onTimeout, difficulty = 'medium' }) => {
    // Generate a solvable initial state
    const generateBeakers = (): Beaker[] => {
        const colors: SlotColor[] = ['red', 'blue', 'green', 'purple'];
        const slots: SlotColor[] = [];

        // Create a full set of colors (4 of each color)
        colors.forEach((color) => {
            for (let i = 0; i < 4; i++) {
                slots.push(color);
            }
        });

        // Shuffle the slots
        for (let i = slots.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [slots[i], slots[j]] = [slots[j], slots[i]];
        }

        // Create 4 beakers with random distribution
        const beakers: Beaker[] = [[], [], [], []];
        slots.forEach((color, index) => {
            beakers[index % 4].push(color);
        });

        // Add an empty beaker
        beakers.push([]);

        return beakers;
    };

    const [beakers, setBeakers] = useState<Beaker[]>(generateBeakers());
    const [selectedBeaker, setSelectedBeaker] = useState<number | null>(null);
    const [moves, setMoves] = useState(0);
    const [timeLeft, setTimeLeft] = useState(difficulty === 'easy' ? 120 : difficulty === 'medium' ? 90 : 60);
    const [gameStarted, setGameStarted] = useState(false);
    const [instructions, setInstructions] = useState(true);

    // Timer countdown
    useEffect(() => {
        if (!gameStarted) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    onTimeout?.();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [gameStarted, onTimeout]);

    const startGame = (): void => {
        setGameStarted(true);
        setInstructions(false);
    };

    const handleBeakerClick = (index: number): void => {
        if (!gameStarted) return;

        if (selectedBeaker === null) {
            // Only allow selection of non-empty beakers
            if (beakers[index].length > 0) {
                setSelectedBeaker(index);
            }
        } else if (selectedBeaker === index) {
            // Deselect if clicking the same beaker
            setSelectedBeaker(null);
        } else {
            // Try to pour from selected beaker to this one
            pourLiquid(selectedBeaker, index);
        }
    };

    const pourLiquid = (sourceIndex: number, targetIndex: number): void => {
        const sourceBeaker = [...beakers[sourceIndex]];
        const targetBeaker = [...beakers[targetIndex]];

        if (sourceBeaker.length === 0) return; // Can't pour from empty beaker
        if (targetBeaker.length >= 4) return; // Can't pour into full beaker

        const sourceTopColor = sourceBeaker[sourceBeaker.length - 1];

        // Check if the pour is valid
        if (targetBeaker.length > 0 && targetBeaker[targetBeaker.length - 1] !== sourceTopColor) {
            return; // Can't pour onto a different color
        }

        // Count how many of the top color we have in source
        let countTopColor = 0;
        for (let i = sourceBeaker.length - 1; i >= 0; i--) {
            if (sourceBeaker[i] === sourceTopColor) {
                countTopColor++;
            } else {
                break;
            }
        }

        // Calculate how many we can pour (limited by space in target)
        const availableSpace = 4 - targetBeaker.length;
        const amountToPour = Math.min(countTopColor, availableSpace);

        if (amountToPour <= 0) return;

        // Execute the pour
        const newBeakers = [...beakers];

        // Remove from source
        newBeakers[sourceIndex] = sourceBeaker.slice(0, sourceBeaker.length - amountToPour);

        // Add to target
        newBeakers[targetIndex] = [...targetBeaker, ...Array(amountToPour).fill(sourceTopColor)];

        setBeakers(newBeakers);
        setSelectedBeaker(null);
        setMoves(moves + 1);

        // Check if solved
        checkSolution(newBeakers);
    };

    const checkSolution = (currentBeakers: Beaker[]): void => {
        // A solution is valid when each beaker either:
        // 1. Is empty, or
        // 2. Contains exactly 4 slots of the same color

        const isSolved = currentBeakers.every(
            (beaker) => beaker.length === 0 || (beaker.length === 4 && beaker.every((color) => color === beaker[0])),
        );

        if (isSolved) {
            const result: LiquidSorterResult = {
                success: true,
                moves,
            };

            onComplete(result);
        }
    };

    const canPourFrom = (beakerIndex: number): boolean => {
        if (beakers[beakerIndex].length === 0) return false;

        // Check if there's at least one valid target
        const sourceTopColor = beakers[beakerIndex][beakers[beakerIndex].length - 1];

        return beakers.some(
            (targetBeaker, targetIndex) =>
                targetIndex !== beakerIndex &&
                (targetBeaker.length === 0 || (targetBeaker.length < 4 && targetBeaker[targetBeaker.length - 1] === sourceTopColor)),
        );
    };

    return (
        <div className="mx-auto w-full max-w-md">
            {instructions ? (
                /* Instructions screen */
                <div className="p-4 text-center">
                    <h3 className="mb-3 text-lg font-bold">Color Sorter Challenge</h3>

                    <div className="border-primary/20 dark:border-primary/10 bg-primary/5 mb-6 rounded-lg border p-4">
                        <p className="mb-4">Sort the colored liquids so each container has only one color.</p>

                        <ol className="mb-4 space-y-2 text-left text-sm">
                            <li className="flex items-start gap-2">
                                <span className="bg-primary mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs text-white">
                                    1
                                </span>
                                <span>Click a container to select it</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="bg-primary mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs text-white">
                                    2
                                </span>
                                <span>Click another container to pour from the first into the second</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="bg-primary mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs text-white">
                                    3
                                </span>
                                <span>You can only pour a color onto the same color or into an empty container</span>
                            </li>
                        </ol>

                        <div className="text-secondary text-xs">Time limit: {timeLeft} seconds</div>
                    </div>

                    <button
                        onClick={startGame}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-6 py-2 text-sm font-medium transition-all active:scale-95"
                    >
                        Start Challenge
                    </button>
                </div>
            ) : (
                /* Game UI */
                <div>
                    <div className="mb-3 flex items-center justify-between">
                        <div className="text-sm font-medium">Moves: {moves}</div>
                        <div className="text-sm font-medium">Time: {timeLeft}s</div>
                    </div>

                    {/* Beakers */}
                    <div className="mb-4 flex items-end justify-center gap-3">
                        {beakers.map((beaker, index) => (
                            <div
                                key={index}
                                onClick={() => handleBeakerClick(index)}
                                className={`relative h-40 w-14 cursor-pointer rounded-md border-2 transition-all ${selectedBeaker === index ? 'border-primary scale-105' : canPourFrom(index) ? 'border-primary/50' : 'border-gray-300 dark:border-gray-700'} ${selectedBeaker !== null && selectedBeaker !== index ? 'hover:border-primary/70' : ''} bg-white/10 backdrop-blur-sm dark:bg-black/20`}
                            >
                                {/* Beaker shape - rounded bottom part */}
                                <div className="absolute right-1 bottom-0 left-1 h-6 rounded-b-full border-r-2 border-b-2 border-l-2 border-gray-300 dark:border-gray-700"></div>

                                {/* Container for the slots */}
                                <div className="absolute right-1 bottom-4 left-1 h-32">
                                    {/* Empty state indicator */}
                                    {beaker.length === 0 && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-xs text-gray-400 dark:text-gray-500">Empty</span>
                                        </div>
                                    )}

                                    {/* Render the color slots from bottom to top */}
                                    {beaker.map((color, slotIndex) => (
                                        <div
                                            key={slotIndex}
                                            className={`absolute right-0 left-0 h-8 ${colorClasses[color]} transition-all`}
                                            style={{ bottom: `${slotIndex * 32}px` }}
                                        ></div>
                                    ))}
                                </div>

                                {/* Selection indicator */}
                                {selectedBeaker === index && (
                                    <div className="bg-primary absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full text-xs text-white">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="12"
                                            height="12"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Game instructions */}
                    <div className="text-muted-foreground border-border bg-background/50 mt-4 rounded-md border p-2 text-center text-xs">
                        {selectedBeaker !== null ? (
                            <p>Now click another container to pour into it</p>
                        ) : (
                            <p>Click a container with liquid to select it</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// Register the game with the CAPTCHA system
import { captchaSystem } from '../CaptchaEngine';

captchaSystem.registerGame({
    id: 'liquid-sorter',
    name: 'Color Sorter Challenge',
    difficulty: 'medium',
    component: LiquidSorter,
    validate: async (result: CaptchaGameResult) => {
        return result.success === true;
    },
    timeLimit: 90,
});
