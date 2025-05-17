import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { CalendarIcon, PlusCircleIcon, XIcon } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';

// Components
import AppLayout from '@/layouts/app-layout';

interface PollOption {
    id?: number;
    text: string;
    votes_count?: number;
    [key: string]: number | string | undefined;
}

interface Poll {
    id: number;
    title: string;
    description: string | null;
    is_public: boolean;
    multiple_choice: boolean;
    ends_at: string | null;
    options: PollOption[];
    all_votes_count?: number;
    [key: string]: number | string | boolean | null | undefined | PollOption[];
}

interface EditPollProps {
    poll: Poll;
}

export default function EditPoll({ poll }: EditPollProps) {
    const { data, setData, put, processing, errors } = useForm<Required<Poll>>({
        id: poll.id,
        title: poll.title,
        description: poll.description || '',
        is_public: poll.is_public,
        multiple_choice: poll.multiple_choice,
        ends_at: poll.ends_at,
        options: poll.options || [],
        all_votes_count: poll.all_votes_count || 0,
    });

    const [showDatePicker, setShowDatePicker] = useState(!!poll.ends_at);
    const [hasVotes, setHasVotes] = useState(false);

    useEffect(() => {
        // Check if any options have votes
        setHasVotes(poll.all_votes_count !== undefined && poll.all_votes_count > 0);
    }, [poll]);

    const addOption = () => {
        setData('options', [...data.options, { text: '' }]);
    };

    const removeOption = (index: number) => {
        if (data.options.length > 2) {
            const updatedOptions = [...data.options];
            updatedOptions.splice(index, 1);
            setData('options', updatedOptions);
        }
    };

    const updateOption = (index: number, value: string) => {
        const updatedOptions = [...data.options];
        updatedOptions[index] = {
            ...updatedOptions[index],
            text: value,
        };
        setData('options', updatedOptions);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(route('polls.update', poll.id), {
            preserveScroll: true,
            onSuccess: () => {
                // Show success message
            },
        });
    };

    // Animation variants
    const formAnimation = {
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
        <AppLayout>
            <Head title={`Edit Poll: ${poll.title}`} />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-semibold tracking-tight">Edit Poll</h1>
                            <div className="flex space-x-4">
                                <Link href={route('polls.show', poll.id)} className="text-muted-foreground hover:text-foreground text-sm">
                                    View Poll
                                </Link>
                                <Link href={route('polls.index')} className="text-muted-foreground hover:text-foreground text-sm">
                                    Back to Polls
                                </Link>
                            </div>
                        </div>
                        <p className="text-muted-foreground mt-2 text-sm">Update your poll details and options.</p>
                    </div>

                    {hasVotes && (
                        <div className="mb-6 rounded-md bg-amber-50 p-4 text-sm text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
                            <p className="font-semibold">Warning: This poll has received votes</p>
                            <p>You can update the poll details, but you cannot modify existing options once votes have been cast.</p>
                        </div>
                    )}

                    <motion.form onSubmit={handleSubmit} className="space-y-8" variants={formAnimation} initial="hidden" animate="show">
                        {/* Poll Basic Info */}
                        <motion.div
                            className="bg-background space-y-4 rounded-lg border border-[#19140035] p-6 dark:border-[#3E3E3A]"
                            variants={itemAnimation}
                        >
                            <h2 className="font-medium">Poll Information</h2>

                            <div className="space-y-1">
                                <label htmlFor="title" className="text-sm font-medium">
                                    Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="title"
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className="bg-background mt-1 w-full rounded-md border border-[#19140035] px-3 py-2 text-sm focus:border-[#8847BB] focus:ring-2 focus:ring-[#8847BB]/20 focus:outline-none dark:border-[#3E3E3A] dark:focus:border-[#F9BAEE] dark:focus:ring-[#F9BAEE]/20"
                                    placeholder="Enter poll title"
                                />
                                {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
                            </div>

                            <div className="space-y-1">
                                <label htmlFor="description" className="text-sm font-medium">
                                    Description <span className="text-muted-foreground text-xs">(optional)</span>
                                </label>
                                <textarea
                                    id="description"
                                    value={data.description || ''}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="bg-background mt-1 w-full rounded-md border border-[#19140035] px-3 py-2 text-sm focus:border-[#8847BB] focus:ring-2 focus:ring-[#8847BB]/20 focus:outline-none dark:border-[#3E3E3A] dark:focus:border-[#F9BAEE] dark:focus:ring-[#F9BAEE]/20"
                                    placeholder="Provide additional context for your poll"
                                    rows={3}
                                />
                                {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
                            </div>

                            <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                                <div className="flex items-center space-x-2">
                                    <input
                                        id="is_public"
                                        type="checkbox"
                                        checked={data.is_public}
                                        onChange={() => setData('is_public', !data.is_public)}
                                        className="h-4 w-4 rounded border-[#19140035] text-[#8847BB] focus:ring-2 focus:ring-[#8847BB]/20 dark:border-[#3E3E3A] dark:text-[#F9BAEE] dark:focus:ring-[#F9BAEE]/20"
                                    />
                                    <label htmlFor="is_public" className="text-sm">
                                        Make poll public
                                    </label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <input
                                        id="multiple_choice"
                                        type="checkbox"
                                        checked={data.multiple_choice}
                                        onChange={() => setData('multiple_choice', !data.multiple_choice)}
                                        className="h-4 w-4 rounded border-[#19140035] text-[#8847BB] focus:ring-2 focus:ring-[#8847BB]/20 dark:border-[#3E3E3A] dark:text-[#F9BAEE] dark:focus:ring-[#F9BAEE]/20"
                                        disabled={hasVotes} // Disable if votes exist
                                    />
                                    <label htmlFor="multiple_choice" className={`text-sm ${hasVotes ? 'opacity-60' : ''}`}>
                                        Allow multiple choices
                                    </label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <input
                                        id="has_end_date"
                                        type="checkbox"
                                        checked={showDatePicker}
                                        onChange={() => {
                                            setShowDatePicker(!showDatePicker);
                                            if (!showDatePicker) {
                                                const tomorrow = new Date();
                                                tomorrow.setDate(tomorrow.getDate() + 1);
                                                setData('ends_at', tomorrow.toISOString().split('T')[0]);
                                            } else {
                                                setData('ends_at', null);
                                            }
                                        }}
                                        className="h-4 w-4 rounded border-[#19140035] text-[#8847BB] focus:ring-2 focus:ring-[#8847BB]/20 dark:border-[#3E3E3A] dark:text-[#F9BAEE] dark:focus:ring-[#F9BAEE]/20"
                                    />
                                    <label htmlFor="has_end_date" className="text-sm">
                                        Set end date
                                    </label>
                                </div>
                            </div>

                            {showDatePicker && (
                                <div className="space-y-1">
                                    <label htmlFor="ends_at" className="flex items-center text-sm font-medium">
                                        <CalendarIcon className="mr-1.5 h-4 w-4" />
                                        End Date
                                    </label>
                                    <input
                                        id="ends_at"
                                        type="date"
                                        value={data.ends_at ? data.ends_at.substring(0, 10) : ''}
                                        onChange={(e) => setData('ends_at', e.target.value)}
                                        className="bg-background mt-1 w-full rounded-md border border-[#19140035] px-3 py-2 text-sm focus:border-[#8847BB] focus:ring-2 focus:ring-[#8847BB]/20 focus:outline-none dark:border-[#3E3E3A] dark:focus:border-[#F9BAEE] dark:focus:ring-[#F9BAEE]/20"
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                    {errors.ends_at && <p className="mt-1 text-xs text-red-500">{errors.ends_at}</p>}
                                </div>
                            )}
                        </motion.div>

                        {/* Poll Options */}
                        <motion.div
                            className="bg-background space-y-4 rounded-lg border border-[#19140035] p-6 dark:border-[#3E3E3A]"
                            variants={itemAnimation}
                        >
                            <div className="flex items-center justify-between">
                                <h2 className="font-medium">Poll Options</h2>
                                <p className="text-muted-foreground text-xs">Minimum 2 options required</p>
                            </div>

                            {errors.options && <p className="mt-1 text-xs text-red-500">{errors.options}</p>}

                            <div className="space-y-3">
                                {data.options.map((option, index) => {
                                    const isExistingOption = option.id !== undefined;
                                    const hasOptionVotes = hasVotes && isExistingOption;

                                    return (
                                        <div key={option.id || index} className="flex items-center space-x-2">
                                            <input
                                                type="text"
                                                value={option.text}
                                                onChange={(e) => updateOption(index, e.target.value)}
                                                className={`bg-background flex-1 rounded-md border border-[#19140035] px-3 py-2 text-sm focus:border-[#8847BB] focus:ring-2 focus:ring-[#8847BB]/20 focus:outline-none dark:border-[#3E3E3A] dark:focus:border-[#F9BAEE] dark:focus:ring-[#F9BAEE]/20 ${hasOptionVotes ? 'cursor-not-allowed opacity-60' : ''}`}
                                                placeholder={`Option ${index + 1}`}
                                                disabled={hasOptionVotes}
                                            />

                                            <button
                                                type="button"
                                                onClick={() => removeOption(index)}
                                                disabled={data.options.length <= 2 || hasOptionVotes}
                                                className="text-muted-foreground rounded-full p-1 hover:bg-[#f5f5f3] hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-[#1C1C1A]"
                                                title={hasOptionVotes ? 'Cannot remove options with votes' : 'Remove option'}
                                            >
                                                <XIcon className="h-4 w-4" />
                                            </button>

                                            {option.votes_count !== undefined && option.votes_count > 0 && (
                                                <span className="text-muted-foreground ml-2 text-xs">
                                                    {option.votes_count} {option.votes_count === 1 ? 'vote' : 'votes'}
                                                </span>
                                            )}

                                            {errors[`options.${index}.text`] && (
                                                <p className="text-xs text-red-500">{errors[`options.${index}.text`]}</p>
                                            )}
                                        </div>
                                    );
                                })}

                                <button
                                    type="button"
                                    onClick={addOption}
                                    className="bg-background text-muted-foreground mt-2 inline-flex w-full items-center justify-center rounded-md border border-dashed border-[#19140035] px-3 py-2 text-sm font-medium hover:border-[#8847BB] hover:text-[#8847BB] dark:border-[#3E3E3A] dark:hover:border-[#F9BAEE] dark:hover:text-[#F9BAEE]"
                                >
                                    <PlusCircleIcon className="mr-1.5 h-4 w-4" />
                                    Add Option
                                </button>
                            </div>
                        </motion.div>

                        {/* Form Actions */}
                        <motion.div className="flex justify-end space-x-3" variants={itemAnimation}>
                            <Link
                                href={route('polls.index')}
                                className="bg-background rounded-md border border-[#19140035] px-4 py-2 text-sm font-medium hover:bg-[#f5f5f3] dark:border-[#3E3E3A] dark:hover:bg-[#1C1C1A]"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-md bg-[#8847BB] px-4 py-2 text-sm font-medium text-white hover:bg-[#7040a0] disabled:opacity-70 dark:bg-[#8847BB] dark:hover:bg-[#9957cb]"
                            >
                                {processing ? 'Saving...' : 'Update Poll'}
                            </button>
                        </motion.div>
                    </motion.form>
                </div>
            </div>
        </AppLayout>
    );
}
