import { Link } from '@inertiajs/react';
import React, { useRef } from 'react';

interface FeaturedLink {
    title: string;
    description: string;
    icon: React.ReactNode;
    href: string;
    color: string; // For the gradient/accent
}

interface FeaturedLinksSectionProps {
    scrollY: number;
}

export default function FeaturedLinksSection({ scrollY }: FeaturedLinksSectionProps) {
    const sectionRef = useRef<HTMLElement>(null);
    const isVisible = scrollY > (sectionRef.current?.offsetTop || 10000) - 500;

    const featuredLinks: FeaturedLink[] = [
        {
            title: 'Developer Utilities',
            description: 'Handy tools for web development including color generators, code formatters, and more.',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            href: '/utils',
            color: 'from-purple-500/20 to-pink-500/20 dark:from-purple-500/10 dark:to-pink-500/10',
        } /*
        {
            title: 'Interactive Polls',
            description: 'Vote in interactive polls and see real-time results, or suggest new poll topics.',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                </svg>
            ),
            href: '/polls',
            color: 'from-emerald-500/20 to-teal-500/20 dark:from-emerald-500/10 dark:to-teal-500/10 hover:from-emerald-500/30 hover:to-teal-500/30 dark:hover:from-emerald-500/20 dark:hover:to-teal-500/20',
        },*/,
        {
            title: 'Link Tree',
            description: 'All my important links in one place - social media, projects, and professional profiles.',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                </svg>
            ),
            href: '/links',
            color: 'from-cyan-500/20 to-blue-500/20 dark:from-cyan-500/10 dark:to-blue-500/10',
        } /* Maybe coming soon?
        {
            title: 'Blog & Tutorials',
            description: 'Articles, guides and thoughts on web development, technology and programming.',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                    />
                </svg>
            ),
            href: '/blog',
            color: 'from-amber-500/20 to-orange-500/20 dark:from-amber-500/10 dark:to-orange-500/10',
        },*/,
    ];

    return (
        <section ref={sectionRef} className="relative py-16 sm:py-24" id="featured-links">
            {/* Background design element with animation */}
            <div className="absolute inset-0 overflow-hidden">
                <div
                    className={`absolute top-1/3 -right-20 h-64 w-64 rounded-full bg-[#8847BB]/5 blur-3xl transition-all duration-1000 ease-out dark:bg-[#8847BB]/10 ${
                        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'
                    }`}
                    style={{ transitionDelay: '200ms' }}
                ></div>
                <div
                    className={`absolute top-1/4 -left-20 h-72 w-72 rounded-full bg-[#F9BAEE]/5 blur-3xl transition-all duration-1000 ease-out dark:bg-[#F9BAEE]/10 ${
                        isVisible ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'
                    }`}
                    style={{ transitionDelay: '300ms' }}
                ></div>
            </div>

            <div className="relative container mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto mb-12 max-w-2xl text-center">
                    <h2
                        className={`text-3xl font-bold tracking-tight transition-all duration-700 sm:text-4xl ${
                            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                        }`}
                    >
                        <span className="relative">
                            <span className="relative z-10">Explore Features</span>
                            <span
                                className={`absolute -bottom-1.5 left-0 z-0 h-3 w-full rounded-sm bg-[#8847BB]/20 transition-all delay-300 duration-700 dark:bg-[#F9BAEE]/20 ${
                                    isVisible ? 'scale-x-100' : 'scale-x-0'
                                }`}
                                style={{ transformOrigin: 'left' }}
                            ></span>
                        </span>
                    </h2>
                    <p
                        className={`text-muted-foreground mt-4 text-lg transition-all delay-200 duration-700 ${
                            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                        }`}
                    >
                        Discover additional resources and tools I've created to help fellow developers.
                    </p>
                </div>

                <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-2">
                    {featuredLinks.map((link, index) => (
                        <Link
                            key={index}
                            href={link.href}
                            className={`group bg-card relative overflow-hidden rounded-xl border p-6 shadow-sm transition-all duration-700 hover:shadow-md ${
                                isVisible ? 'opacity-100' : 'opacity-0'
                            }`}
                            style={{
                                transitionProperty: 'all, transform, opacity',
                                transitionDelay: `0ms, ${400 + index * 150}ms, ${400 + index * 150}ms`,
                                transitionDuration: '700ms, 700ms, 700ms',
                                transform: `translate(0, ${isVisible ? '0' : 'calc(var(--spacing) * 16)'})`,
                            }}
                        >
                            {/* Gradient background */}
                            <div
                                className={`absolute inset-0 bg-gradient-to-br ${link.color} opacity-70 transition-all duration-500 group-hover:opacity-100 ${
                                    isVisible ? 'scale-100' : 'scale-90'
                                }`}
                                style={{
                                    transitionProperty: 'all, scale',
                                    transitionDelay: `0ms, ${600 + index * 150}ms`,
                                    transitionDuration: '700ms, 700ms',
                                }}
                            ></div>

                            {/* Content */}
                            <div className="relative">
                                <div
                                    className={`bg-primary/10 text-primary dark:bg-primary/20 mb-4 flex h-12 w-12 items-center justify-center rounded-full transition-all duration-500 ${
                                        isVisible ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
                                    }`}
                                    style={{
                                        transitionProperty: 'all, scale, opacity',
                                        transitionDelay: `0ms, ${700 + index * 150}ms, ${700 + index * 150}ms`,
                                        transitionDuration: '700ms, 700ms, 700ms',
                                    }}
                                >
                                    {link.icon}
                                </div>
                                <h3 className="group-hover:text-primary mb-2 text-xl font-semibold">{link.title}</h3>
                                <p className="text-muted-foreground">{link.description}</p>

                                {/* Arrow indicator with animation */}
                                <div className="text-primary mt-4 flex items-center text-sm font-medium">
                                    <span>Explore</span>
                                    <svg
                                        className={`ml-1 h-4 w-4 transition-all duration-300 group-hover:translate-x-1 ${
                                            isVisible ? 'opacity-100' : '-translate-x-4 opacity-0'
                                        }`}
                                        style={{
                                            transitionProperty: 'all, transform, opacity',
                                            transitionDelay: `0ms, ${800 + index * 150}ms, ${800 + index * 150}ms`,
                                            transitionDuration: '700ms, 700ms, 700ms',
                                        }}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
