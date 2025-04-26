import { useRef } from 'react';

interface SkillsSectionProps {
    scrollY: number;
}

export default function SkillsSection({ scrollY }: SkillsSectionProps) {
    const sectionRef = useRef<HTMLElement>(null);
    const isVisible = scrollY > (sectionRef.current?.offsetTop || 0) - 500;

    // Define your skills
    const frontendSkills = [
        { name: 'React', level: 97 },
        { name: 'JavaScript', level: 95 },
        { name: 'TypeScript', level: 85 },
        { name: 'HTML/CSS', level: 90 },
        { name: 'Tailwind CSS', level: 65 },
    ];

    const backendSkills = [
        { name: 'Node.js', level: 96 },
        { name: 'Golang', level: 88 },
        { name: 'Rust', level: 76 },
        { name: 'C/C++', level: 85 },
        { name: 'PostgreSQL', level: 90 },
    ];

    const toolsSkills = [
        { name: 'Git', level: 93 },
        { name: 'Docker', level: 75 },
        { name: 'CI/CD', level: 80 },
        { name: 'Testing', level: 85 },
        { name: 'Serverless', level: 45 },
    ];

    return (
        <section ref={sectionRef} className="bg-[#f5f5f3] py-20 md:py-32 dark:bg-[#0d0d0d]" id="skills">
            <div className="container mx-auto px-6">
                <div className="mx-auto max-w-4xl">
                    <h2
                        className={`mb-4 text-3xl font-bold transition-all duration-700 md:text-4xl ${
                            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                        }`}
                    >
                        Skills & <span className="text-[#8847BB] dark:text-[#8847BB]">Technologies</span>
                    </h2>

                    <p
                        className={`mb-12 max-w-2xl text-[#706f6c] transition-all delay-200 duration-700 dark:text-[#A1A09A] ${
                            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                        }`}
                    >
                        I've worked with many programming languages, frameworks, and tools. Here is a small selection (you can view more on{' '}
                        <a href="https://wakatime.com/@vyPal" className="text-[#8847BB] dark:text-[#8847BB]" target="_blank">
                            Wakatime
                        </a>
                        ):
                    </p>

                    <div className="grid gap-8 md:grid-cols-3">
                        <SkillCategory title="Frontend" skills={frontendSkills} isVisible={isVisible} delay={300} />

                        <SkillCategory title="Backend" skills={backendSkills} isVisible={isVisible} delay={500} />

                        <SkillCategory title="Tools & Others" skills={toolsSkills} isVisible={isVisible} delay={700} />
                    </div>
                </div>
            </div>
        </section>
    );
}

interface SkillCategoryProps {
    title: string;
    skills: { name: string; level: number }[];
    isVisible: boolean;
    delay: number;
}

function SkillCategory({ title, skills, isVisible, delay }: SkillCategoryProps) {
    return (
        <div
            className={`transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            <h3 className="mb-6 text-xl font-medium">{title}</h3>
            <div className="space-y-4">
                {skills.map((skill, index) => (
                    <div key={index}>
                        <div className="mb-1 flex justify-between">
                            <span className="font-medium">{skill.name}</span>
                            <span className="text-sm text-[#706f6c] dark:text-[#A1A09A]">{skill.level}%</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-[#e3e3e0] dark:bg-[#1C1C1A]">
                            <div
                                className="h-full rounded-full bg-[#8847BB] dark:bg-[#8847BB]"
                                style={{
                                    width: isVisible ? `${skill.level}%` : '0%',
                                    transition: `width 1s ease-in-out ${delay + index * 100}ms`,
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
