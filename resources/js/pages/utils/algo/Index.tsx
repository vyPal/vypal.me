import SEO from '@/components/SEO';
import UtilitiesLayout from '@/layouts/UtilitiesLayout';
import { Link } from '@inertiajs/react';

export default function AlgorithmVisualizerIndex() {
    const algorithmCategories = [
        {
            name: 'Sorting Algorithms',
            description: 'Visualize how different sorting algorithms organize data in ascending or descending order',
            path: '/utils/algo/sorting',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
            ),
            algorithms: ['Bubble Sort', 'Quick Sort', 'Merge Sort', 'Insertion Sort', 'Selection Sort'],
        },
        {
            name: 'Pathfinding Algorithms',
            description: 'See how different algorithms find the shortest path between two points in a grid',
            path: '/utils/algo/pathfinding',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                </svg>
            ),
            algorithms: ['A* Search', "Dijkstra's Algorithm", 'Breadth-First Search', 'Depth-First Search', 'FloodFill', 'Greedy Best-First Search'],
        },
    ];

    return (
        <UtilitiesLayout>
            <SEO
                title="Algorithm Visualizer | vyPal.me Utilities"
                description="Interactive visualizations of common algorithms to understand how they work. Watch algorithms in action step-by-step with detailed explanations."
                keywords="algorithms, visualizer, sorting algorithms, pathfinding, educational tools, computer science, interactive learning"
                tags={['algorithms', 'visualization', 'sorting', 'pathfinding', 'educational', 'interactive']}
            />

            <div className="mx-auto max-w-6xl">
                <div className="mb-12 text-center">
                    <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
                        Algorithm <span className="text-[#8847BB] dark:text-[#F9BAEE]">Visualizer</span>
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-[#706f6c] dark:text-[#A1A09A]">
                        Watch how algorithms work step-by-step through interactive visualizations. These tools help you understand the inner workings
                        of common computer science algorithms.
                    </p>
                </div>

                {/* Algorithm Categories */}
                <div className="grid gap-6 md:grid-cols-2">
                    {algorithmCategories.map((category) => (
                        <Link
                            key={category.path}
                            href={category.path}
                            className="group relative overflow-hidden rounded-lg border bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-[#5E4290]/20 dark:bg-[#161615]"
                        >
                            <div className="flex items-start gap-6">
                                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-[#8847BB]/10 text-[#8847BB] transition-colors group-hover:bg-[#8847BB]/20 dark:bg-[#5E4290]/20 dark:text-[#F9BAEE] dark:group-hover:bg-[#5E4290]/30">
                                    {category.icon}
                                </div>
                                <div>
                                    <h2 className="mb-2 text-xl font-medium group-hover:text-[#8847BB] dark:group-hover:text-[#F9BAEE]">
                                        {category.name}
                                    </h2>
                                    <p className="mb-4 text-[#706f6c] dark:text-[#A1A09A]">{category.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {category.algorithms.map((algo) => (
                                            <span
                                                key={algo}
                                                className="rounded-full bg-[#8847BB]/10 px-3 py-1 text-sm text-[#8847BB] dark:bg-[#5E4290]/20 dark:text-[#F9BAEE]"
                                            >
                                                {algo}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-[#8847BB] to-[#5E4290] transition-all duration-300 group-hover:w-full dark:from-[#F9BAEE] dark:to-[#8847BB]"></div>
                        </Link>
                    ))}
                </div>

                {/* How It Works */}
                <div className="mt-16 rounded-lg border bg-white p-8 shadow-sm dark:border-[#5E4290]/20 dark:bg-[#161615]">
                    <h2 className="mb-6 text-2xl font-bold">
                        How It <span className="text-[#8847BB] dark:text-[#F9BAEE]">Works</span>
                    </h2>

                    <div className="grid gap-8 md:grid-cols-3">
                        <div>
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#8847BB]/10 text-[#8847BB] dark:bg-[#5E4290]/20 dark:text-[#F9BAEE]">
                                <span className="text-xl font-bold">1</span>
                            </div>
                            <h3 className="mb-2 text-lg font-medium">Choose an Algorithm</h3>
                            <p className="text-[#706f6c] dark:text-[#A1A09A]">
                                Select from a variety of algorithm categories and specific implementations
                            </p>
                        </div>

                        <div>
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#8847BB]/10 text-[#8847BB] dark:bg-[#5E4290]/20 dark:text-[#F9BAEE]">
                                <span className="text-xl font-bold">2</span>
                            </div>
                            <h3 className="mb-2 text-lg font-medium">Configure Parameters</h3>
                            <p className="text-[#706f6c] dark:text-[#A1A09A]">
                                Adjust inputs, speed, and visualization options to customize the experience
                            </p>
                        </div>

                        <div>
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#8847BB]/10 text-[#8847BB] dark:bg-[#5E4290]/20 dark:text-[#F9BAEE]">
                                <span className="text-xl font-bold">3</span>
                            </div>
                            <h3 className="mb-2 text-lg font-medium">Watch & Learn</h3>
                            <p className="text-[#706f6c] dark:text-[#A1A09A]">
                                Observe the algorithm in action with step-by-step animation and explanation
                            </p>
                        </div>
                    </div>
                </div>

                {/* Why Visualize Algorithms */}
                <div className="mt-16">
                    <h2 className="mb-8 text-2xl font-bold">
                        Why <span className="text-[#8847BB] dark:text-[#F9BAEE]">Visualize</span> Algorithms?
                    </h2>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-[#5E4290]/20 dark:bg-[#161615]">
                            <h3 className="mb-2 text-lg font-medium">Enhanced Understanding</h3>
                            <p className="text-[#706f6c] dark:text-[#A1A09A]">
                                Visual representation helps cement algorithm concepts better than code or explanations alone. Seeing the step-by-step
                                process reveals how algorithms actually manipulate data.
                            </p>
                        </div>

                        <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-[#5E4290]/20 dark:bg-[#161615]">
                            <h3 className="mb-2 text-lg font-medium">Algorithm Comparison</h3>
                            <p className="text-[#706f6c] dark:text-[#A1A09A]">
                                Compare different algorithms solving the same problem to understand trade-offs in efficiency, implementation
                                complexity, and performance characteristics.
                            </p>
                        </div>

                        <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-[#5E4290]/20 dark:bg-[#161615]">
                            <h3 className="mb-2 text-lg font-medium">Learning Aid</h3>
                            <p className="text-[#706f6c] dark:text-[#A1A09A]">
                                Whether you're a student, preparing for coding interviews, or a curious developer, visualizations provide intuitive
                                insights into complex algorithmic concepts.
                            </p>
                        </div>

                        <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-[#5E4290]/20 dark:bg-[#161615]">
                            <h3 className="mb-2 text-lg font-medium">Edge Case Exploration</h3>
                            <p className="text-[#706f6c] dark:text-[#A1A09A]">
                                Interactively test how algorithms behave with different inputs, including edge cases, to better understand their
                                limitations and optimal use cases.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Featured Algorithm */}
                <div className="mt-16 overflow-hidden rounded-lg border bg-white p-8 shadow-sm dark:border-[#5E4290]/20 dark:bg-[#161615]">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div className="mb-6 lg:mb-0 lg:max-w-md">
                            <h2 className="mb-4 text-2xl font-bold">
                                Featured: <span className="text-[#8847BB] dark:text-[#F9BAEE]">Sorting Algorithms</span>
                            </h2>
                            <p className="mb-6 text-[#706f6c] dark:text-[#A1A09A]">
                                Sorting is a fundamental operation in computer science. Our interactive visualizer lets you see how different
                                algorithms approach the task of ordering elements with varying levels of efficiency.
                            </p>
                            <Link
                                href="/utils/algo/sorting"
                                className="inline-block rounded-md bg-[#8847BB] px-6 py-3 text-white transition-colors hover:bg-[#7838a6] dark:bg-[#5E4290] dark:hover:bg-[#4e3578]"
                            >
                                Try Sorting Visualizer
                            </Link>
                        </div>
                        <div className="relative h-48 w-full overflow-hidden rounded-lg bg-slate-800 lg:h-64 lg:w-1/2">
                            <div className="absolute inset-0 flex items-end justify-around pb-10">
                                {/* Sample visualization preview */}
                                {Array.from({ length: 20 }).map((_, i) => {
                                    const height = 30 + Math.random() * 70; // Random bar heights
                                    return (
                                        <div
                                            key={i}
                                            className="w-[4%] bg-gradient-to-t from-[#5E4290] to-[#8847BB] dark:from-[#8847BB] dark:to-[#F9BAEE]"
                                            style={{ height: `${height}%` }}
                                        ></div>
                                    );
                                })}
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="rounded-full bg-black/60 px-4 py-2 text-white">Preview Animation</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </UtilitiesLayout>
    );
}
