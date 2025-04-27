import { useRef } from 'react';

interface ContributionsSectionProps {
    scrollY: number;
}

export default function ContributionsSection({ scrollY }: ContributionsSectionProps) {
    const sectionRef = useRef<HTMLElement>(null);
    const isVisible = scrollY > (sectionRef.current?.offsetTop || 0) - 500;

    // Define your open source contributions
    const contributions = [
        {
            project: 'Pumpkin',
            description: 'Various bug fixes and improvements, but most importantly I wrote the original plugin system (still in use)',
            url: 'https://github.com/Pumpkin-MC/Pumpkin/issues?q=author%3AvyPal',
            type: 'feature',
            label: 'Features and Bug Fixes',
        },
        {
            project: 'Libvirt',
            description:
                'Fix a BSD-specific issue with password input, and adapt code to prepare for update to libxml2 (I was on a internship at Red Hat)',
            url: 'https://gitlab.com/libvirt/libvirt/-/commits/master?ref_type=HEADS&author=jpalacky@redhat.com',
            type: 'bugfix',
            label: 'Bug Fixes and Future Preparation',
        },
        {
            project: 'Mimlex Vault',
            description: 'Created and maintained a storage backend for Mimlex (a small community Android ROM project)',
            url: 'https://github.com/Mimlex/Vault',
            type: 'maintainer',
            label: 'Maintainer',
        },
    ];

    return (
        <section ref={sectionRef} className="bg-[#f5f5f3] py-20 md:py-32 dark:bg-[#0d0d0d]" id="contributions">
            <div className="container mx-auto px-6">
                <div className="mx-auto max-w-5xl">
                    <h2
                        className={`mb-4 text-3xl font-bold transition-all duration-700 md:text-4xl ${
                            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                        }`}
                    >
                        Open Source <span className="text-[#8847BB] dark:text-[#8847BB]">Contributions</span>
                    </h2>

                    <p
                        className={`mb-12 max-w-2xl text-[#706f6c] transition-all delay-200 duration-700 dark:text-[#A1A09A] ${
                            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                        }`}
                    >
                        I also like to work on open source projects. Here are some of the larger projects that I have contributed to:
                    </p>

                    <div className="space-y-6">
                        {contributions.map((contribution, index) => (
                            <ContributionCard key={index} contribution={contribution} isVisible={isVisible} index={index} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

interface ContributionCardProps {
    contribution: {
        project: string;
        description: string;
        url: string;
        label: string;
        type: string;
    };
    isVisible: boolean;
    index: number;
}

function ContributionCard({ contribution, isVisible, index }: ContributionCardProps) {
    const delay = 300 + index * 150;

    return (
        <div
            className={`rounded-lg border border-[#e3e3e0] bg-white p-6 shadow-sm transition-all duration-700 dark:border-[#3E3E3A] dark:bg-[#161615] ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            <div className="mb-4 flex items-start justify-between">
                <h3 className="font-medium">{contribution.project}</h3>
                <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                        contribution.type === 'bugfix'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                            : contribution.type === 'feature'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                              : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                    }`}
                >
                    {contribution.label}
                </span>
            </div>

            <p className="mb-4 text-[#706f6c] dark:text-[#A1A09A]">{contribution.description}</p>

            <a
                href={contribution.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm font-medium text-[#8847BB] hover:text-[#8847BB]/65 dark:text-[#8847BB] dark:hover:text-[#F9BAEE]"
            >
                <span>View Contribution</span>
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
        </div>
    );
}
