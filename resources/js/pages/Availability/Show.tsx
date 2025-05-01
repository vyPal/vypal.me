import CountdownTimer from '@/components/CountdownTimer';
import NavBar from '@/components/sections/NavBar';
import SEO from '@/components/SEO';
import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';

interface BacklogLink {
    id: number;
    title: string;
    url: string;
}

interface BacklogItem {
    id: number;
    title: string;
    type: 'website' | 'blog' | 'social' | 'code' | 'other' | 'separator';
    url?: string;
    description?: string;
    sublinks?: BacklogLink[];
}

interface AvailabilitySettings {
    available_from: string | null;
    available_until: string | null;
    is_available_now: boolean;
    busy_message: string;
    available_message: string;
    project_backlog: BacklogItem[] | null;
}

interface Props {
    settings: AvailabilitySettings;
    currentTime: string;
}

export default function Show({ settings, currentTime }: Props) {
    const { auth } = usePage<SharedData>().props;
    const [timeRemaining, setTimeRemaining] = useState<number>(0);
    const [isAvailable, setIsAvailable] = useState<boolean>(settings.is_available_now);

    useEffect(() => {
        if (settings.is_available_now) {
            setIsAvailable(true);
            return;
        }

        // Calculate availability based on time range
        const now = new Date(currentTime);
        const availableFrom = settings.available_from ? new Date(settings.available_from) : null;
        const availableUntil = settings.available_until ? new Date(settings.available_until) : null;

        // If both dates are set, check if current time falls within range
        if (availableFrom && availableUntil) {
            setIsAvailable(now >= availableFrom && now <= availableUntil);

            if (now < availableFrom) {
                // Calculate time until available
                setTimeRemaining(availableFrom.getTime() - now.getTime());
            }
        }
        // If only start date is set
        else if (availableFrom) {
            setIsAvailable(now >= availableFrom);

            if (now < availableFrom) {
                // Calculate time until available
                setTimeRemaining(availableFrom.getTime() - now.getTime());
            }
        }
        // Default to the is_available_now setting
        else {
            setIsAvailable(settings.is_available_now);
        }
    }, [settings, currentTime]);

    // Helper function to render appropriate icon based on link type
    const renderLinkIcon = (type: string) => {
        switch (type) {
            case 'website':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                    </svg>
                );
            case 'blog':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M5 3a1 1 0 000 2c5.523 0 10 4.477 10 10a1 1 0 102 0C17 8.373 11.627 3 5 3z" />
                        <path d="M4 9a1 1 0 011-1 7 7 0 017 7 1 1 0 11-2 0 5 5 0 00-5-5 1 1 0 01-1-1zM3 15a2 2 0 114 0 2 2 0 01-4 0z" />
                    </svg>
                );
            case 'social':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                );
            case 'code':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path
                            fillRule="evenodd"
                            d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                );
            default:
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path
                            fillRule="evenodd"
                            d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                );
        }
    };

    // Function to render backlog item
    const renderBacklogItem = (item: BacklogItem) => {
        if (item.type === 'separator') {
            return (
                <div key={item.id} className="py-2">
                    <div className="flex items-center">
                        <div className="flex-grow border-t border-gray-600"></div>
                        {item.title && <span className="mx-2 text-sm font-semibold tracking-wider text-gray-400 uppercase">{item.title}</span>}
                        <div className="flex-grow border-t border-gray-600"></div>
                    </div>
                </div>
            );
        }

        // Color classes based on link type
        const getLinkColors = () => {
            switch (item.type) {
                case 'website':
                    return 'border-blue-700 hover:border-blue-500 group-hover:text-blue-400';
                case 'blog':
                    return 'border-green-700 hover:border-green-500 group-hover:text-green-400';
                case 'social':
                    return 'border-purple-700 hover:border-purple-500 group-hover:text-purple-400';
                case 'code':
                    return 'border-amber-700 hover:border-amber-500 group-hover:text-amber-400';
                default:
                    return 'border-gray-700 hover:border-gray-500 group-hover:text-gray-300';
            }
        };

        return (
            <div
                key={item.id}
                className={`block transform rounded-lg border bg-gray-800 p-4 transition-all duration-300 hover:bg-gray-700 hover:shadow-lg ${getLinkColors()}`}
            >
                {/* Main link content */}
                {item.url ? (
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="group flex items-center">
                        <div className="mr-3 text-gray-400 transition-colors group-hover:text-inherit">{renderLinkIcon(item.type)}</div>
                        <div className="flex-grow">
                            <h2 className="font-semibold text-white transition-colors group-hover:text-inherit">{item.title}</h2>
                            {item.description && <p className="text-sm text-gray-400">{item.description}</p>}
                        </div>
                        <div className="text-gray-400 transition-colors group-hover:text-inherit">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                            </svg>
                        </div>
                    </a>
                ) : (
                    <div className="group flex items-center">
                        <div className="mr-3 text-gray-400">{renderLinkIcon(item.type)}</div>
                        <div className="flex-grow">
                            <h2 className="font-semibold text-white">{item.title}</h2>
                            {item.description && <p className="text-sm text-gray-400">{item.description}</p>}
                        </div>
                    </div>
                )}

                {/* Sublinks section */}
                {item.sublinks && item.sublinks.length > 0 && (
                    <div className="mt-3 border-t border-gray-700 pt-3">
                        <div className="flex flex-wrap items-center gap-2">
                            {item.sublinks.map((sublink, index) => (
                                <React.Fragment key={sublink.id}>
                                    {index > 0 && <div className="h-4 w-px bg-gray-600"></div>}
                                    <a
                                        href={sublink.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-2 text-sm text-gray-400 transition-colors hover:text-white"
                                    >
                                        {sublink.title}
                                    </a>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="bg-background text-foreground min-h-screen">
            <SEO
                title="When I'll Have Time | Jakub Palacký"
                description="Check my current availability status and when I might have time for new projects."
                keywords="availability, projects, freelance, developer"
                url="/availability"
                tags={['availability', 'schedule', 'projects']}
            />

            <NavBar auth={auth} />

            <div className="py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                            When I'll <span className="text-[#8847BB] dark:text-[#F9BAEE]">Have Time</span>
                        </h1>

                        <div className="bg-card mt-12 rounded-xl border p-8 shadow-lg dark:border-[#5E4290]/20 dark:bg-[#161615]">
                            {isAvailable ? (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-center">
                                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#8847BB]/10 text-[#8847BB] dark:bg-[#5E4290]/20 dark:text-[#F9BAEE]">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-12 w-12"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    </div>

                                    <h2 className="text-3xl font-bold text-[#8847BB] dark:text-[#F9BAEE]">I'm Available!</h2>

                                    <p className="text-xl text-[#706f6c] dark:text-[#A1A09A]">{settings.available_message}</p>

                                    <a
                                        href="/contact"
                                        className="mt-4 inline-block rounded-lg bg-[#8847BB] px-6 py-3 text-white transition-colors hover:bg-[#7838a6] dark:bg-[#5E4290] dark:hover:bg-[#4e3578]"
                                    >
                                        Get in Touch
                                    </a>

                                    {settings.available_until && (
                                        <div className="mt-6 text-sm text-[#706f6c] dark:text-[#A1A09A]">
                                            Available until: {new Date(settings.available_until).toLocaleDateString()}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-center">
                                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#8847BB]/10 text-[#8847BB] dark:bg-[#5E4290]/20 dark:text-[#F9BAEE]">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-12 w-12"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                        </div>
                                    </div>

                                    <h2 className="text-3xl font-bold text-[#8847BB] dark:text-[#F9BAEE]">Currently Busy</h2>

                                    <p className="text-xl text-[#706f6c] dark:text-[#A1A09A]">{settings.busy_message}</p>

                                    {timeRemaining > 0 && settings.available_from && (
                                        <div className="mt-6">
                                            <p className="mb-2 text-lg text-[#706f6c] dark:text-[#A1A09A]">I should be available in:</p>
                                            <CountdownTimer targetDate={new Date(settings.available_from)} />
                                        </div>
                                    )}

                                    <a
                                        href="/#contact"
                                        className="mt-4 inline-block rounded-lg bg-[#8847BB] px-6 py-3 text-white transition-colors hover:bg-[#7838a6] dark:bg-[#5E4290] dark:hover:bg-[#4e3578]"
                                    >
                                        Contact Anyway
                                    </a>
                                </div>
                            )}
                        </div>

                        {settings.project_backlog && settings.project_backlog.length > 0 && (
                            <div className="mt-16">
                                <h2 className="mb-8 text-2xl font-bold">
                                    Current <span className="text-[#8847BB] dark:text-[#F9BAEE]">Project Backlog</span>
                                </h2>
                                <div className="space-y-4">{settings.project_backlog.map(renderBacklogItem)}</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
