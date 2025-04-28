import AppLogo from '@/components/app-logo';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';

interface UtilitiesLayoutProps {
    children: React.ReactNode;
    currentUtility?: string;
}

export default function UtilitiesLayout({ children, currentUtility }: UtilitiesLayoutProps) {
    const { auth } = usePage<SharedData>().props;
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Detect dark mode on initial load
    useEffect(() => {
        const isDark = document.documentElement.classList.contains('dark');
        setIsDarkMode(isDark);
    }, []);

    // Toggle dark mode
    const toggleDarkMode = () => {
        if (isDarkMode) {
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
        } else {
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
        }
        setIsDarkMode(!isDarkMode);
    };

    // Define all available utilities
    const utilities = [
        { name: 'Color Palette Generator', path: '/utils/color-palette' },
        { name: 'CSS Flexbox Playground', path: '/utils/flexbox-playground' },
        { name: 'SVG Path Animator', path: '/utils/svg-animator' },
        { name: 'Algorithm Visualizer', path: '/utils/algo' },
        /*{ name: 'Code Formatter', path: '/utils/code-formatter' },
        { name: 'Markdown Preview', path: '/utils/markdown-preview' },
        { name: 'JSON Formatter', path: '/utils/json-formatter' },
        { name: 'Image Optimizer', path: '/utils/image-optimizer' },
        { name: 'Regex Tester', path: '/utils/regex-tester' },*/
    ];

    return (
        <div className="flex min-h-screen flex-col bg-[#FDFDFC] text-[#1b1b18] dark:bg-[#0a0a0a] dark:text-[#EDEDEC]">
            {/* Navigation */}
            <header className="sticky top-0 z-50 border-b border-[#e3e3e0] bg-[#FDFDFC]/90 backdrop-blur-md dark:border-[#3E3E3A] dark:bg-[#0a0a0a]/90">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo and home link */}
                        <div className="flex items-center">
                            <Link href="/" prefetch className="flex items-center">
                                <AppLogo />
                            </Link>
                            <Link href="/utils" className="ml-3 text-lg font-medium transition-colors hover:text-[#8847BB] dark:hover:text-[#F9BAEE]">
                                Utilities
                            </Link>
                        </div>

                        {/* Desktop navigation */}
                        <nav className="hidden md:block">
                            <ul className="flex items-center space-x-1">
                                {utilities.map((utility) => (
                                    <li key={utility.path}>
                                        <Link
                                            href={utility.path}
                                            className={`rounded-md px-3 py-2 text-sm transition-colors hover:bg-[#f5f5f3] dark:hover:bg-[#1C1C1A] ${
                                                currentUtility === utility.name
                                                    ? 'font-medium text-[#8847BB] dark:text-[#F9BAEE]'
                                                    : 'text-[#706f6c] hover:text-[#1b1b18] dark:text-[#A1A09A] dark:hover:text-[#EDEDEC]'
                                            }`}
                                        >
                                            {utility.name}
                                        </Link>
                                    </li>
                                ))}
                                <li>
                                    <button
                                        onClick={toggleDarkMode}
                                        className="ml-2 rounded-full p-2 text-[#706f6c] hover:bg-[#f5f5f3] hover:text-[#1b1b18] dark:text-[#A1A09A] dark:hover:bg-[#1C1C1A] dark:hover:text-[#EDEDEC]"
                                        aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                                    >
                                        {isDarkMode ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                            </svg>
                                        )}
                                    </button>
                                </li>
                                {auth.user && (
                                    <li>
                                        <Link
                                            href={route('dashboard')}
                                            className="ml-2 rounded-md border border-[#8847BB]/30 px-4 py-2 text-sm hover:border-[#8847BB]/50 dark:border-[#5E4290]/50 dark:hover:border-[#5E4290]"
                                        >
                                            Dashboard
                                        </Link>
                                    </li>
                                )}
                            </ul>
                        </nav>

                        {/* Mobile menu button */}
                        <div className="flex items-center md:hidden">
                            <button
                                onClick={toggleDarkMode}
                                className="mr-2 rounded-full p-2 text-[#706f6c] hover:bg-[#f5f5f3] hover:text-[#1b1b18] dark:text-[#A1A09A] dark:hover:bg-[#1C1C1A] dark:hover:text-[#EDEDEC]"
                                aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                            >
                                {isDarkMode ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path
                                            fillRule="evenodd"
                                            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                    </svg>
                                )}
                            </button>
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="inline-flex items-center justify-center rounded-md p-2 text-[#706f6c] hover:bg-[#f5f5f3] hover:text-[#1b1b18] dark:text-[#A1A09A] dark:hover:bg-[#1C1C1A] dark:hover:text-[#EDEDEC]"
                            >
                                <span className="sr-only">Open main menu</span>
                                {isMenuOpen ? (
                                    <svg
                                        className="h-6 w-6"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                ) : (
                                    <svg
                                        className="h-6 w-6"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu, show/hide based on menu state */}
                {isMenuOpen && (
                    <div className="md:hidden">
                        <div className="space-y-1 px-2 pt-2 pb-3">
                            {utilities.map((utility) => (
                                <Link
                                    key={utility.path}
                                    href={utility.path}
                                    className={`block rounded-md px-3 py-2 text-base ${
                                        currentUtility === utility.name
                                            ? 'font-medium text-[#8847BB] dark:text-[#F9BAEE]'
                                            : 'text-[#706f6c] hover:bg-[#f5f5f3] hover:text-[#1b1b18] dark:text-[#A1A09A] dark:hover:bg-[#1C1C1A] dark:hover:text-[#EDEDEC]'
                                    }`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {utility.name}
                                </Link>
                            ))}
                            {auth.user && (
                                <Link
                                    href={route('dashboard')}
                                    className="mt-4 block rounded-md border border-[#8847BB]/30 px-4 py-2 text-base hover:border-[#8847BB]/50 dark:border-[#5E4290]/50 dark:hover:border-[#5E4290]"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Dashboard
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-1">
                <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">{children}</div>
            </main>

            {/* Footer */}
            <footer className="border-t border-[#e3e3e0] bg-[#FDFDFC] py-6 dark:border-[#3E3E3A] dark:bg-[#0a0a0a]">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
                        <div className="text-sm text-[#706f6c] dark:text-[#A1A09A]">
                            © {new Date().getFullYear()} Your Name. All rights reserved.
                        </div>
                        <div className="flex space-x-6">
                            <a
                                href="https://github.com/yourusername"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#706f6c] hover:text-[#8847BB] dark:text-[#A1A09A] dark:hover:text-[#F9BAEE]"
                            >
                                <span className="sr-only">GitHub</span>
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path
                                        fillRule="evenodd"
                                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </a>
                            <a
                                href="https://twitter.com/yourusername"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#706f6c] hover:text-[#8847BB] dark:text-[#A1A09A] dark:hover:text-[#F9BAEE]"
                            >
                                <span className="sr-only">Twitter</span>
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                </svg>
                            </a>
                            <a
                                href="https://linkedin.com/in/yourusername"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#706f6c] hover:text-[#8847BB] dark:text-[#A1A09A] dark:hover:text-[#F9BAEE]"
                            >
                                <span className="sr-only">LinkedIn</span>
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
