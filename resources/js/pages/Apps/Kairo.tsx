import SEO from '@/components/SEO';
import Footer from '@/components/sections/Footer';
import NavBar from '@/components/sections/NavBar';
import SmoothScrollLink from '@/components/ui/SmoothScrollLink';
import { type SharedData } from '@/types';
import { useEffect, useRef, useState } from 'react';

export default function Kairo({ auth }: { auth: SharedData['auth'] }) {
    const [scrollY, setScrollY] = useState(0);
    const [isPhoneVisible, setIsPhoneVisible] = useState(false);
    const phoneRef = useRef<HTMLDivElement>(null);
    const featuresRef = useRef<HTMLDivElement>(null);
    const pricingRef = useRef<HTMLDivElement>(null);

    // Track scroll position
    useEffect(() => {
        setIsPhoneVisible(true);
        const handleScroll = () => {
            setScrollY(window.scrollY);

            if (phoneRef.current && window.scrollY > phoneRef.current.offsetTop - 500) {
                setIsPhoneVisible(true);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Screenshots of the app
    const screenshots = [
        { id: 1, image: '/media/apps/kairo/home.webp', alt: 'Kairo Home Page' },
        { id: 2, image: '/media/apps/kairo/details.webp', alt: 'Habit Details' },
        { id: 3, image: '/media/apps/kairo/stats.webp', alt: 'Statistics View' },
    ];

    // Features of the app
    const features = [
        {
            title: 'Distraction Free',
            description: 'No ads, no upsells, no subscription prompts. Just a clean interface focused on your habits.',
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
                </svg>
            ),
        },
        {
            title: 'Local-First',
            description: 'Your data stays on your device. No mandatory account creation or cloud syncing.',
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
            ),
        },
        {
            title: 'Modern Design',
            description: 'Beautiful, intuitive interface with thoughtful animations and visual feedback.',
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
            ),
        },
        {
            title: 'One-time Purchase',
            description: 'Pay once, own forever. No subscriptions or in-app purchases.',
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                    <path d="M12 9v6"></path>
                    <path d="M9 12h6"></path>
                </svg>
            ),
        },
    ];

    return (
        <>
            <SEO
                title="Kairo - Simple Habit Tracker"
                description="A no-nonsense habit tracking app with a modern UI, no subscription, no ads, just pay once."
                keywords="habit tracker, mobile app, flutter app, productivity, daily habits"
                url="https://vypal.me/apps/kairo"
            />

            <div className="bg-background text-foreground min-h-screen">
                {/* Navigation */}
                <NavBar auth={auth} />

                {/* Hero Section */}
                <section className="relative overflow-hidden py-20 md:py-32">
                    <div className="container mx-auto px-6">
                        <div className="mx-auto max-w-7xl">
                            <div className="flex flex-col items-center justify-between gap-12 md:flex-row">
                                <div className="md:w-1/2">
                                    <h1 className="mb-6 text-4xl font-bold md:text-5xl lg:text-6xl">
                                        <span className="text-[#79C3C2]">Kairo</span> - The Habit Tracker You Deserve
                                    </h1>
                                    <p className="mb-8 text-xl text-[#706f6c] dark:text-[#A1A09A]">
                                        A modern habit tracking app with no subscriptions, no ads, and no upsells. Just pay once and focus on building
                                        better habits.
                                    </p>
                                    <div className="flex flex-wrap gap-4">
                                        <SmoothScrollLink
                                            href="#download-section"
                                            className="inline-flex items-center justify-center rounded-md bg-[#79C3C2] px-6 py-3 text-base font-medium text-white shadow-sm transition-colors hover:bg-[#6CA8C5]"
                                        >
                                            <span>Get It Now</span>
                                            <svg
                                                width="16"
                                                height="16"
                                                viewBox="0 0 16 16"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="ml-2"
                                            >
                                                <path
                                                    d="M3.33325 8.00004H12.6666"
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path
                                                    d="M8.66675 4L12.6667 8L8.66675 12"
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </SmoothScrollLink>
                                        <a
                                            href="#features"
                                            className="bg-background inline-flex items-center justify-center rounded-md border border-[#e3e3e0] px-6 py-3 text-base font-medium shadow-sm transition-colors hover:bg-[#f5f5f3] dark:border-[#28282A] dark:hover:bg-[#1C1C1A]"
                                        >
                                            Learn More
                                        </a>
                                    </div>
                                    <div className="mt-8">
                                        <p className="text-sm font-medium">
                                            Pre-release price: <span className="text-[#79C3C2]">$0.49</span>
                                        </p>
                                        <p className="text-xs text-[#706f6c] dark:text-[#A1A09A]">Full release price will be $2.49</p>
                                    </div>
                                </div>
                                <div ref={phoneRef} className="md:w-1/2">
                                    <div
                                        className={`relative transition-all duration-1000 ease-in-out ${isPhoneVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
                                        style={{ perspective: '1000px' }}
                                    >
                                        <div
                                            className={`relative transition-all delay-300 duration-1000 ease-out ${isPhoneVisible ? 'rotate-y-0' : 'rotate-y-180'}`}
                                            style={{
                                                transformStyle: 'preserve-3d',
                                                animation: isPhoneVisible ? 'float 6s ease-in-out infinite' : 'none',
                                            }}
                                        >
                                            <div className="relative mx-auto h-[600px] w-[300px] rounded-[40px] bg-black p-4 shadow-2xl">
                                                <div className="absolute top-0 left-1/2 h-6 w-40 -translate-x-1/2 rounded-b-2xl bg-black"></div>
                                                <div className="h-full w-full overflow-hidden rounded-[32px] bg-white">
                                                    <img src={screenshots[0].image} alt={screenshots[0].alt} className="h-full w-full object-cover" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-[#79C3C2]/10 blur-3xl"></div>
                    <div className="absolute top-40 -right-32 h-80 w-80 rounded-full bg-[#86A8D0]/10 blur-3xl"></div>
                </section>

                {/* Color Strip */}
                <div className="flex h-2 w-full">
                    <div className="w-1/4 bg-[#79C3C2]"></div>
                    <div className="w-1/4 bg-[#6CA8C5]"></div>
                    <div className="w-1/4 bg-[#86A8D0]"></div>
                    <div className="w-1/4 bg-[#4893A5]"></div>
                </div>

                {/* Features Section */}
                <section id="features" ref={featuresRef} className="py-20 md:py-32">
                    <div className="container mx-auto px-6">
                        <div className="mx-auto max-w-5xl">
                            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                                Why <span className="text-[#79C3C2]">Kairo</span>?
                            </h2>
                            <p className="mb-16 max-w-2xl text-[#706f6c] dark:text-[#A1A09A]">
                                Most habit trackers try to upsell you on premium features or show you ads. Kairo does away with all of that, focusing
                                on what matters most: your habits.
                            </p>

                            <div className="grid gap-12 md:grid-cols-2">
                                {features.map((feature, index) => (
                                    <div
                                        key={index}
                                        className={`transition-all duration-700 ${
                                            scrollY > (featuresRef.current?.offsetTop || 0) - 400
                                                ? 'translate-y-0 opacity-100'
                                                : 'translate-y-10 opacity-0'
                                        }`}
                                        style={{ transitionDelay: `${index * 150}ms` }}
                                    >
                                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#79C3C2]/10 text-[#79C3C2]">
                                            {feature.icon}
                                        </div>
                                        <h3 className="mb-2 text-xl font-bold">{feature.title}</h3>
                                        <p className="text-[#706f6c] dark:text-[#A1A09A]">{feature.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Screenshot Gallery */}
                <section className="bg-[#f5f5f3] py-20 md:py-32 dark:bg-[#1C1C1A]">
                    <div className="container mx-auto px-6">
                        <div className="mx-auto max-w-5xl">
                            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                                See <span className="text-[#79C3C2]">Kairo</span> in Action
                            </h2>
                            <p className="mb-16 max-w-2xl text-[#706f6c] dark:text-[#A1A09A]">
                                Beautiful, intuitive interface designed for daily use.
                            </p>

                            <div className="flex snap-x gap-6 overflow-x-auto pb-8">
                                {screenshots.map((screenshot, index) => (
                                    <div
                                        key={screenshot.id}
                                        className="shrink-0 snap-center"
                                        style={{
                                            transform: `perspective(1000px) rotateY(${index * 5 - 5}deg)`,
                                            zIndex: 10 - Math.abs(index - 1),
                                        }}
                                    >
                                        <div className="relative h-[500px] w-[250px] overflow-hidden rounded-2xl border-8 border-black bg-black shadow-xl">
                                            <img
                                                src={screenshot.image}
                                                alt={screenshot.alt}
                                                className="h-full w-full object-cover"
                                                style={{
                                                    filter: index === 1 ? 'none' : 'brightness(0.8)',
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section id="pricing" ref={pricingRef} className="py-20 md:py-32">
                    <div className="container mx-auto px-6">
                        <div className="mx-auto max-w-5xl">
                            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                                Simple <span className="text-[#79C3C2]">Pricing</span>
                            </h2>
                            <p className="mb-16 max-w-2xl text-[#706f6c] dark:text-[#A1A09A]">
                                No subscriptions. No hidden fees. Just one simple price.
                            </p>

                            <div
                                className={`overflow-hidden rounded-2xl border border-[#e3e3e0] bg-white shadow-xl transition-all duration-700 dark:border-[#28282A] dark:bg-[#1C1C1A] ${
                                    scrollY > (pricingRef.current?.offsetTop || 0) - 400 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                                }`}
                            >
                                <div className="bg-[#79C3C2] p-6 text-white">
                                    <div className="mb-1 text-sm font-medium tracking-wide uppercase">Limited Time Offer</div>
                                    <h3 className="text-3xl font-bold">Pre-Release Price</h3>
                                </div>
                                <div className="p-8">
                                    <div className="mb-4 flex items-end">
                                        <span className="text-5xl font-bold">$0.49</span>
                                        <span className="ml-2 text-sm text-[#706f6c] dark:text-[#A1A09A]">one-time payment</span>
                                    </div>
                                    <p className="mb-6 text-[#706f6c] dark:text-[#A1A09A]">
                                        Get early access to Kairo at a special pre-release price. Price will increase to $2.49 after full release.
                                    </p>
                                    <ul className="mb-8 space-y-4">
                                        <li className="flex items-center">
                                            <svg className="mr-2 h-5 w-5 text-[#79C3C2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            All features included
                                        </li>
                                        <li className="flex items-center">
                                            <svg className="mr-2 h-5 w-5 text-[#79C3C2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            Free updates
                                        </li>
                                        <li className="flex items-center">
                                            <svg className="mr-2 h-5 w-5 text-[#79C3C2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            No subscriptions, ever
                                        </li>
                                    </ul>
                                    <a
                                        href="https://play.google.com/store/apps/details?id=me.vypal.kairo"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block w-full rounded-lg bg-[#79C3C2] px-6 py-3 text-center font-medium text-white transition-colors hover:bg-[#6CA8C5]"
                                    >
                                        Get Kairo Now
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Download Section */}
                <section className="relative overflow-hidden bg-[#4893A5] py-20 text-white md:py-32" id="download-section">
                    <div className="container mx-auto px-6">
                        <div className="mx-auto max-w-5xl">
                            <div className="flex flex-col items-center justify-between gap-12 text-center">
                                <h2 className="text-3xl font-bold md:text-5xl">Ready to start building better habits?</h2>
                                <p className="mb-2 max-w-2xl text-white/80">
                                    Kairo helps you build habits that stick. With its clean interface and no-nonsense approach, you can focus on what
                                    matters: your personal growth.
                                </p>
                                <p className="-mt-8 mb-2 text-sm font-medium text-white/90">Currently only available on Google Play</p>
                                <div className="flex flex-wrap justify-center gap-8">
                                    <div className="flex flex-col items-center">
                                        <span className="mb-2 text-sm font-semibold text-white/90">Coming Soon</span>
                                        <div className="relative">
                                            <div className="absolute -inset-0.5 rounded-md bg-white/10 blur-sm"></div>
                                            <a className="relative flex h-16 w-48 cursor-not-allowed items-center justify-center rounded-md border border-white/20 bg-black px-4 text-white opacity-70">
                                                <svg className="mr-2 h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"></path>
                                                </svg>
                                                <div className="flex flex-col items-start">
                                                    <span className="text-xs">Download on the</span>
                                                    <span className="text-base font-semibold">App Store</span>
                                                </div>
                                            </a>
                                        </div>
                                        <a
                                            href="mailto:info@vypal.me?subject=Kairo%20for%20iOS%20Request&body=Hi%2C%20I%27m%20interested%20in%20Kairo%20for%20iOS.%20Please%20let%20me%20know%20when%20it%20will%20be%20available."
                                            className="mt-2 text-xs underline hover:text-white/80"
                                        >
                                            Request info
                                        </a>
                                    </div>

                                    <div className="flex flex-col items-center">
                                        <span className="mb-2 text-sm font-semibold text-white/90">Available Now</span>
                                        <a
                                            href="https://play.google.com/store/apps/details?id=me.vypal.kairo"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex h-16 w-48 items-center justify-center rounded-md border border-white/20 bg-black px-4 text-white transition-colors hover:bg-gray-900"
                                        >
                                            <svg className="mr-2 h-7 w-7" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                                                <path d="M22.018 13.298l-3.919 2.218-3.515-3.493 3.543-3.521 3.891 2.202a1.49 1.49 0 0 1 0 2.594zM1.337.924a1.486 1.486 0 0 0-.112.568v21.017c0 .217.045.419.124.6l11.155-11.087L1.337.924zm12.207 10.065l3.258-3.238L3.45.195a1.466 1.466 0 0 0-.946-.195l11.04 10.989zm0 2.067l-11 10.953c.298.036.612-.016.906-.183l13.324-7.54-3.23-3.23z"></path>
                                            </svg>
                                            <div className="flex flex-col items-start">
                                                <span className="text-xs">GET IT ON</span>
                                                <span className="text-base font-semibold">Google Play</span>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-[#79C3C2]/20 blur-3xl"></div>
                    <div className="absolute right-10 bottom-20 h-40 w-40 rounded-full bg-[#86A8D0]/20 blur-3xl"></div>
                </section>

                {/* FAQ */}
                <section className="py-20 md:py-32">
                    <div className="container mx-auto px-6">
                        <div className="mx-auto max-w-3xl">
                            <h2 className="mb-8 text-center text-3xl font-bold md:text-4xl">
                                Frequently Asked <span className="text-[#79C3C2]">Questions</span>
                            </h2>

                            <div className="space-y-6">
                                <div className="rounded-lg border border-[#e3e3e0] p-6 dark:border-[#28282A]">
                                    <h3 className="mb-2 font-bold">Will there ever be a subscription?</h3>
                                    <p className="text-[#706f6c] dark:text-[#A1A09A]">
                                        No. Kairo is a one-time purchase, and always will be. You pay once and own the app forever.
                                    </p>
                                </div>

                                <div className="rounded-lg border border-[#e3e3e0] p-6 dark:border-[#28282A]">
                                    <h3 className="mb-2 font-bold">Will my data be shared or sold?</h3>
                                    <p className="text-[#706f6c] dark:text-[#A1A09A]">
                                        No. Kairo is built on a local-first principle. Your data stays on your device unless you explicitly opt into
                                        cloud syncing (which is optional and free).
                                    </p>
                                </div>

                                <div className="rounded-lg border border-[#e3e3e0] p-6 dark:border-[#28282A]">
                                    <h3 className="mb-2 font-bold">When will cloud sync be available?</h3>
                                    <p className="text-[#706f6c] dark:text-[#A1A09A]">
                                        Cloud sync is planned for a future update. It will be entirely optional and free of charge.
                                    </p>
                                </div>

                                <div className="rounded-lg border border-[#e3e3e0] p-6 dark:border-[#28282A]">
                                    <h3 className="mb-2 font-bold">Is Kairo available for iOS?</h3>
                                    <p className="text-[#706f6c] dark:text-[#A1A09A]">
                                        Not yet. Kairo is currently only available on Google Play. An iOS version is planned for the future. You can
                                        request to be notified when it's available.
                                    </p>
                                </div>

                                <div className="rounded-lg border border-[#e3e3e0] p-6 dark:border-[#28282A]">
                                    <h3 className="mb-2 font-bold">Why is the pre-release price so low?</h3>
                                    <p className="text-[#706f6c] dark:text-[#A1A09A]">
                                        The pre-release price is a thank you to early adopters who are willing to try the app while it's still in
                                        development. After the full release, the price will increase to $2.49.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <Footer />
            </div>

            {/* Floating animations */}
            <style>{`
                @keyframes float {
                    0% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-20px);
                    }
                    100% {
                        transform: translateY(0px);
                    }
                }
            `}</style>
        </>
    );
}
