import { User } from '@/types';
import { Link } from '@inertiajs/react';
import { LogInIcon, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import SmoothScrollLink from '../ui/SmoothScrollLink';

interface NavBarProps {
    auth: {
        user: User | null;
    };
}

export default function NavBar({ auth }: NavBarProps) {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        <>
            <header
                className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
                    scrolled ? 'bg-[#FDFDFC]/90 py-2 shadow-lg shadow-[#8847BB]/25 backdrop-blur-md dark:bg-[#0a0a0a]/90' : 'bg-transparent py-4'
                }`}
            >
                <nav className="container mx-auto flex items-center justify-between px-4 sm:px-6">
                    <Link href="/" className="text-xl font-bold tracking-tight">
                        Jakub Palacký
                    </Link>

                    <div className="flex items-center gap-4 md:gap-8">
                        {/* Desktop Navigation */}
                        <div className="hidden space-x-8 md:flex">
                            <SmoothScrollLink href="/#about" className="text-sm transition-colors hover:text-[#8847BB] dark:hover:text-[#F9BAEE]">
                                About
                            </SmoothScrollLink>
                            <SmoothScrollLink href="/#skills" className="text-sm transition-colors hover:text-[#8847BB] dark:hover:text-[#F9BAEE]">
                                Skills
                            </SmoothScrollLink>
                            <SmoothScrollLink href="/#projects" className="text-sm transition-colors hover:text-[#8847BB] dark:hover:text-[#F9BAEE]">
                                Projects
                            </SmoothScrollLink>
                            <SmoothScrollLink href="/#contact" className="text-sm transition-colors hover:text-[#8847BB] dark:hover:text-[#F9BAEE]">
                                Contact
                            </SmoothScrollLink>
                            <Link href={route('apps.index')} className="text-sm transition-colors hover:text-[#8847BB] dark:hover:text-[#F9BAEE]">
                                Apps
                            </Link>
                            <Link href={route('public-polls.index')} className="text-sm transition-colors hover:text-[#8847BB] dark:hover:text-[#F9BAEE]">
                                Polls
                            </Link>
                        </div>

                        <div className="hidden border-l-2 border-[#19140035] md:block dark:border-[#3E3E3A]">&nbsp;</div>

                        <Link href={route('availability')} className="hidden md:block ...">
                            Availability
                        </Link>

                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="hidden rounded-md border border-[#19140035] px-5 py-1.5 text-sm leading-normal hover:border-[#1915014a] md:inline-block dark:border-[#3E3E3A] dark:hover:border-[#62605b]"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <Link
                                href={route('login')}
                                className="hidden rounded-md border border-transparent px-5 py-1.5 text-sm leading-normal hover:border-[#19140035] md:inline-block dark:hover:border-[#3E3E3A]"
                            >
                                <LogInIcon className="size-4 text-center text-[#706f6c] dark:text-[#A1A09A]" />
                            </Link>
                        )}

                        <button
                            onClick={toggleDarkMode}
                            className="rounded-full p-2 text-[#706f6c] hover:bg-[#f5f5f3] hover:text-[#1b1b18] dark:text-[#A1A09A] dark:hover:bg-[#1C1C1A] dark:hover:text-[#EDEDEC]"
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

                        {/* Mobile menu button */}
                        <button
                            className="rounded-md p-2 text-gray-700 hover:bg-gray-100 md:hidden dark:text-gray-300 dark:hover:bg-gray-800"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            <Menu size={24} />
                        </button>
                    </div>
                </nav>
            </header>
            
            {/* Mobile Navigation Menu - Positioned outside header */}
            <div 
                className={`fixed inset-0 z-[100] transition-opacity duration-300 ease-in-out ${
                    mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`} 
                style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, height: '100vh' }}
            >
                <div className="fixed inset-0 bg-black/70" onClick={() => setMobileMenuOpen(false)}></div>
                <div className={`fixed top-0 right-0 bottom-0 z-10 h-full w-64 overflow-y-auto bg-[#FDFDFC] shadow-xl dark:bg-[#0a0a0a] transition-transform duration-300 ease-in-out ${
                    mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                }`}>
                    <div className="flex h-full flex-col overflow-y-auto p-5">
                        <div className="mb-8 flex justify-between">
                            <h2 className="text-lg font-bold">Menu</h2>
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <nav className="flex flex-col space-y-4">
                            <SmoothScrollLink
                                href="/#about"
                                className="py-2 text-sm transition-colors hover:text-[#8847BB] dark:hover:text-[#F9BAEE]"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                About
                            </SmoothScrollLink>
                            <SmoothScrollLink
                                href="/#skills"
                                className="py-2 text-sm transition-colors hover:text-[#8847BB] dark:hover:text-[#F9BAEE]"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Skills
                            </SmoothScrollLink>
                            <SmoothScrollLink
                                href="/#projects"
                                className="py-2 text-sm transition-colors hover:text-[#8847BB] dark:hover:text-[#F9BAEE]"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Projects
                            </SmoothScrollLink>
                            <SmoothScrollLink
                                href="/#contact"
                                className="py-2 text-sm transition-colors hover:text-[#8847BB] dark:hover:text-[#F9BAEE]"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Contact
                            </SmoothScrollLink>
                            <Link
                                href={route('apps.index')}
                                className="py-2 text-sm transition-colors hover:text-[#8847BB] dark:hover:text-[#F9BAEE]"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Apps
                            </Link>
                            <Link
                                href={route('public-polls.index')}
                                className="py-2 text-sm transition-colors hover:text-[#8847BB] dark:hover:text-[#F9BAEE]"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Polls
                            </Link>
                            <Link
                                href={route('availability')}
                                className="py-2 text-sm transition-colors hover:text-[#8847BB] dark:hover:text-[#F9BAEE]"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Availability
                            </Link>
                            
                            <div className="my-2 border-t border-[#19140035] dark:border-[#3E3E3A]"></div>
                            
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="rounded-md border border-[#19140035] px-5 py-2 text-center text-sm leading-normal hover:border-[#1915014a] dark:border-[#3E3E3A] dark:hover:border-[#62605b]"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <Link
                                    href={route('login')}
                                    className="flex items-center justify-center rounded-md border border-[#19140035] px-5 py-2 text-sm leading-normal hover:border-[#1915014a] dark:border-[#3E3E3A] dark:hover:border-[#62605b]"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <LogInIcon className="mr-2 size-4 text-[#706f6c] dark:text-[#A1A09A]" />
                                    <span>Login</span>
                                </Link>
                            )}
                        </nav>
                    </div>
                </div>
            </div>
        </>
    );
}
