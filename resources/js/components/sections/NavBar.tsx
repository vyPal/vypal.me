import { User } from '@/types';
import { Link } from '@inertiajs/react';
import { LogInIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

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
                        <a href="#about" className="text-sm transition-colors hover:text-[#8847BB] dark:hover:text-[#F9BAEE]">
                            About
                        </a>
                        <a href="#skills" className="text-sm transition-colors hover:text-[#8847BB] dark:hover:text-[#F9BAEE]">
                            Skills
                        </a>
                        <a href="#projects" className="text-sm transition-colors hover:text-[#8847BB] dark:hover:text-[#F9BAEE]">
                            Projects
                        </a>
                        <a href="#contact" className="text-sm transition-colors hover:text-[#8847BB] dark:hover:text-[#F9BAEE]">
                            Contact
                        </a>
                    </div>

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
                </div>
            </nav>
        </header>
    );
}
