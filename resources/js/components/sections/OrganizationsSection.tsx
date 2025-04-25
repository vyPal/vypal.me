import { useRef } from 'react';

interface OrganizationsSectionProps {
    scrollY: number;
}

export default function OrganizationsSection({ scrollY }: OrganizationsSectionProps) {
    const sectionRef = useRef<HTMLElement>(null);
    const isVisible = scrollY > (sectionRef.current?.offsetTop || 0) - 500;

    // Define your GitHub organizations
    const organizations = [
        {
            name: 'The Test Trove',
            description: 'Curated and supported repository of test engineering resources',
            url: 'https://github.com/the-test-trove',
            logo: 'https://github.com/the-test-trove.png',
            role: 'Member',
        },
        {
            name: 'DislikesSchool',
            description: 'The home of the EduPage2 project',
            url: 'https://github.com/DislikesSchool',
            logo: 'https://github.com/DislikesSchool.png',
            role: 'Maintainer',
        },
        {
            name: 'PumpkinPlugins',
            description: 'High quality plugins for Minecraft servers running on the Pumpkin server software',
            url: 'https://github.com/PumpkinPlugins',
            logo: 'https://github.com/PumpkinPlugins.png',
            role: 'Maintainer',
        },
    ];

    return (
        <section ref={sectionRef} className="py-20 md:py-32" id="organizations">
            <div className="container mx-auto px-6">
                <div className="mx-auto max-w-5xl">
                    <h2
                        className={`mb-4 text-3xl font-bold transition-all duration-700 md:text-4xl ${
                            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                        }`}
                    >
                        GitHub <span className="text-[#f53003] dark:text-[#FF4433]">Organizations</span>
                    </h2>

                    <p
                        className={`mb-12 max-w-2xl text-[#706f6c] transition-all delay-200 duration-700 dark:text-[#A1A09A] ${
                            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                        }`}
                    >
                        I'm also a member of several GitHub organizations, where I collaborate with amazing developers around the world.
                    </p>

                    <div className="grid gap-6 md:grid-cols-3">
                        {organizations.map((org, index) => (
                            <OrganizationCard key={index} organization={org} isVisible={isVisible} index={index} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

interface OrganizationCardProps {
    organization: {
        name: string;
        description: string;
        url: string;
        logo: string;
        role: string;
    };
    isVisible: boolean;
    index: number;
}

function OrganizationCard({ organization, isVisible, index }: OrganizationCardProps) {
    const delay = 300 + index * 150;

    return (
        <a
            href={organization.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`group rounded-lg border border-[#e3e3e0] bg-white p-6 shadow-sm transition-all duration-500 hover:shadow-md dark:border-[#3E3E3A] dark:bg-[#161615] ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            <div className="flex flex-col items-center text-center">
                <div className="mb-4 h-20 w-20 overflow-hidden rounded-full">
                    <img
                        src={organization.logo}
                        alt={organization.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                </div>

                <h3 className="mb-1 font-medium">{organization.name}</h3>
                <span className="mb-3 rounded-full bg-[#e3e3e0] px-3 py-0.5 text-xs dark:bg-[#1C1C1A]">{organization.role}</span>

                <p className="text-sm text-[#706f6c] dark:text-[#A1A09A]">{organization.description}</p>
            </div>
        </a>
    );
}
