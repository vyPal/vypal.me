import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import React, { useState } from 'react';

interface PollOption {
    id: number;
    title: string;
    color?: string;
    icon?: string;
}

interface Poll {
    id: number;
    title: string;
    type: 'yes_no' | 'multiple_choice' | 'ranking' | 'custom_input';
    description?: string;
    is_active: boolean;
    options: PollOption[];
    order: number;
}

interface Props {
    polls: Poll[];
}

const breadcrumbs = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Poll Manager',
        href: '/dashboard/polls',
    },
];

export default function PollsIndex({ polls }: Props) {
    const [isReordering, setIsReordering] = useState(false);
    const [reorderedPolls, setReorderedPolls] = useState<Poll[]>([...polls]);

    const handleDragStart = (e: React.DragEvent, index: number) => {
        e.dataTransfer.setData('index', index.toString());
        e.currentTarget.classList.add('opacity-50');
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.currentTarget.classList.add('bg-gray-700');
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.currentTarget.classList.remove('bg-gray-700');
    };

    const handleDrop = (e: React.DragEvent, toIndex: number) => {
        e.preventDefault();
        e.currentTarget.classList.remove('bg-gray-700');

        const fromIndex = parseInt(e.dataTransfer.getData('index'));
        if (fromIndex === toIndex) return;

        const newPolls = [...reorderedPolls];
        const [movedPoll] = newPolls.splice(fromIndex, 1);
        newPolls.splice(toIndex, 0, movedPoll);

        // Update order property
        const updatedPolls = newPolls.map((poll, index) => ({
            ...poll,
            order: index,
        }));

        setReorderedPolls(updatedPolls);
    };

    const handleDragEnd = (e: React.DragEvent) => {
        e.currentTarget.classList.remove('opacity-50');
    };

    const saveReordering = () => {
        router.post(
            route('polls.reorder'),
            {
                polls: reorderedPolls.map((poll, index) => ({
                    id: poll.id,
                    order: index,
                })),
            },
            {
                onSuccess: () => {
                    setIsReordering(false);
                },
            },
        );
    };

    const cancelReordering = () => {
        setReorderedPolls([...polls]);
        setIsReordering(false);
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this poll?')) {
            router.delete(route('polls.destroy', id));
        }
    };

    const getPollTypeLabel = (type: string) => {
        switch (type) {
            case 'yes_no':
                return 'Yes/No';
            case 'multiple_choice':
                return 'Multiple Choice';
            case 'ranking':
                return 'Ranking';
            case 'custom_input':
                return 'Custom Input';
            default:
                return type;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Poll Manager" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold">Poll Manager</h1>
                    <div className="flex gap-2">
                        {isReordering ? (
                            <>
                                <button onClick={saveReordering} className="rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600">
                                    Save Order
                                </button>
                                <button onClick={cancelReordering} className="rounded-md bg-gray-500 px-4 py-2 text-white hover:bg-gray-600">
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => setIsReordering(true)}
                                    className="rounded-md bg-amber-500 px-4 py-2 text-white hover:bg-amber-600"
                                >
                                    Reorder Polls
                                </button>
                                <Link href={route('polls.create')} className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
                                    Create New Poll
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                <div className="rounded-xl bg-gray-800 p-4">
                    {(isReordering ? reorderedPolls : polls).length === 0 ? (
                        <div className="py-8 text-center text-gray-400">No polls created yet. Click "Create New Poll" to get started.</div>
                    ) : (
                        <div className="space-y-4">
                            {(isReordering ? reorderedPolls : polls).map((poll, index) => (
                                <div
                                    key={poll.id}
                                    className={`flex items-center justify-between rounded-lg bg-gray-700 p-4 transition-colors ${
                                        isReordering ? 'cursor-move' : ''
                                    }`}
                                    draggable={isReordering}
                                    onDragStart={isReordering ? (e) => handleDragStart(e, index) : undefined}
                                    onDragOver={isReordering ? handleDragOver : undefined}
                                    onDragLeave={isReordering ? handleDragLeave : undefined}
                                    onDrop={isReordering ? (e) => handleDrop(e, index) : undefined}
                                    onDragEnd={isReordering ? handleDragEnd : undefined}
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            {isReordering && (
                                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-600 text-xs">
                                                    {index + 1}
                                                </span>
                                            )}
                                            <div className="font-medium">{poll.title}</div>
                                            <span
                                                className={`rounded-full px-2 py-0.5 text-xs ${
                                                    poll.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                                }`}
                                            >
                                                {poll.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-400">
                                            Type: {getPollTypeLabel(poll.type)} •{poll.options.length} options
                                        </div>
                                    </div>

                                    {!isReordering && (
                                        <div className="flex space-x-2">
                                            <Link
                                                href={route('polls.edit', poll.id)}
                                                className="rounded-md bg-amber-500 px-3 py-1 text-sm text-white hover:bg-amber-600"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(poll.id)}
                                                className="rounded-md bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
                                            >
                                                Delete
                                            </button>
                                            <Link
                                                href={`/polls/${poll.id}`}
                                                target="_blank"
                                                className="rounded-md bg-purple-500 px-3 py-1 text-sm text-white hover:bg-purple-600"
                                            >
                                                View
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Stats and Quick Tips */}
                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="rounded-xl bg-gray-800 p-4">
                        <h2 className="mb-3 text-lg font-semibold">Poll Statistics</h2>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-lg bg-gray-700 p-3">
                                <div className="text-sm text-gray-400">Total Polls</div>
                                <div className="text-2xl font-bold">{polls.length}</div>
                            </div>
                            <div className="rounded-lg bg-gray-700 p-3">
                                <div className="text-sm text-gray-400">Active Polls</div>
                                <div className="text-2xl font-bold">{polls.filter((p) => p.is_active).length}</div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl bg-gray-800 p-4">
                        <h2 className="mb-3 text-lg font-semibold">Quick Tips</h2>
                        <ul className="list-inside list-disc space-y-1 text-sm text-gray-400">
                            <li>Create interactive polls to engage your website visitors</li>
                            <li>Use different poll types for different kinds of feedback</li>
                            <li>Customize colors and icons to match your branding</li>
                            <li>Reorder polls to highlight the most important ones</li>
                        </ul>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
