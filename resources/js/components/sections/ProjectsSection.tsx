import { useRef } from 'react';

interface ProjectsSectionProps {
    scrollY: number;
}

export default function ProjectsSection({ scrollY }: ProjectsSectionProps) {
    const sectionRef = useRef<HTMLElement>(null);
    const isVisible = scrollY > (sectionRef.current?.offsetTop || 0) - 500;

    // Define your projects
    const projects = [
        {
            title: 'EduPage2',
            description: 'A custom mobile client for EduPage, focusing on design and speed improvement',
            image: 'https://raw.githubusercontent.com/DislikesSchool/EduPage2/refs/heads/master/assets/EduPage2/svg/logo-color.svg',
            technologies: ['Flutter', 'Dart', 'Golang', 'Firebase'],
            liveUrl: 'https://ep2.vypal.me',
            githubUrl: 'https://github.com/DislikesSchool/EduPage2',
        },
        {
            title: 'CaffeineC',
            description: 'My own C-like programming language. It barely works (kinda like me without caffeine)',
            image: '/media/caffeinec.png',
            technologies: ['Golang', 'LLVM', 'Clang'],
            liveUrl: 'https://c.vypal.me',
            githubUrl: 'https://github.com/vyPal/CaffeineC',
        },
        {
            title: 'My Custom Architecture',
            description: 'A PoC of a custom RISC CPU Architecture, a basic emulator for it, and some assembly examples',
            image: 'https://www.shutterstock.com/image-illustration/central-computer-processors-cpu-concept-600nw-2128046906.jpg',
            technologies: ['Golang', 'Assembly'],
            githubUrl: 'https://github.com/vyPal/VM',
        },
    ];

    return (
        <section ref={sectionRef} className="py-20 md:py-32" id="projects">
            <div className="container mx-auto px-6">
                <div className="mx-auto max-w-5xl">
                    <h2
                        className={`mb-4 text-3xl font-bold transition-all duration-700 md:text-4xl ${
                            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                        }`}
                    >
                        My <span className="text-[#8847BB] dark:text-[#8847BB]">Projects</span>
                    </h2>

                    <p
                        className={`mb-12 max-w-2xl text-[#706f6c] transition-all delay-200 duration-700 dark:text-[#A1A09A] ${
                            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                        }`}
                    >
                        Here are some of my most recent projects. Most aren't completed yet, but are in a pretty usable state.
                    </p>

                    <div className="space-y-20">
                        {projects.map((project, index) => (
                            <ProjectCard key={index} project={project} isVisible={isVisible} index={index} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

interface ProjectCardProps {
    project: {
        title: string;
        description: string;
        image: string;
        technologies: string[];
        liveUrl?: string | undefined;
        githubUrl: string;
    };
    isVisible: boolean;
    index: number;
}

function ProjectCard({ project, isVisible, index }: ProjectCardProps) {
    const isEven = index % 2 === 0;
    const translateX = isEven ? '-translate-x-10' : 'translate-x-10';
    const delay = 300 + index * 200;

    return (
        <div
            className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 transition-all duration-1000 ${
                isVisible ? 'translate-x-0 opacity-100' : `opacity-0 ${translateX}`
            }`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            <div className="md:w-1/2">
                <div className="group relative">
                    <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-[#5E4290] to-[#F9BAEE] opacity-30 blur transition-opacity group-hover:opacity-50" />
                    <div className="relative overflow-hidden rounded-lg">
                        <img src={project.image} alt={project.title} className="w-full transition-transform duration-500 group-hover:scale-105" />
                    </div>
                </div>
            </div>

            <div className="md:w-1/2">
                <h3 className="mb-3 text-2xl font-bold">{project.title}</h3>
                <p className="mb-5 text-[#706f6c] dark:text-[#A1A09A]">{project.description}</p>

                <div className="mb-8 flex flex-wrap gap-2">
                    {project.technologies.map((tech, techIndex) => (
                        <span
                            key={techIndex}
                            className="rounded-full bg-[#e3e3e0] px-3 py-1 text-xs font-medium text-[#1b1b18] dark:bg-[#1C1C1A] dark:text-[#EDEDEC]"
                        >
                            {tech}
                        </span>
                    ))}
                </div>

                <div className="flex gap-4">
                    {project.liveUrl && (
                        <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-sm font-medium text-[#8847BB] hover:text-[#8847BB]/65 dark:text-[#8847BB] dark:hover:text-[#F9BAEE]"
                        >
                            <span>View Live</span>
                            <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-1">
                                <path
                                    d="M13.3334 8.00004V12.6667C13.3334 13.0203 13.1929 13.3595 12.9429 13.6095C12.6928 13.8595 12.3537 14 12.0001 14H3.33341C2.97979 14 2.64067 13.8595 2.39063 13.6095C2.14058 13.3595 2.00008 13.0203 2.00008 12.6667V4.00004C2.00008 3.64642 2.14058 3.3073 2.39063 3.05725C2.64067 2.80721 2.97979 2.66671 3.33341 2.66671H8.00008"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path d="M10.6666 2H14.0000V5.33333" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M6.66675 9.33333L14.0001 2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </a>
                    )}

                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm font-medium">
                        <span>Source Code</span>
                        <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-1">
                            <path d="M6 8L2.66667 11.3333L6 14.6667" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                            <path
                                d="M2.66675 11.3333H10.0001C11.4145 11.3333 12.7711 10.7714 13.7713 9.77124C14.7715 8.77104 15.3334 7.41449 15.3334 6.00004C15.3334 4.58559 14.7715 3.22904 13.7713 2.22885C12.7711 1.22866 11.4145 0.666707 10.0001 0.666707H6.66675"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    );
}
