import { User } from '@/types';
import { Link } from '@inertiajs/react';
import { LogInIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import SmoothScrollLink from '../ui/SmoothScrollLink';

interface NavBarProps {
    auth: {
        user: User | null;
    };
}

export default function NavBar({ auth }: NavBarProps) {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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

    return (
        <header
            className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
                scrolled ? 'bg-[#FDFDFC]/90 py-2 shadow-lg shadow-[#8847BB]/25 backdrop-blur-md dark:bg-[#0a0a0a]/90' : 'py-4'
            }`}
        >
            <nav className="container mx-auto flex items-center justify-between px-6">
                <Link href="/" className="text-xl font-bold tracking-tight">
                    Jakub Palacký
                </Link>

                <div className="flex items-center gap-8">
                    <div className="hidden space-x-8 md:flex">
                        <SmoothScrollLink href="#about" className="text-sm transition-colors hover:text-[#8847BB] dark:hover:text-[#F9BAEE]">
                            About
                        </SmoothScrollLink>
                        <SmoothScrollLink href="#skills" className="text-sm transition-colors hover:text-[#8847BB] dark:hover:text-[#F9BAEE]">
                            Skills
                        </SmoothScrollLink>
                        <SmoothScrollLink href="#projects" className="text-sm transition-colors hover:text-[#8847BB] dark:hover:text-[#F9BAEE]">
                            Projects
                        </SmoothScrollLink>
                        <SmoothScrollLink href="#contact" className="text-sm transition-colors hover:text-[#8847BB] dark:hover:text-[#F9BAEE]">
                            Contact
                        </SmoothScrollLink>
                    </div>

                    <div className="border-l-2 border-[#19140035] dark:border-[#3E3E3A]">&nbsp;</div>

                    <Link href={route('availability')} className="...">
                        Availability
                    </Link>

                    {auth.user ? (
                        <Link
                            href={route('dashboard')}
                            className="inline-block rounded-md border border-[#19140035] px-5 py-1.5 text-sm leading-normal hover:border-[#1915014a] dark:border-[#3E3E3A] dark:hover:border-[#62605b]"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <Link
                            href={route('login')}
                            className="inline-block rounded-md border border-transparent px-5 py-1.5 text-sm leading-normal hover:border-[#19140035] dark:hover:border-[#3E3E3A]"
                        >
                            <LogInIcon className="size-4 text-center text-[#706f6c] dark:text-[#A1A09A]" />
                        </Link>
                    )}

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
                </div>
            </nav>
        </header>
    );
}
