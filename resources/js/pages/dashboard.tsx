import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <Link
                        href="/dashboard/links"
                        className="border-sidebar-border/70 dark:border-sidebar-border group relative aspect-video overflow-hidden rounded-xl border bg-gray-800 transition-colors hover:bg-gray-700"
                    >
                        <div className="absolute inset-0 flex size-full flex-col justify-between p-4">
                            <div>
                                <h3 className="text-lg font-semibold transition-colors group-hover:text-blue-400">Link Manager</h3>
                                <p className="text-sm text-gray-400">Add, edit or remove links from your LinkTree page</p>
                            </div>
                            <div className="flex justify-end">
                                <span className="rounded-full bg-blue-500 p-1.5">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path
                                            fillRule="evenodd"
                                            d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </span>
                            </div>
                        </div>
                    </Link>
                    <Link
                        href="/dashboard/polls"
                        className="border-sidebar-border/70 dark:border-sidebar-border group relative aspect-video overflow-hidden rounded-xl border bg-gray-800 transition-colors hover:bg-gray-700"
                    >
                        <div className="absolute inset-0 flex size-full flex-col justify-between p-4">
                            <div>
                                <h3 className="text-lg font-semibold transition-colors group-hover:text-green-400">Poll Manager</h3>
                                <p className="text-sm text-gray-400">Create and manage interactive polls for site visitors</p>
                            </div>
                            <div className="flex justify-end">
                                <span className="rounded-full bg-green-500 p-1.5">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                                        <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                                    </svg>
                                </span>
                            </div>
                        </div>
                    </Link>
                    <Link
                        href="/dashboard/availability"
                        className="border-sidebar-border/70 dark:border-sidebar-border group relative aspect-video overflow-hidden rounded-xl border bg-gray-800 transition-colors hover:bg-gray-700"
                    >
                        <div className="absolute inset-0 flex size-full flex-col justify-between p-4">
                            <div>
                                <h3 className="text-lg font-semibold transition-colors group-hover:text-amber-400">Availability Manager</h3>
                                <p className="text-sm text-gray-400">Manage your availability status and project backlog</p>
                            </div>
                            <div className="flex justify-end">
                                <span className="rounded-full bg-amber-500 p-1.5">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </span>
                            </div>
                        </div>
                    </Link>
                    <a
                        href="https://umami.vypal.me/websites/7b165982-1021-46e6-aa14-d99fc5049972"
                        target="_blank"
                        className="border-sidebar-border/70 dark:border-sidebar-border group relative aspect-video overflow-hidden rounded-xl border bg-gray-800 transition-colors hover:bg-gray-700"
                    >
                        <div className="absolute inset-0 flex size-full flex-col justify-between p-4">
                            <div>
                                <h3 className="text-lg font-semibold transition-colors group-hover:text-purple-400">Umami Analytics</h3>
                                <p className="text-sm text-gray-400">Track your website's traffic and user behavior</p>
                            </div>
                            <div className="flex justify-end">
                                <span className="rounded-full bg-purple-500 p-1.5">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path
                                            fillRule="evenodd"
                                            d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </span>
                            </div>
                        </div>
                    </a>
                </div>
            </div>
        </AppLayout>
    );
}
