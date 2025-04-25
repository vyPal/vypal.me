interface HeroSectionProps {
    scrollY: number;
}

export default function HeroSection({ scrollY }: HeroSectionProps) {
    const opacity = Math.max(0, 1 - scrollY / 500);
    const translateY = scrollY * 0.3;

    return (
        <section className="relative flex h-screen items-center justify-center overflow-hidden" id="home">
            <div
                className="absolute inset-0 z-0 bg-gradient-to-b from-[#f5f5f3] to-[#FDFDFC] dark:from-[#0d0d0d] dark:to-[#0a0a0a]"
                style={{ opacity: 1 }}
            />

            {/* Decorative elements that move with scroll */}
            <div
                className="absolute top-[20%] right-[5%] h-64 w-64 rounded-full bg-[#f53003]/5 dark:bg-[#FF4433]/5"
                style={{ transform: `translateY(${translateY * 0.7}px)` }}
            />
            <div
                className="absolute bottom-[20%] left-[10%] h-40 w-40 rounded-full bg-[#f53003]/5 dark:bg-[#FF4433]/5"
                style={{ transform: `translateY(${translateY * 0.4}px)` }}
            />

            <div
                className="relative z-10 container mx-auto px-6 text-center"
                style={{
                    transform: `translateY(${translateY * 0.2}px)`,
                    opacity,
                }}
            >
                <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
                    Hi, I'm <span className="text-[#f53003] dark:text-[#FF4433]">Jakub Palacký</span>
                </h1>
                <p className="mx-auto mb-10 max-w-2xl text-xl text-[#706f6c] dark:text-[#A1A09A]">
                    A computer nerd, who enjoys pretty much anything related to technology, from coding to gaming, and everything in between.
                </p>

                <div className="flex flex-wrap justify-center gap-4">
                    <a
                        href="#projects"
                        className="rounded-md bg-[#1b1b18] px-6 py-3 text-sm font-medium text-white transition-all hover:bg-black dark:bg-[#eeeeec] dark:text-[#1C1C1A] dark:hover:bg-white"
                    >
                        View My Work
                    </a>
                    <a
                        href="#contact"
                        className="rounded-md border border-[#19140035] px-6 py-3 text-sm font-medium transition-all hover:border-[#1915014a] dark:border-[#3E3E3A] dark:hover:border-[#62605b]"
                    >
                        Contact Me
                    </a>
                </div>

                <div className="mt-16 flex justify-center space-x-6">
                    <SocialIcon href="https://github.com/vyPal" type="github" />
                    <SocialIcon href="https://linkedin.com/in/jakub-palacky" type="linkedin" />
                    <SocialIcon href="https://twitter.com/vyPal420" type="twitter" />
                </div>
            </div>

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </div>
        </section>
    );
}

interface SocialIconProps {
    href: string;
    type: 'github' | 'linkedin' | 'twitter';
}

function SocialIcon({ href, type }: SocialIconProps) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group h-10 w-10 rounded-full border border-[#e3e3e0] bg-[#FDFDFC] p-2 transition-all hover:border-[#19140035] hover:shadow-md dark:border-[#3E3E3A] dark:bg-[#0a0a0a] dark:hover:border-[#62605b]"
        >
            {type === 'github' && (
                <svg
                    className="h-full w-full text-[#1b1b18] group-hover:text-[#f53003] dark:text-[#EDEDEC] dark:group-hover:text-[#FF4433]"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
            )}
            {type === 'linkedin' && (
                <svg
                    className="h-full w-full text-[#1b1b18] group-hover:text-[#f53003] dark:text-[#EDEDEC] dark:group-hover:text-[#FF4433]"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
            )}
            {type === 'twitter' && (
                <svg
                    className="h-full w-full text-[#1b1b18] group-hover:text-[#f53003] dark:text-[#EDEDEC] dark:group-hover:text-[#FF4433]"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
            )}
        </a>
    );
}
