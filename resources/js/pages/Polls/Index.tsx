import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { CalendarIcon, PencilIcon, PlusIcon, TrashIcon, UsersIcon } from 'lucide-react';
import { useState } from 'react';

// Components
import AppLayout from '@/layouts/app-layout';

interface PollOption {
    id: number;
    text: string;
    votes_count: number;
}

interface Poll {
    id: number;
    title: string;
    description: string | null;
    is_public: boolean;
    multiple_choice: boolean;
    ends_at: string | null;
    created_at: string;
    updated_at: string;
    all_votes_count: number;
    options: PollOption[];
}

interface PollsIndexProps {
    polls: {
        data: Poll[];
        links: any;
        meta: any;
    };
}

export default function PollsIndex({ polls }: PollsIndexProps) {
    const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const openDeleteModal = (poll: Poll) => {
        setSelectedPoll(poll);
        setIsDeleteModalOpen(true);
    };

    // Animation variants
    const containerAnimation = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemAnimation = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
    };

    return (
        <AppLayout title="My Polls">
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-8 flex items-center justify-between">
                        <h1 className="text-2xl font-semibold tracking-tight">My Polls</h1>
                        <Link
                            href={route('polls.create')}
                            className="inline-flex items-center rounded-md bg-[#8847BB] px-4 py-2 text-sm font-medium text-white hover:bg-[#7040a0] dark:bg-[#8847BB] dark:hover:bg-[#9957cb]"
                        >
                            <PlusIcon className="mr-2 h-4 w-4" />
                            New Poll
                        </Link>
                    </div>

                    {polls.data.length > 0 ? (
                        <motion.div
                            className="bg-background divide-y divide-[#19140025] rounded-md border border-[#19140035] dark:divide-[#3E3E3A] dark:border-[#3E3E3A]"
                            variants={containerAnimation}
                            initial="hidden"
                            animate="show"
                        >
                            {polls.data.map((poll) => {
                                // Calculate total votes and percentage for each option
                                const totalVotes = poll.all_votes_count || 0;
                                const hasEnded = poll.ends_at && new Date(poll.ends_at) <= new Date();

                                return (
                                    <motion.div key={poll.id} className="p-5" variants={itemAnimation}>
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                            <div className="mb-4 sm:mb-0">
                                                <Link
                                                    href={route('polls.show', poll.id)}
                                                    className="text-lg font-medium hover:text-[#8847BB] dark:hover:text-[#F9BAEE]"
                                                >
                                                    {poll.title}
                                                </Link>

                                                <div className="text-muted-foreground mt-1.5 flex flex-wrap gap-x-4 gap-y-2 text-xs">
                                                    <div className="flex items-center">
                                                        <UsersIcon className="mr-1.5 h-3.5 w-3.5" />
                                                        <span>
                                                            {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center">
                                                        <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
                                                        <span>
                                                            {poll.ends_at
                                                                ? hasEnded
                                                                    ? `Ended ${new Date(poll.ends_at).toLocaleDateString()}`
                                                                    : `Ends ${new Date(poll.ends_at).toLocaleDateString()}`
                                                                : 'No end date'}
                                                        </span>
                                                    </div>

                                                    <div
                                                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                                            poll.is_public
                                                                ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                                                                : 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'
                                                        }`}
                                                    >
                                                        {poll.is_public ? 'Public' : 'Private'}
                                                    </div>

                                                    {poll.multiple_choice && (
                                                        <div className="rounded-full bg-[#8847BB]/10 px-2 py-0.5 text-xs font-medium text-[#8847BB] dark:bg-[#8847BB]/20 dark:text-[#F9BAEE]">
                                                            Multiple choice
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={route('polls.show', poll.id)}
                                                    className="inline-flex items-center rounded-md bg-[#8847BB]/10 px-3 py-1.5 text-xs font-medium text-[#8847BB] hover:bg-[#8847BB]/20 dark:bg-[#8847BB]/20 dark:text-[#F9BAEE] dark:hover:bg-[#8847BB]/30"
                                                >
                                                    View
                                                </Link>

                                                <Link
                                                    href={route('polls.edit', poll.id)}
                                                    className="bg-background inline-flex items-center rounded-md border border-[#19140035] px-3 py-1.5 text-xs font-medium hover:bg-[#f5f5f3] dark:border-[#3E3E3A] dark:hover:bg-[#1C1C1A]"
                                                >
                                                    <PencilIcon className="mr-1.5 h-3 w-3" />
                                                    Edit
                                                </Link>

                                                <button
                                                    onClick={() => openDeleteModal(poll)}
                                                    className="inline-flex items-center rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-300 dark:hover:bg-red-900/30"
                                                >
                                                    <TrashIcon className="mr-1.5 h-3 w-3" />
                                                    Delete
                                                </button>
                                            </div>
                                        </div>

                                        {/* Preview top poll options */}
                                        <div className="mt-4 space-y-2">
                                            {poll.options.slice(0, 3).map((option) => {
                                                const percentage = totalVotes ? Math.round((option.votes_count / totalVotes) * 100) : 0;

                                                return (
                                                    <div key={option.id} className="text-sm">
                                                        <div className="flex items-center justify-between">
                                                            <span className="line-clamp-1">{option.text}</span>
                                                            <span className="text-muted-foreground ml-2 w-12 text-right text-xs">{percentage}%</span>
                                                        </div>
                                                        <div className="mt-1 h-1.5 w-full rounded-full bg-[#19140015] dark:bg-[#3E3E3A]/60">
                                                            <div
                                                                className="h-1.5 rounded-full bg-[#8847BB] dark:bg-[#F9BAEE]"
                                                                style={{ width: `${percentage}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            })}

                                            {poll.options.length > 3 && (
                                                <div className="text-muted-foreground text-xs">+{poll.options.length - 3} more options</div>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    ) : (
                        <div className="bg-background flex flex-col items-center justify-center rounded-lg border border-dashed border-[#19140035] p-12 text-center dark:border-[#3E3E3A]">
                            <div className="mb-4 text-6xl">📊</div>
                            <h3 className="text-xl font-medium">No polls yet</h3>
                            <p className="text-muted-foreground mt-2">Create your first poll to start collecting votes.</p>
                            <Link
                                href={route('polls.create')}
                                className="mt-4 inline-flex items-center rounded-md bg-[#8847BB] px-4 py-2 text-sm font-medium text-white hover:bg-[#7040a0] dark:bg-[#8847BB] dark:hover:bg-[#9957cb]"
                            >
                                <PlusIcon className="mr-2 h-4 w-4" />
                                Create First Poll
                            </Link>
                        </div>
                    )}

                    {polls.meta.last_page > 1 && (
                        <div className="mt-8 flex justify-center">
                            <nav className="flex space-x-1">
                                {polls.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url || '#'}
                                        className={`px-4 py-2 text-sm ${
                                            link.active
                                                ? 'bg-[#8847BB] text-white dark:bg-[#8847BB]'
                                                : link.url
                                                  ? 'hover:bg-[#f5f5f3] dark:hover:bg-[#1C1C1A]'
                                                  : 'cursor-default opacity-50'
                                        } rounded-md`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </nav>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete confirmation modal */}
            {isDeleteModalOpen && selectedPoll && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-background max-w-md rounded-lg p-6 shadow-lg dark:bg-[#0a0a0a]">
                        <h3 className="text-lg font-medium">Delete Poll</h3>
                        <p className="text-muted-foreground mt-2 text-sm">
                            Are you sure you want to delete "{selectedPoll.title}"? This action cannot be undone.
                        </p>
                        <div className="mt-5 flex justify-end space-x-3">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="bg-background rounded-md border border-[#19140035] px-4 py-2 text-sm font-medium hover:bg-[#f5f5f3] dark:border-[#3E3E3A] dark:hover:bg-[#1C1C1A]"
                                type="button"
                            >
                                Cancel
                            </button>
                            <Link
                                href={route('polls.destroy', selectedPoll.id)}
                                method="delete"
                                as="button"
                                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
                                type="button"
                                onClick={() => setIsDeleteModalOpen(false)}
                            >
                                Delete
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
