import SEO from '@/components/SEO';
import Footer from '@/components/sections/Footer';
import NavBar from '@/components/sections/NavBar';
import { type SharedData } from '@/types';
import { Link } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

export default function Apps({ auth }: { auth: SharedData['auth'] }) {
    const [scrollY, setScrollY] = useState(0);

    // Track scroll position
    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    const sectionRef = useRef<HTMLElement>(null);
    const isVisible = scrollY > (sectionRef.current?.offsetTop || 0) - 500;

    // Define your apps
    const apps = [
        {
            title: 'Kairo',
            description: 'A no-nonsense habit tracking app with a modern UI, no subscription, no ads, just pay once.',
            image: '/media/apps/kairo/kairo.png',
            technologies: ['Flutter', 'Dart', 'Local-first'],
            link: '/apps/kairo',
            price: '$0.49 (pre-release)',
            availability: 'Available on Google Play',
        },
        // Add more apps here in the future
    ];

    return (
        <>
            <SEO
                title="Apps by Jakub Palacký"
                description="Discover mobile and desktop applications created by Jakub Palacký - simple, affordable, and ad-free."
                keywords="apps, mobile apps, desktop apps, Flutter, habit tracker"
                url="https://vypal.me/apps"
            />

            <div className="bg-background text-foreground min-h-screen">
                {/* Navigation */}
                <NavBar auth={auth} />

                {/* Header Section */}
                <section className="pt-20 md:pt-32">
                    <div className="container mx-auto px-6">
                        <div className="mx-auto max-w-5xl">
                            <h1 className="mb-4 text-4xl font-bold md:text-5xl">
                                My <span className="text-[#8847BB] dark:text-[#8847BB]">Apps</span>
                            </h1>
                            <p className="mb-12 max-w-2xl text-[#706f6c] dark:text-[#A1A09A]">
                                I build applications with a focus on simplicity, affordability, and user privacy. No subscriptions, no ads, no premium
                                features - just pay once and own it forever.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Apps Grid Section */}
                <section ref={sectionRef} className="pb-20 md:pb-32">
                    <div className="container mx-auto px-6">
                        <div className="mx-auto max-w-5xl">
                            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {apps.map((app, index) => (
                                    <Link key={index} href={app.link}>
                                        <div
                                            className={`group relative flex h-full flex-col overflow-hidden rounded-lg border border-[#e3e3e0] transition-all duration-300 hover:shadow-lg dark:border-[#28282A] ${
                                                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                                            }`}
                                            style={{ transitionDelay: `${index * 100}ms` }}
                                        >
                                            <div className="relative aspect-square overflow-hidden bg-[#f5f5f3] dark:bg-[#1C1C1A]">
                                                <img
                                                    src={app.image}
                                                    alt={app.title}
                                                    className="absolute top-1/2 left-1/2 h-auto w-[60%] -translate-x-1/2 -translate-y-1/2 transform transition-transform duration-500 group-hover:scale-110"
                                                />
                                            </div>
                                            <div className="flex flex-1 flex-col p-6">
                                                <h3 className="mb-2 text-xl font-bold">{app.title}</h3>
                                                <p className="mb-4 flex-1 text-sm text-[#706f6c] dark:text-[#A1A09A]">{app.description}</p>
                                                <div className="mb-4 flex flex-wrap gap-2">
                                                    {app.technologies.map((tech, techIndex) => (
                                                        <span
                                                            key={techIndex}
                                                            className="rounded-full bg-[#e3e3e0] px-2 py-1 text-xs font-medium text-[#1b1b18] dark:bg-[#1C1C1A] dark:text-[#EDEDEC]"
                                                        >
                                                            {tech}
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-semibold text-[#8847BB] dark:text-[#F9BAEE]">{app.price}</span>
                                                        <span className="flex items-center text-sm font-medium">
                                                            Learn more
                                                            <svg
                                                                width={16}
                                                                height={16}
                                                                viewBox="0 0 16 16"
                                                                fill="none"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="ml-1"
                                                            >
                                                                <path
                                                                    d="M6 12L10 8L6 4"
                                                                    stroke="currentColor"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                />
                                                            </svg>
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <svg
                                                            className="mr-1 h-4 w-4"
                                                            viewBox="0 0 24 24"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="currentColor"
                                                        >
                                                            <path d="M22.018 13.298l-3.919 2.218-3.515-3.493 3.543-3.521 3.891 2.202a1.49 1.49 0 0 1 0 2.594zM1.337.924a1.486 1.486 0 0 0-.112.568v21.017c0 .217.045.419.124.6l11.155-11.087L1.337.924zm12.207 10.065l3.258-3.238L3.45.195a1.466 1.466 0 0 0-.946-.195l11.04 10.989zm0 2.067l-11 10.953c.298.036.612-.016.906-.183l13.324-7.54-3.23-3.23z"></path>
                                                        </svg>
                                                        <span className="text-xs text-[#706f6c] dark:text-[#A1A09A]">{app.availability}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <Footer />
            </div>
        </>
    );
}
