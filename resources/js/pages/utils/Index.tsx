import UtilitiesLayout from '@/layouts/UtilitiesLayout';
import { Head, Link } from '@inertiajs/react';

export default function UtilitiesIndex() {
    // Define all your utilities with descriptions and icons
    const utilities = [
        {
            name: 'Color Palette Generator',
            description: 'Create harmonious color schemes for your design projects',
            path: '/utils/color-palette',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                    />
                </svg>
            ),
        } /*
        {
            name: 'CSS Flexbox Playground',
            description: 'Interactively learn and experiment with CSS Flexbox properties',
            path: '/utils/flexbox-playground',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                </svg>
            ),
        },
        {
            name: 'SVG Path Animator',
            description: 'Create and animate SVG paths with an interactive editor',
            path: '/utils/svg-animator',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                    />
                </svg>
            ),
        },
        {
            name: 'Code Formatter',
            description: 'Format and beautify your code snippets with syntax highlighting',
            path: '/utils/code-formatter',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
            ),
        },
        {
            name: 'Markdown Preview',
            description: 'Write and preview Markdown with real-time rendering',
            path: '/utils/markdown-preview',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                </svg>
            ),
        },
        {
            name: 'JSON Formatter',
            description: 'Format, validate and visualize JSON data',
            path: '/utils/json-formatter',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
                    />
                </svg>
            ),
        },
        {
            name: 'Image Optimizer',
            description: 'Optimize and resize images for web use',
            path: '/utils/image-optimizer',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                </svg>
            ),
        },
        {
            name: 'Regex Tester',
            description: 'Test and debug regular expressions with visual feedback',
            path: '/utils/regex-tester',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                </svg>
            ),
        },*/,
    ];

    return (
        <UtilitiesLayout>
            <Head title="Developer Utilities | Your Name" />

            <div className="mx-auto max-w-6xl">
                <div className="mb-12 text-center">
                    <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
                        Developer <span className="text-[#8847BB] dark:text-[#F9BAEE]">Utilities</span>
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-[#706f6c] dark:text-[#A1A09A]">
                        A collection of handy tools for web developers and designers. These utilities are built to help streamline your workflow and
                        solve common problems.
                    </p>
                </div>

                {/* Featured utilities */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {utilities.map((utility) => (
                        <Link
                            key={utility.path}
                            href={utility.path}
                            className="group rounded-lg border bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-[#5E4290]/20 dark:bg-[#161615]"
                        >
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#8847BB]/10 text-[#8847BB] transition-colors group-hover:bg-[#8847BB]/20 dark:bg-[#5E4290]/20 dark:text-[#F9BAEE] dark:group-hover:bg-[#5E4290]/30">
                                {utility.icon}
                            </div>
                            <h2 className="mb-2 text-xl font-medium group-hover:text-[#8847BB] dark:group-hover:text-[#F9BAEE]">{utility.name}</h2>
                            <p className="text-[#706f6c] dark:text-[#A1A09A]">{utility.description}</p>
                        </Link>
                    ))}
                </div>

                {/* Why use these utilities */}
                <div className="mt-20 rounded-lg border bg-white p-8 shadow-sm dark:border-[#5E4290]/20 dark:bg-[#161615]">
                    <h2 className="mb-6 text-2xl font-bold">
                        Why Use These <span className="text-[#8847BB] dark:text-[#F9BAEE]">Utilities</span>?
                    </h2>

                    <div className="grid gap-8 md:grid-cols-3">
                        <div>
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#8847BB]/10 text-[#8847BB] dark:bg-[#5E4290]/20 dark:text-[#F9BAEE]">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="mb-2 text-lg font-medium">Productivity Boost</h3>
                            <p className="text-[#706f6c] dark:text-[#A1A09A]">
                                These tools help automate repetitive tasks and streamline your workflow, saving you valuable development time.
                            </p>
                        </div>

                        <div>
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#8847BB]/10 text-[#8847BB] dark:bg-[#5E4290]/20 dark:text-[#F9BAEE]">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                    />
                                </svg>
                            </div>
                            <h3 className="mb-2 text-lg font-medium">Privacy-Focused</h3>
                            <p className="text-[#706f6c] dark:text-[#A1A09A]">
                                All processing happens in your browser. Your data never leaves your device, ensuring your code and designs remain
                                private.
                            </p>
                        </div>

                        <div>
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#8847BB]/10 text-[#8847BB] dark:bg-[#5E4290]/20 dark:text-[#F9BAEE]">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                                    />
                                </svg>
                            </div>
                            <h3 className="mb-2 text-lg font-medium">Customizable</h3>
                            <p className="text-[#706f6c] dark:text-[#A1A09A]">
                                Each utility is designed to be flexible and adaptable to your specific needs and preferences.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Frequently asked questions */}
                <div className="mt-16">
                    <h2 className="mb-8 text-2xl font-bold">
                        Frequently Asked <span className="text-[#8847BB] dark:text-[#F9BAEE]">Questions</span>
                    </h2>

                    <div className="space-y-6">
                        <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-[#5E4290]/20 dark:bg-[#161615]">
                            <h3 className="mb-2 text-lg font-medium">Are these utilities free to use?</h3>
                            <p className="text-[#706f6c] dark:text-[#A1A09A]">
                                Yes, all utilities are completely free and open-source. Feel free to use them for personal or commercial projects.
                            </p>
                        </div>

                        <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-[#5E4290]/20 dark:bg-[#161615]">
                            <h3 className="mb-2 text-lg font-medium">Can I suggest a new utility or feature?</h3>
                            <p className="text-[#706f6c] dark:text-[#A1A09A]">
                                Absolutely! I'm always looking to expand this collection. Please reach out through the contact form with your
                                suggestions.
                            </p>
                        </div>

                        <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-[#5E4290]/20 dark:bg-[#161615]">
                            <h3 className="mb-2 text-lg font-medium">Is my data secure when using these tools?</h3>
                            <p className="text-[#706f6c] dark:text-[#A1A09A]">
                                All utilities process data directly in your browser. Your code, designs, and other information never reach any server,
                                ensuring complete privacy.
                            </p>
                        </div>

                        <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-[#5E4290]/20 dark:bg-[#161615]">
                            <h3 className="mb-2 text-lg font-medium">Do these tools work offline?</h3>
                            <p className="text-[#706f6c] dark:text-[#A1A09A]">
                                While you need an internet connection to initially load the page, many of the tools will continue to function even if
                                you lose connection afterward.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Call to action */}
                <div className="mt-16 rounded-lg bg-gradient-to-br from-[#8847BB]/10 to-[#5E4290]/20 p-8 text-center dark:from-[#5E4290]/20 dark:to-[#8847BB]/10">
                    <h2 className="mb-4 text-2xl font-bold">Have a Tool in Mind?</h2>
                    <p className="mb-6 text-lg text-[#706f6c] dark:text-[#A1A09A]">
                        If you have an idea for a developer utility that would be useful, let me know!
                    </p>
                    <a
                        href="/#contact"
                        className="inline-block rounded-md bg-[#8847BB] px-6 py-3 text-white transition-colors hover:bg-[#7838a6] dark:bg-[#5E4290] dark:hover:bg-[#4e3578]"
                    >
                        Suggest a Tool
                    </a>
                </div>
            </div>
        </UtilitiesLayout>
    );
}
