import { useRef } from 'react';

interface AboutSectionProps {
    scrollY: number;
}

export default function AboutSection({ scrollY }: AboutSectionProps) {
    const sectionRef = useRef<HTMLElement>(null);
    const isVisible = scrollY > (sectionRef.current?.offsetTop || 0) - 500;

    return (
        <section ref={sectionRef} className="py-20 md:py-32" id="about">
            <div className="container mx-auto px-6">
                <div className="mx-auto max-w-4xl">
                    <h2
                        className={`mb-8 text-3xl font-bold transition-all duration-700 md:text-4xl ${
                            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                        }`}
                    >
                        About <span className="text-[#f53003] dark:text-[#FF4433]">Me</span>
                    </h2>

                    <div className="grid items-center gap-12 md:grid-cols-2">
                        <div
                            className={`transition-all delay-200 duration-700 ${
                                isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
                            }`}
                        >
                            <div className="relative">
                                <div className="absolute -inset-2 rounded-lg bg-gradient-to-r from-[#f53003] to-[#f8b803] opacity-30 blur" />
                                <div className="relative aspect-square overflow-hidden rounded-lg bg-[#e3e3e0] dark:bg-[#1C1C1A]">
                                    {/* Replace with your profile image */}
                                    <img src="/media/vypal.png" alt="Your Name" className="h-full w-full object-cover" />
                                </div>
                            </div>
                        </div>

                        <div
                            className={`transition-all delay-400 duration-700 ${
                                isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
                            }`}
                        >
                            <h3 className="mb-4 text-xl font-medium">Everything developer</h3>
                            <p className="mb-6 text-[#706f6c] dark:text-[#A1A09A]">
                                I love computers and enjoy programming most of all. I have picked up a variety of programming languages and frameworks
                                over the years.
                            </p>
                            <p className="mb-6 text-[#706f6c] dark:text-[#A1A09A]">
                                I learned my first programming language, C++, when I was 10 years old. I got a Arduino board and a sensor kit for my
                                birthday to play around with.
                            </p>
                            <p className="mb-8 text-[#706f6c] dark:text-[#A1A09A]">
                                Since I started out with arduinos, I am also a huge hardware geek. I have plenty of advanced sensors, like LiDAR, GPS,
                                and IMU. I also enjoy building robots and other hardware projects.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center">
                                    <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-md bg-[#f53003]/10 text-[#f53003] dark:bg-[#FF4433]/10 dark:text-[#FF4433]">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path
                                                fillRule="evenodd"
                                                d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                                                clipRule="evenodd"
                                            />
                                            <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-medium">Experience (non-profesional)</h4>
                                        <p className="text-sm text-[#706f6c] dark:text-[#A1A09A]">9 Years</p>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-md bg-[#f53003]/10 text-[#f53003] dark:bg-[#FF4433]/10 dark:text-[#FF4433]">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path
                                                fillRule="evenodd"
                                                d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-medium">Projects</h4>
                                        <p className="text-sm text-[#706f6c] dark:text-[#A1A09A]">15+ Completed</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
