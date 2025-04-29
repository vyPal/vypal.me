import SEO from '@/components/SEO';
import React from 'react';

type SubLink = {
    id: number;
    title: string;
    url: string;
};

type Link = {
    id: number;
    title: string;
    type: LinkType;
    url: string | undefined;
    description: string | undefined;
    sublinks?: SubLink[];
};

enum LinkType {
    Website = 'website',
    Blog = 'blog',
    Social = 'social',
    Code = 'code',
    Other = 'other',
    Separator = 'separator',
}

export default function Index({ links }: { links: Link[] }) {
    // Helper function to render appropriate icon based on link type
    const renderLinkIcon = (type: LinkType) => {
        switch (type) {
            case LinkType.Website:
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                    </svg>
                );
            case LinkType.Blog:
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M5 3a1 1 0 000 2c5.523 0 10 4.477 10 10a1 1 0 102 0C17 8.373 11.627 3 5 3z" />
                        <path d="M4 9a1 1 0 011-1 7 7 0 017 7 1 1 0 11-2 0 5 5 0 00-5-5 1 1 0 01-1-1zM3 15a2 2 0 114 0 2 2 0 01-4 0z" />
                    </svg>
                );
            case LinkType.Social:
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                );
            case LinkType.Code:
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

    // Function to render different link components based on type
    const renderLinkItem = (link: Link) => {
        if (link.type === LinkType.Separator) {
            return (
                <div key={link.id} className="py-2">
                    <div className="flex items-center">
                        <div className="flex-grow border-t border-gray-600"></div>
                        {link.title && <span className="mx-2 text-sm font-semibold tracking-wider text-gray-400 uppercase">{link.title}</span>}
                        <div className="flex-grow border-t border-gray-600"></div>
                    </div>
                </div>
            );
        }

        // Color classes based on link type
        const getLinkColors = () => {
            switch (link.type) {
                case LinkType.Website:
                    return 'border-blue-700 hover:border-blue-500 group-hover:text-blue-400';
                case LinkType.Blog:
                    return 'border-green-700 hover:border-green-500 group-hover:text-green-400';
                case LinkType.Social:
                    return 'border-purple-700 hover:border-purple-500 group-hover:text-purple-400';
                case LinkType.Code:
                    return 'border-amber-700 hover:border-amber-500 group-hover:text-amber-400';
                default:
                    return 'border-gray-700 hover:border-gray-500 group-hover:text-gray-300';
            }
        };

        return (
            <div
                key={link.id}
                className={`block transform rounded-lg border bg-gray-800 p-4 transition-all duration-300 hover:bg-gray-700 hover:shadow-lg ${getLinkColors()}`}
            >
                {/* Main link content */}
                <a href={link.url} target="_blank" rel="noopener noreferrer" className="group flex items-center">
                    <div className="mr-3 text-gray-400 transition-colors group-hover:text-inherit">{renderLinkIcon(link.type)}</div>
                    <div className="flex-grow">
                        <h2 className="font-semibold text-white transition-colors group-hover:text-inherit">{link.title}</h2>
                        {link.description && <p className="text-sm text-gray-400">{link.description}</p>}
                    </div>
                    <div className="text-gray-400 transition-colors group-hover:text-inherit">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                        </svg>
                    </div>
                </a>

                {/* Sublinks section */}
                {link.sublinks && link.sublinks.length > 0 && (
                    <div className="mt-3 border-t border-gray-700 pt-3">
                        <div className="flex flex-wrap items-center gap-2">
                            {link.sublinks.map((sublink, index) => (
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
        <>
            <SEO
                title="vyPal's Links"
                description="Connect with me across platforms. Find my social profiles, projects, websites, and code repositories all in one place."
                keywords="vyPal, Jakub Palacký, links, social media, portfolio, projects, developer links"
            />

            <div className="min-h-screen bg-gray-900 py-16">
                <div className="mx-auto max-w-lg px-4">
                    <div className="mb-4 flex flex-col items-center">
                        <div className="mb-4 h-28 w-28 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-1">
                            <div className="h-full w-full overflow-hidden rounded-full bg-gray-800">
                                <img src="/media/vypal.png" alt="Profile" className="h-full w-full object-cover" />
                            </div>
                        </div>
                        <h1 className="mb-2 text-2xl font-bold text-white">vyPal</h1>
                        <p className="mb-6 max-w-sm text-center text-gray-400">
                            Hey 👋
                            <br />
                            I'm vyPal, a self-tought developer.
                            <br />I enjoy pretty much anything related to a computer.
                        </p>
                    </div>

                    {/* Links Section */}
                    <div className="space-y-4">{links.map(renderLinkItem)}</div>

                    <div className="mt-12 text-center text-sm text-gray-500">
                        <p>© {new Date().getFullYear()} Jakub Palacký</p>
                        <p className="mt-1">Built with Laravel, Inertia, and React</p>
                    </div>
                </div>
            </div>
        </>
    );
}
