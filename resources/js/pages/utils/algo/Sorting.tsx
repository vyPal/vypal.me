import SEO from '@/components/SEO';
import UtilitiesLayout from '@/layouts/UtilitiesLayout';
import { useCallback, useEffect, useRef, useState } from 'react';

// Define types
interface ArrayBar {
    value: number;
    state: 'default' | 'comparing' | 'sorted' | 'selected';
    key: string; // unique identifier for stable rendering
}

// Algorithm type definition
type AlgorithmName = 'bubble' | 'insertion' | 'selection' | 'merge' | 'quick';

// Animation speed in milliseconds
type Speed = 'slow' | 'medium' | 'fast';

const speedValues = {
    slow: 500,
    medium: 150,
    fast: 50,
};

// Array size options
type ArraySize = 'small' | 'medium' | 'large';

const arraySizeValues = {
    small: 20,
    medium: 50,
    large: 100,
};

export default function SortingVisualizer() {
    // State variables
    const [array, setArray] = useState<ArrayBar[]>([]);
    const [arraySize, setArraySize] = useState<ArraySize>('medium');
    const [speed, setSpeed] = useState<Speed>('medium');
    const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmName>('bubble');
    const [isSorting, setIsSorting] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [comparisons, setComparisons] = useState(0);
    const [swaps, setSwaps] = useState(0);
    const [currentStep, setCurrentStep] = useState<string | null>(null);

    // Animation controller
    const animationTimeoutsRef = useRef<number[]>([]);

    // Clear any running animations
    const clearAnimations = () => {
        animationTimeoutsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
        animationTimeoutsRef.current = [];
    };

    // Generate a new random array
    const generateRandomArray = useCallback(() => {
        clearAnimations();
        setIsComplete(false);
        setComparisons(0);
        setSwaps(0);
        setCurrentStep(null);

        const size = arraySizeValues[arraySize];
        const newArray: ArrayBar[] = [];
        const minValue = 5; // Minimum bar height
        const maxValue = 100; // Maximum bar height

        for (let i = 0; i < size; i++) {
            newArray.push({
                value: Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue,
                state: 'default',
                key: `bar-${i}-${Date.now()}`,
            });
        }

        setArray(newArray);
    }, [arraySize]);

    // Initialize array on component mount and when size changes
    useEffect(() => {
        generateRandomArray();
    }, [generateRandomArray, arraySize]);

    // Function to animate array changes
    const animateArrayUpdate = (
        newArray: ArrayBar[],
        stepDescription: string | null = null,
        incrementComparisons = false,
        incrementSwaps = false,
    ) => {
        return new Promise<void>((resolve) => {
            const timeoutId = window.setTimeout(() => {
                setArray([...newArray]);

                if (incrementComparisons) {
                    setComparisons((prev) => prev + 1);
                }

                if (incrementSwaps) {
                    setSwaps((prev) => prev + 1);
                }

                if (stepDescription) {
                    setCurrentStep(stepDescription);
                }

                resolve();
            }, speedValues[speed]);

            animationTimeoutsRef.current.push(timeoutId);
        });
    };

    // Mark all as sorted
    const markAllSorted = async (sortedArray: ArrayBar[]) => {
        const allSorted = sortedArray.map((bar) => ({
            ...bar,
            state: 'sorted' as const,
        }));

        await animateArrayUpdate(allSorted, 'Sort complete!');
        setIsComplete(true);
        setIsSorting(false);
    };

    // Bubble Sort Algorithm
    const bubbleSort = async () => {
        const arr = [...array];
        const n = arr.length;

        for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                // Mark bars being compared
                arr[j].state = 'comparing';
                arr[j + 1].state = 'comparing';

                await animateArrayUpdate(arr, `Comparing ${arr[j].value} and ${arr[j + 1].value}`, true);

                if (arr[j].value > arr[j + 1].value) {
                    // Swap values
                    const temp = { ...arr[j] };
                    arr[j] = { ...arr[j + 1] };
                    arr[j + 1] = temp;

                    await animateArrayUpdate(arr, `Swapping ${arr[j].value} and ${arr[j + 1].value}`, false, true);
                }

                // Reset state
                arr[j].state = 'default';
                arr[j + 1].state = 'default';

                // Mark largest as sorted in this pass
                if (j === n - i - 2) {
                    arr[j + 1].state = 'sorted';
                }
            }
        }

        // Mark first element as sorted (not covered in the loops)
        if (arr.length > 0) {
            arr[0].state = 'sorted';
        }

        await markAllSorted(arr);
    };

    // Selection Sort Algorithm
    const selectionSort = async () => {
        const arr = [...array];
        const n = arr.length;

        for (let i = 0; i < n - 1; i++) {
            let minIndex = i;
            arr[i].state = 'selected';

            await animateArrayUpdate(arr, `Finding minimum element starting from index ${i}`);

            for (let j = i + 1; j < n; j++) {
                arr[j].state = 'comparing';

                await animateArrayUpdate(arr, `Comparing ${arr[minIndex].value} with ${arr[j].value}`, true);

                if (arr[j].value < arr[minIndex].value) {
                    // Reset previous minimum
                    if (minIndex !== i) {
                        arr[minIndex].state = 'default';
                    }

                    minIndex = j;
                    arr[minIndex].state = 'selected';

                    await animateArrayUpdate(arr, `New minimum found: ${arr[minIndex].value}`);
                } else {
                    arr[j].state = 'default';
                }
            }

            // Swap the found minimum element with the first element
            if (minIndex !== i) {
                const temp = { ...arr[i] };
                arr[i] = { ...arr[minIndex] };
                arr[minIndex] = temp;

                arr[i].state = 'sorted';
                arr[minIndex].state = 'default';

                await animateArrayUpdate(arr, `Swapping ${arr[i].value} and ${arr[minIndex].value}`, false, true);
            } else {
                arr[i].state = 'sorted';
                await animateArrayUpdate(arr, `${arr[i].value} is already in the correct position`);
            }
        }

        // Mark the last element as sorted
        if (arr.length > 0) {
            arr[n - 1].state = 'sorted';
            await animateArrayUpdate(arr, 'Last element placed in correct position');
        }

        await markAllSorted(arr);
    };

    // Insertion Sort Algorithm
    const insertionSort = async () => {
        const arr = [...array];
        const n = arr.length;

        // Mark first element as sorted
        arr[0].state = 'sorted';
        await animateArrayUpdate(arr, 'First element is sorted by default');

        for (let i = 1; i < n; i++) {
            // Select current element to be inserted
            const key = arr[i].value;
            arr[i].state = 'selected';

            await animateArrayUpdate(arr, `Inserting ${key} into the sorted portion`);

            let j = i - 1;

            while (j >= 0 && arr[j].value > key) {
                arr[j].state = 'comparing';

                await animateArrayUpdate(arr, `Comparing ${arr[j].value} with ${key}`, true);

                // Shift element to the right
                arr[j + 1].value = arr[j].value;
                arr[j].state = 'sorted';

                await animateArrayUpdate(arr, `Shifting ${arr[j].value} to the right`, false, true);

                j--;
            }

            // Place key in its correct position
            arr[j + 1].value = key;
            arr[j + 1].state = 'sorted';

            await animateArrayUpdate(arr, `Placing ${key} in its correct position`);
        }

        await markAllSorted(arr);
    };

    // Quick Sort Implementation
    const quickSort = async () => {
        const arr = [...array];

        const partition = async (low: number, high: number): Promise<number> => {
            // Choose the rightmost element as pivot
            const pivot = arr[high].value;
            arr[high].state = 'selected';

            await animateArrayUpdate(arr, `Choosing pivot: ${pivot}`);

            // Index of smaller element
            let i = low - 1;

            for (let j = low; j < high; j++) {
                arr[j].state = 'comparing';

                await animateArrayUpdate(arr, `Comparing ${arr[j].value} with pivot ${pivot}`, true);

                // If current element is smaller than the pivot
                if (arr[j].value < pivot) {
                    i++;

                    // Swap arr[i] and arr[j]
                    if (i !== j) {
                        const temp = { ...arr[i] };
                        arr[i] = { ...arr[j] };
                        arr[j] = { ...temp };

                        await animateArrayUpdate(arr, `Swapping ${arr[i].value} and ${arr[j].value}`, false, true);
                    }
                }

                arr[j].state = 'default';
            }

            // Swap arr[i+1] and arr[high] (put the pivot in its correct position)
            const temp = { ...arr[i + 1] };
            arr[i + 1] = { ...arr[high] };
            arr[high] = { ...temp };

            arr[i + 1].state = 'sorted';

            await animateArrayUpdate(arr, `Placing pivot ${pivot} in its correct position`, false, true);

            return i + 1;
        };

        const quickSortRecursive = async (low: number, high: number) => {
            if (low < high) {
                // Find the partition index
                const pi = await partition(low, high);

                // Recursively sort elements before and after partition
                await quickSortRecursive(low, pi - 1);
                await quickSortRecursive(pi + 1, high);
            } else if (low === high) {
                // Single element is already sorted
                arr[low].state = 'sorted';
                await animateArrayUpdate(arr, `Element ${arr[low].value} is in its correct position`);
            }
        };

        await quickSortRecursive(0, arr.length - 1);
        await markAllSorted(arr);
    };

    // Merge Sort Implementation
    const mergeSort = async () => {
        const arr = [...array];

        const merge = async (left: number, mid: number, right: number) => {
            const n1 = mid - left + 1;
            const n2 = right - mid;

            // Create temporary arrays
            const leftArray: number[] = [];
            const rightArray: number[] = [];

            // Copy data to temporary arrays
            for (let i = 0; i < n1; i++) {
                leftArray[i] = arr[left + i].value;
                arr[left + i].state = 'comparing';
            }

            for (let j = 0; j < n2; j++) {
                rightArray[j] = arr[mid + 1 + j].value;
                arr[mid + 1 + j].state = 'comparing';
            }

            await animateArrayUpdate(arr, `Dividing array into left [${leftArray.join(', ')}] and right [${rightArray.join(', ')}]`);

            // Merge the temporary arrays back into arr
            let i = 0;
            let j = 0;
            let k = left;

            while (i < n1 && j < n2) {
                await animateArrayUpdate(arr, `Comparing ${leftArray[i]} and ${rightArray[j]}`, true);

                if (leftArray[i] <= rightArray[j]) {
                    arr[k].value = leftArray[i];
                    arr[k].state = 'selected';

                    await animateArrayUpdate(arr, `Placing ${leftArray[i]} from left array`, false, true);

                    i++;
                } else {
                    arr[k].value = rightArray[j];
                    arr[k].state = 'selected';

                    await animateArrayUpdate(arr, `Placing ${rightArray[j]} from right array`, false, true);

                    j++;
                }

                k++;
            }

            // Copy remaining elements of leftArray, if any
            while (i < n1) {
                arr[k].value = leftArray[i];
                arr[k].state = 'selected';

                await animateArrayUpdate(arr, `Placing remaining element ${leftArray[i]} from left array`, false, true);

                i++;
                k++;
            }

            // Copy remaining elements of rightArray, if any
            while (j < n2) {
                arr[k].value = rightArray[j];
                arr[k].state = 'selected';

                await animateArrayUpdate(arr, `Placing remaining element ${rightArray[j]} from right array`, false, true);

                j++;
                k++;
            }

            // Mark this section as organized
            for (let i = left; i <= right; i++) {
                arr[i].state = 'default';
            }

            await animateArrayUpdate(arr, `Merged segment [${left}...${right}]`);
        };

        const mergeSortRecursive = async (left: number, right: number) => {
            if (left < right) {
                const mid = Math.floor((left + right) / 2);

                // Sort first and second halves
                await mergeSortRecursive(left, mid);
                await mergeSortRecursive(mid + 1, right);

                // Merge the sorted halves
                await merge(left, mid, right);
            }
        };

        await mergeSortRecursive(0, arr.length - 1);
        await markAllSorted(arr);
    };

    // Start sorting animation based on selected algorithm
    const startSorting = async () => {
        if (isSorting || isComplete) return;

        setIsSorting(true);
        setIsComplete(false);
        setComparisons(0);
        setSwaps(0);

        try {
            switch (selectedAlgorithm) {
                case 'bubble':
                    await bubbleSort();
                    break;
                case 'insertion':
                    await insertionSort();
                    break;
                case 'selection':
                    await selectionSort();
                    break;
                case 'merge':
                    await mergeSort();
                    break;
                case 'quick':
                    await quickSort();
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.error('Sorting error:', error);
            setIsSorting(false);
        }
    };

    // Stop current sorting and reset
    const stopSorting = () => {
        clearAnimations();
        setIsSorting(false);
        generateRandomArray();
    };

    // Algorithm descriptions
    const algorithmInfo = {
        bubble: {
            title: 'Bubble Sort',
            description:
                'A simple comparison-based algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.',
            timeComplexity: 'O(n²)',
            spaceComplexity: 'O(1)',
            stable: true,
        },
        insertion: {
            title: 'Insertion Sort',
            description: "Builds the final sorted array one item at a time. It's much less efficient on large lists than more advanced algorithms.",
            timeComplexity: 'O(n²)',
            spaceComplexity: 'O(1)',
            stable: true,
        },
        selection: {
            title: 'Selection Sort',
            description:
                'Divides the input list into a sorted and an unsorted region, repeatedly selecting the smallest element from the unsorted region.',
            timeComplexity: 'O(n²)',
            spaceComplexity: 'O(1)',
            stable: false,
        },
        merge: {
            title: 'Merge Sort',
            description:
                'A divide and conquer algorithm that divides the input array into two halves, recursively sorts them, and then merges the sorted halves.',
            timeComplexity: 'O(n log n)',
            spaceComplexity: 'O(n)',
            stable: true,
        },
        quick: {
            title: 'Quick Sort',
            description: 'A divide and conquer algorithm that picks an element as a pivot and partitions the array around the pivot.',
            timeComplexity: 'O(n log n) average, O(n²) worst case',
            spaceComplexity: 'O(log n)',
            stable: false,
        },
    };

    return (
        <UtilitiesLayout currentUtility="Algorithm Visualizer">
            <SEO
                title="Sorting Algorithm Visualizer | vyPal.me Utilities"
                description="Watch how different sorting algorithms organize data step-by-step. Compare bubble sort, quick sort, merge sort, and more with interactive controls."
                keywords="sorting algorithms, algorithm visualization, bubble sort, quick sort, merge sort, insertion sort, selection sort, educational"
                tags={['sorting', 'algorithms', 'visualization', 'bubble sort', 'quick sort', 'merge sort', 'comparison']}
                url="https://vypal.me/utils/algo/sorting"
            />

            <div className="mx-auto max-w-7xl">
                <h1 className="mb-6 text-3xl font-bold">Sorting Algorithm Visualizer</h1>
                <p className="mb-8 text-lg text-[#706f6c] dark:text-[#A1A09A]">
                    Visualize how different sorting algorithms organize data step-by-step.
                </p>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Main visualization area */}
                    <div className="lg:col-span-2">
                        <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-[#5E4290]/20 dark:bg-[#161615]">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-xl font-semibold">Visualization</h2>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={generateRandomArray}
                                        disabled={isSorting}
                                        className={`rounded-md border px-3 py-1.5 text-sm font-medium ${
                                            isSorting
                                                ? 'cursor-not-allowed opacity-50'
                                                : 'border-[#8847BB] text-[#8847BB] hover:bg-[#8847BB]/10 dark:border-[#F9BAEE] dark:text-[#F9BAEE] dark:hover:bg-[#F9BAEE]/10'
                                        }`}
                                    >
                                        Randomize
                                    </button>

                                    {isSorting ? (
                                        <button
                                            onClick={stopSorting}
                                            className="rounded-md bg-red-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-600"
                                        >
                                            Stop
                                        </button>
                                    ) : (
                                        <button
                                            onClick={startSorting}
                                            disabled={isComplete}
                                            className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                                                isComplete
                                                    ? 'cursor-not-allowed bg-green-500 text-white opacity-50'
                                                    : 'bg-[#8847BB] text-white hover:bg-[#8847BB]/90 dark:bg-[#5E4290] dark:hover:bg-[#5E4290]/90'
                                            }`}
                                        >
                                            {isComplete ? 'Sorted' : 'Start Sorting'}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Algorithm Statistics */}
                            <div className="mb-4 grid grid-cols-3 gap-2">
                                <div className="rounded-md bg-[#8847BB]/10 p-2 text-center dark:bg-[#5E4290]/20">
                                    <div className="text-xs uppercase">Comparisons</div>
                                    <div className="font-mono text-lg font-semibold">{comparisons}</div>
                                </div>
                                <div className="rounded-md bg-[#8847BB]/10 p-2 text-center dark:bg-[#5E4290]/20">
                                    <div className="text-xs uppercase">Swaps/Moves</div>
                                    <div className="font-mono text-lg font-semibold">{swaps}</div>
                                </div>
                                <div className="rounded-md bg-[#8847BB]/10 p-2 text-center dark:bg-[#5E4290]/20">
                                    <div className="text-xs uppercase">Array Size</div>
                                    <div className="font-mono text-lg font-semibold">{array.length}</div>
                                </div>
                            </div>

                            {/* Current Step Display */}
                            <div className="mb-4 h-8 rounded-md bg-[#8847BB]/5 p-2 text-center text-sm dark:bg-[#5E4290]/10">
                                {currentStep || 'Ready to start sorting...'}
                            </div>

                            {/* Array Visualization */}
                            <div className="mt-6 h-64 overflow-hidden rounded-md border dark:border-[#5E4290]/20">
                                <div className="flex h-full items-end justify-around p-2" style={{ minHeight: '250px' }}>
                                    {array.map((bar) => (
                                        <div
                                            key={bar.key}
                                            className={`transition-all duration-${speedValues[speed]} w-[${100 / arraySizeValues[arraySize]}%] max-w-[20px] min-w-[2px] rounded-t-sm ${
                                                bar.state === 'default'
                                                    ? 'bg-[#8847BB]/80 dark:bg-[#5E4290]/80'
                                                    : bar.state === 'comparing'
                                                      ? 'bg-yellow-500 dark:bg-yellow-600'
                                                      : bar.state === 'selected'
                                                        ? 'bg-red-500 dark:bg-red-600'
                                                        : 'bg-green-500 dark:bg-green-600'
                                            }`}
                                            style={{ height: `${bar.value}%` }}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Color Legend */}
                            <div className="mt-4 flex flex-wrap gap-3 text-xs">
                                <div className="flex items-center">
                                    <div className="mr-1 h-3 w-3 rounded-sm bg-[#8847BB]/80 dark:bg-[#5E4290]/80"></div>
                                    Unsorted
                                </div>
                                <div className="flex items-center">
                                    <div className="mr-1 h-3 w-3 rounded-sm bg-yellow-500 dark:bg-yellow-600"></div>
                                    Comparing
                                </div>
                                <div className="flex items-center">
                                    <div className="mr-1 h-3 w-3 rounded-sm bg-red-500 dark:bg-red-600"></div>
                                    Selected/Current
                                </div>
                                <div className="flex items-center">
                                    <div className="mr-1 h-3 w-3 rounded-sm bg-green-500 dark:bg-green-600"></div>
                                    Sorted
                                </div>
                            </div>
                        </div>

                        {/* Algorithm Description */}
                        <div className="mt-8 rounded-lg border bg-white p-6 shadow-sm dark:border-[#5E4290]/20 dark:bg-[#161615]">
                            <h2 className="mb-4 text-xl font-semibold">{algorithmInfo[selectedAlgorithm].title}</h2>

                            <p className="mb-4 text-[#706f6c] dark:text-[#A1A09A]">{algorithmInfo[selectedAlgorithm].description}</p>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <h3 className="mb-1 text-sm font-medium">Time Complexity</h3>
                                    <p className="font-mono text-[#8847BB] dark:text-[#F9BAEE]">{algorithmInfo[selectedAlgorithm].timeComplexity}</p>
                                </div>

                                <div>
                                    <h3 className="mb-1 text-sm font-medium">Space Complexity</h3>
                                    <p className="font-mono text-[#8847BB] dark:text-[#F9BAEE]">{algorithmInfo[selectedAlgorithm].spaceComplexity}</p>
                                </div>

                                <div>
                                    <h3 className="mb-1 text-sm font-medium">Stability</h3>
                                    <p className={algorithmInfo[selectedAlgorithm].stable ? 'text-green-600' : 'text-red-600'}>
                                        {algorithmInfo[selectedAlgorithm].stable ? 'Stable' : 'Unstable'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Controls Panel */}
                    <div>
                        <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-[#5E4290]/20 dark:bg-[#161615]">
                            <h2 className="mb-4 text-xl font-semibold">Controls</h2>

                            {/* Algorithm Selection */}
                            <div className="mb-6">
                                <label className="mb-2 block text-sm font-medium">Algorithm</label>
                                <div className="grid grid-cols-1 gap-2">
                                    {(['bubble', 'insertion', 'selection', 'merge', 'quick'] as AlgorithmName[]).map((algo) => (
                                        <button
                                            key={algo}
                                            onClick={() => setSelectedAlgorithm(algo)}
                                            disabled={isSorting}
                                            className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                                                selectedAlgorithm === algo
                                                    ? 'bg-[#8847BB] text-white dark:bg-[#5E4290]'
                                                    : 'border border-[#8847BB]/30 bg-transparent text-[#8847BB] hover:bg-[#8847BB]/10 dark:border-[#F9BAEE]/30 dark:text-[#F9BAEE] dark:hover:bg-[#F9BAEE]/10'
                                            } ${isSorting ? 'cursor-not-allowed opacity-50' : ''}`}
                                        >
                                            {algorithmInfo[algo].title}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Array Size Control */}
                            <div className="mb-6">
                                <label className="mb-2 block text-sm font-medium">Array Size</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {(['small', 'medium', 'large'] as ArraySize[]).map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setArraySize(size)}
                                            disabled={isSorting}
                                            className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                                                arraySize === size
                                                    ? 'bg-[#8847BB] text-white dark:bg-[#5E4290]'
                                                    : 'border border-[#8847BB]/30 bg-transparent text-[#8847BB] hover:bg-[#8847BB]/10 dark:border-[#F9BAEE]/30 dark:text-[#F9BAEE] dark:hover:bg-[#F9BAEE]/10'
                                            } ${isSorting ? 'cursor-not-allowed opacity-50' : ''}`}
                                        >
                                            {size.charAt(0).toUpperCase() + size.slice(1)}
                                        </button>
                                    ))}
                                </div>
                                <div className="mt-2 text-xs text-[#706f6c] dark:text-[#A1A09A]">
                                    Small: {arraySizeValues.small} elements • Medium: {arraySizeValues.medium} elements • Large:{' '}
                                    {arraySizeValues.large} elements
                                </div>
                            </div>

                            {/* Animation Speed Control */}
                            <div className="mb-6">
                                <label className="mb-2 block text-sm font-medium">Animation Speed</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {(['slow', 'medium', 'fast'] as Speed[]).map((speedOption) => (
                                        <button
                                            key={speedOption}
                                            onClick={() => setSpeed(speedOption)}
                                            disabled={isSorting}
                                            className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                                                speed === speedOption
                                                    ? 'bg-[#8847BB] text-white dark:bg-[#5E4290]'
                                                    : 'border border-[#8847BB]/30 bg-transparent text-[#8847BB] hover:bg-[#8847BB]/10 dark:border-[#F9BAEE]/30 dark:text-[#F9BAEE] dark:hover:bg-[#F9BAEE]/10'
                                            } ${isSorting ? 'cursor-not-allowed opacity-50' : ''}`}
                                        >
                                            {speedOption.charAt(0).toUpperCase() + speedOption.slice(1)}
                                        </button>
                                    ))}
                                </div>
                                <div className="mt-2 text-xs text-[#706f6c] dark:text-[#A1A09A]">
                                    Slow: {speedValues.slow}ms • Medium: {speedValues.medium}ms • Fast: {speedValues.fast}ms
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="mb-6 space-y-2">
                                <label className="mb-2 block text-sm font-medium">Quick Actions</label>

                                <button
                                    onClick={() => {
                                        const sortedArray = [...Array(arraySizeValues[arraySize])].map((_, i) => ({
                                            value: (i + 1) * (100 / arraySizeValues[arraySize]),
                                            state: 'default' as const,
                                            key: `bar-${i}-${Date.now()}`,
                                        }));
                                        setArray(sortedArray);
                                    }}
                                    disabled={isSorting}
                                    className={`w-full rounded-md border border-[#8847BB]/30 bg-transparent px-3 py-2 text-sm font-medium text-[#8847BB] transition-colors hover:bg-[#8847BB]/10 dark:border-[#F9BAEE]/30 dark:text-[#F9BAEE] dark:hover:bg-[#F9BAEE]/10 ${
                                        isSorting ? 'cursor-not-allowed opacity-50' : ''
                                    }`}
                                >
                                    Create Sorted Array
                                </button>

                                <button
                                    onClick={() => {
                                        const reverseSortedArray = [...Array(arraySizeValues[arraySize])].map((_, i) => ({
                                            value: (arraySizeValues[arraySize] - i) * (100 / arraySizeValues[arraySize]),
                                            state: 'default' as const,
                                            key: `bar-${i}-${Date.now()}`,
                                        }));
                                        setArray(reverseSortedArray);
                                    }}
                                    disabled={isSorting}
                                    className={`w-full rounded-md border border-[#8847BB]/30 bg-transparent px-3 py-2 text-sm font-medium text-[#8847BB] transition-colors hover:bg-[#8847BB]/10 dark:border-[#F9BAEE]/30 dark:text-[#F9BAEE] dark:hover:bg-[#F9BAEE]/10 ${
                                        isSorting ? 'cursor-not-allowed opacity-50' : ''
                                    }`}
                                >
                                    Create Reverse Sorted Array
                                </button>

                                <button
                                    onClick={() => {
                                        // Create array with few unique values (good for testing counting/radix sorts)
                                        const fewUniqueArray = [...Array(arraySizeValues[arraySize])].map((_, i) => ({
                                            value: Math.floor(((i % 5) + 1) * 20),
                                            state: 'default' as const,
                                            key: `bar-${i}-${Date.now()}`,
                                        }));
                                        // Shuffle the array
                                        for (let i = fewUniqueArray.length - 1; i > 0; i--) {
                                            const j = Math.floor(Math.random() * (i + 1));
                                            [fewUniqueArray[i], fewUniqueArray[j]] = [fewUniqueArray[j], fewUniqueArray[i]];
                                        }
                                        setArray(fewUniqueArray);
                                    }}
                                    disabled={isSorting}
                                    className={`w-full rounded-md border border-[#8847BB]/30 bg-transparent px-3 py-2 text-sm font-medium text-[#8847BB] transition-colors hover:bg-[#8847BB]/10 dark:border-[#F9BAEE]/30 dark:text-[#F9BAEE] dark:hover:bg-[#F9BAEE]/10 ${
                                        isSorting ? 'cursor-not-allowed opacity-50' : ''
                                    }`}
                                >
                                    Create Few Unique Values
                                </button>
                            </div>

                            {/* Algorithm Explanation */}
                            <div className="rounded-md bg-[#8847BB]/5 p-4 dark:bg-[#5E4290]/10">
                                <h3 className="mb-2 text-sm font-medium">How {algorithmInfo[selectedAlgorithm].title} Works</h3>
                                <div className="mb-4 text-xs text-[#706f6c] dark:text-[#A1A09A]">
                                    {selectedAlgorithm === 'bubble' && (
                                        <>
                                            <p className="mb-2">
                                                Bubble Sort repeatedly steps through the list, compares adjacent elements and swaps them if they are
                                                in the wrong order.
                                            </p>
                                            <ol className="ml-4 list-decimal space-y-1">
                                                <li>Start at the beginning of the array</li>
                                                <li>Compare the first two elements</li>
                                                <li>If the first is greater than the second, swap them</li>
                                                <li>Move to the next pair of elements and repeat</li>
                                                <li>After each pass, the largest element "bubbles" to the end</li>
                                                <li>Repeat until the array is sorted</li>
                                            </ol>
                                        </>
                                    )}

                                    {selectedAlgorithm === 'insertion' && (
                                        <>
                                            <p className="mb-2">
                                                Insertion Sort builds the final sorted array one item at a time by shifting elements as needed.
                                            </p>
                                            <ol className="ml-4 list-decimal space-y-1">
                                                <li>Start with the second element (assume first is sorted)</li>
                                                <li>Compare it with the previous elements</li>
                                                <li>If previous elements are greater, move them up to make space</li>
                                                <li>Insert the current element in the correct position</li>
                                                <li>Move to the next unsorted element and repeat</li>
                                                <li>Continue until all elements are sorted</li>
                                            </ol>
                                        </>
                                    )}

                                    {selectedAlgorithm === 'selection' && (
                                        <>
                                            <p className="mb-2">
                                                Selection Sort repeatedly finds the minimum element from the unsorted part and puts it at the
                                                beginning.
                                            </p>
                                            <ol className="ml-4 list-decimal space-y-1">
                                                <li>Find the smallest element in the unsorted array</li>
                                                <li>Swap it with the first unsorted element</li>
                                                <li>Move the boundary of the sorted area right by one</li>
                                                <li>Repeat until the entire array is sorted</li>
                                            </ol>
                                        </>
                                    )}

                                    {selectedAlgorithm === 'merge' && (
                                        <>
                                            <p className="mb-2">
                                                Merge Sort uses the divide-and-conquer approach to split, sort, and merge subarrays.
                                            </p>
                                            <ol className="ml-4 list-decimal space-y-1">
                                                <li>Divide the array into two halves</li>
                                                <li>Recursively sort each half</li>
                                                <li>Merge the sorted halves back together</li>
                                                <li>During merging, compare elements and place them in order</li>
                                                <li>Continue until the entire array is merged and sorted</li>
                                            </ol>
                                        </>
                                    )}

                                    {selectedAlgorithm === 'quick' && (
                                        <>
                                            <p className="mb-2">Quick Sort selects a 'pivot' element and partitions the array around it.</p>
                                            <ol className="ml-4 list-decimal space-y-1">
                                                <li>Choose a pivot element (usually rightmost)</li>
                                                <li>Place elements smaller than pivot to its left</li>
                                                <li>Place elements greater than pivot to its right</li>
                                                <li>The pivot is now in its final sorted position</li>
                                                <li>Recursively apply the above steps to both subarrays</li>
                                            </ol>
                                        </>
                                    )}
                                </div>
                                <div className="mt-4 text-center">
                                    <a
                                        href={`https://en.wikipedia.org/wiki/${algorithmInfo[selectedAlgorithm].title.replace(' ', '_')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs font-medium text-[#8847BB] hover:underline dark:text-[#F9BAEE]"
                                    >
                                        Learn more about {algorithmInfo[selectedAlgorithm].title}
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Comparison Table */}
                        <div className="mt-8 rounded-lg border bg-white p-6 shadow-sm dark:border-[#5E4290]/20 dark:bg-[#161615]">
                            <h2 className="mb-4 text-xl font-semibold">Algorithm Comparison</h2>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead>
                                        <tr>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Algorithm</th>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Best</th>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Average</th>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Worst</th>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Space</th>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Stable</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        <tr className={selectedAlgorithm === 'bubble' ? 'bg-[#8847BB]/10 dark:bg-[#5E4290]/20' : ''}>
                                            <td className="px-3 py-2 text-xs font-medium whitespace-nowrap">Bubble Sort</td>
                                            <td className="px-3 py-2 text-xs whitespace-nowrap">O(n)</td>
                                            <td className="px-3 py-2 text-xs whitespace-nowrap">O(n²)</td>
                                            <td className="px-3 py-2 text-xs whitespace-nowrap">O(n²)</td>
                                            <td className="px-3 py-2 text-xs whitespace-nowrap">O(1)</td>
                                            <td className="px-3 py-2 text-xs whitespace-nowrap text-green-500">Yes</td>
                                        </tr>
                                        <tr className={selectedAlgorithm === 'insertion' ? 'bg-[#8847BB]/10 dark:bg-[#5E4290]/20' : ''}>
                                            <td className="px-3 py-2 text-xs font-medium whitespace-nowrap">Insertion Sort</td>
                                            <td className="px-3 py-2 text-xs whitespace-nowrap">O(n)</td>
                                            <td className="px-3 py-2 text-xs whitespace-nowrap">O(n²)</td>
                                            <td className="px-3 py-2 text-xs whitespace-nowrap">O(n²)</td>
                                            <td className="px-3 py-2 text-xs whitespace-nowrap">O(1)</td>
                                            <td className="px-3 py-2 text-xs whitespace-nowrap text-green-500">Yes</td>
                                        </tr>
                                        <tr className={selectedAlgorithm === 'selection' ? 'bg-[#8847BB]/10 dark:bg-[#5E4290]/20' : ''}>
                                            <td className="px-3 py-2 text-xs font-medium whitespace-nowrap">Selection Sort</td>
                                            <td className="px-3 py-2 text-xs whitespace-nowrap">O(n²)</td>
                                            <td className="px-3 py-2 text-xs whitespace-nowrap">O(n²)</td>
                                            <td className="px-3 py-2 text-xs whitespace-nowrap">O(n²)</td>
                                            <td className="px-3 py-2 text-xs whitespace-nowrap">O(1)</td>
                                            <td className="px-3 py-2 text-xs whitespace-nowrap text-red-500">No</td>
                                        </tr>
                                        <tr className={selectedAlgorithm === 'merge' ? 'bg-[#8847BB]/10 dark:bg-[#5E4290]/20' : ''}>
                                            <td className="px-3 py-2 text-xs font-medium whitespace-nowrap">Merge Sort</td>
                                            <td className="px-3 py-2 text-xs whitespace-nowrap">O(n log n)</td>
                                            <td className="px-3 py-2 text-xs whitespace-nowrap">O(n log n)</td>
                                            <td className="px-3 py-2 text-xs whitespace-nowrap">O(n log n)</td>
                                            <td className="px-3 py-2 text-xs whitespace-nowrap">O(n)</td>
                                            <td className="px-3 py-2 text-xs whitespace-nowrap text-green-500">Yes</td>
                                        </tr>
                                        <tr className={selectedAlgorithm === 'quick' ? 'bg-[#8847BB]/10 dark:bg-[#5E4290]/20' : ''}>
                                            <td className="px-3 py-2 text-xs font-medium whitespace-nowrap">Quick Sort</td>
                                            <td className="px-3 py-2 text-xs whitespace-nowrap">O(n log n)</td>
                                            <td className="px-3 py-2 text-xs whitespace-nowrap">O(n log n)</td>
                                            <td className="px-3 py-2 text-xs whitespace-nowrap">O(n²)</td>
                                            <td className="px-3 py-2 text-xs whitespace-nowrap">O(log n)</td>
                                            <td className="px-3 py-2 text-xs whitespace-nowrap text-red-500">No</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Use Case Examples */}
                <div className="mt-16 rounded-lg border bg-white p-8 shadow-sm dark:border-[#5E4290]/20 dark:bg-[#161615]">
                    <h2 className="mb-6 text-2xl font-bold">When to Use Different Sorting Algorithms</h2>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <div className="rounded-lg bg-[#8847BB]/5 p-5 dark:bg-[#5E4290]/10">
                            <h3 className="mb-3 text-lg font-medium">Small Data Sets</h3>
                            <p className="text-[#706f6c] dark:text-[#A1A09A]">
                                For very small arrays (fewer than 20 elements), simple algorithms like{' '}
                                <span className="font-medium text-[#8847BB] dark:text-[#F9BAEE]">Insertion Sort</span> often outperform complex ones
                                due to lower overhead.
                            </p>
                        </div>

                        <div className="rounded-lg bg-[#8847BB]/5 p-5 dark:bg-[#5E4290]/10">
                            <h3 className="mb-3 text-lg font-medium">Nearly Sorted Data</h3>
                            <p className="text-[#706f6c] dark:text-[#A1A09A]">
                                When data is already partially sorted,{' '}
                                <span className="font-medium text-[#8847BB] dark:text-[#F9BAEE]">Insertion Sort</span> can be very efficient with O(n)
                                time complexity.
                            </p>
                        </div>

                        <div className="rounded-lg bg-[#8847BB]/5 p-5 dark:bg-[#5E4290]/10">
                            <h3 className="mb-3 text-lg font-medium">Limited Memory</h3>
                            <p className="text-[#706f6c] dark:text-[#A1A09A]">
                                In memory-constrained environments,{' '}
                                <span className="font-medium text-[#8847BB] dark:text-[#F9BAEE]">Selection Sort</span> or
                                <span className="font-medium text-[#8847BB] dark:text-[#F9BAEE]"> Insertion Sort</span> with O(1) space complexity
                                might be preferred.
                            </p>
                        </div>

                        <div className="rounded-lg bg-[#8847BB]/5 p-5 dark:bg-[#5E4290]/10">
                            <h3 className="mb-3 text-lg font-medium">Stable Sorting Needed</h3>
                            <p className="text-[#706f6c] dark:text-[#A1A09A]">
                                When you need to preserve the relative order of equal elements, choose{' '}
                                <span className="font-medium text-[#8847BB] dark:text-[#F9BAEE]">Merge Sort</span> or{' '}
                                <span className="font-medium text-[#8847BB] dark:text-[#F9BAEE]">Bubble Sort</span>.
                            </p>
                        </div>

                        <div className="rounded-lg bg-[#8847BB]/5 p-5 dark:bg-[#5E4290]/10">
                            <h3 className="mb-3 text-lg font-medium">General Purpose</h3>
                            <p className="text-[#706f6c] dark:text-[#A1A09A]">
                                For most applications with moderate to large data sets,
                                <span className="font-medium text-[#8847BB] dark:text-[#F9BAEE]"> Quick Sort</span> is often the algorithm of choice
                                due to its efficiency.
                            </p>
                        </div>

                        <div className="rounded-lg bg-[#8847BB]/5 p-5 dark:bg-[#5E4290]/10">
                            <h3 className="mb-3 text-lg font-medium">Guaranteed Performance</h3>
                            <p className="text-[#706f6c] dark:text-[#A1A09A]">
                                When you need guaranteed O(n log n) worst-case performance,
                                <span className="font-medium text-[#8847BB] dark:text-[#F9BAEE]"> Merge Sort</span> is preferable to Quick Sort.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Coming Next */}
                <div className="mt-8 rounded-lg border bg-gradient-to-br from-[#8847BB]/10 to-[#5E4290]/20 p-8 text-center dark:from-[#5E4290]/20 dark:to-[#8847BB]/10">
                    <h2 className="mb-4 text-2xl font-bold">Coming Next</h2>
                    <p className="mb-6 text-lg text-[#706f6c] dark:text-[#A1A09A]">
                        Stay tuned for more algorithm visualizations, including pathfinding algorithms, dynamic programming, and more complex data
                        structures!
                    </p>
                    <a
                        href="/utils/algo"
                        className="inline-block rounded-md bg-[#8847BB] px-6 py-3 text-white transition-colors hover:bg-[#7838a6] dark:bg-[#5E4290] dark:hover:bg-[#4e3578]"
                    >
                        Back to Algorithm Visualizers
                    </a>
                </div>
            </div>
        </UtilitiesLayout>
    );
}
