import { Link } from '@inertiajs/react';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';

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
    user: {
        id: number;
        name: string;
    };
}

interface LatestPollSectionProps {
    scrollY: number;
}

export default function LatestPollSection({ scrollY }: LatestPollSectionProps) {
    const [latestPoll, setLatestPoll] = useState<Poll | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
    const [userVotes, setUserVotes] = useState<number[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showAllOptions, setShowAllOptions] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);

    // Maximum number of options to show initially
    const MAX_OPTIONS_VISIBLE = 3;

    useEffect(() => {
        const fetchLatestPoll = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get('/api/latest-poll');
                setLatestPoll(response.data.poll);
                setUserVotes(response.data.userVotes || []);
            } catch {
                setError('Failed to load the latest poll');
            } finally {
                setIsLoading(false);
            }
        };

        fetchLatestPoll();
    }, []);

    const hasVoted = userVotes && userVotes.length > 0;
    const hasEnded = latestPoll?.ends_at && new Date(latestPoll.ends_at) <= new Date();
    const totalVotes = latestPoll?.all_votes_count || 0;
    const showExpandButton = latestPoll && latestPoll.options.length > MAX_OPTIONS_VISIBLE;

    const handleOptionSelect = (optionId: number) => {
        if (hasVoted || hasEnded || isSubmitting) return;

        if (latestPoll?.multiple_choice) {
            setSelectedOptions((prev) => (prev.includes(optionId) ? prev.filter((id) => id !== optionId) : [...prev, optionId]));
        } else {
            setSelectedOptions([optionId]);
        }
    };

    const submitVote = async () => {
        if (!selectedOptions.length || !latestPoll) {
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const payload = latestPoll.multiple_choice ? { option_ids: selectedOptions } : { option_id: selectedOptions[0] };

            const response = await axios.post(`/polls/${latestPoll.id}/vote`, payload);

            // Update poll data with new vote counts
            setLatestPoll(response.data.poll);

            // Update user votes
            setUserVotes(selectedOptions);

            // Show success message
            setSuccess('Your vote has been recorded!');

            // Clear selected options
            setSelectedOptions([]);

            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccess(null);
            }, 3000);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to submit your vote');
        } finally {
            setIsSubmitting(false);
        }
    };

    const visibleOptions = showAllOptions ? latestPoll?.options : latestPoll?.options.slice(0, MAX_OPTIONS_VISIBLE);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0, y: 100 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: 'easeOut',
                when: 'beforeChildren',
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <section className="py-16 lg:py-24">
            <div className="container mx-auto px-6">
                <motion.div
                    className="mb-10 text-center"
                    initial="hidden"
                    animate={scrollY > 2200 ? 'visible' : 'hidden'}
                    variants={containerVariants}
                >
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Community Polls</h2>
                    <p className="text-muted-foreground mt-4 text-lg">Vote on polls and see what others think</p>
                </motion.div>

                {isLoading ? (
                    <div className="flex h-48 items-center justify-center">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#8847BB] border-t-transparent"></div>
                    </div>
                ) : error ? (
                    <div className="rounded-md bg-red-50 p-4 text-center text-red-700 dark:bg-red-900/20 dark:text-red-300">{error}</div>
                ) : !latestPoll ? (
                    <div className="rounded-md bg-amber-50 p-4 text-center text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
                        No polls available at the moment.
                    </div>
                ) : (
                    <motion.div
                        className="grid gap-8 lg:grid-cols-5"
                        initial="hidden"
                        animate={scrollY > 2200 ? 'visible' : 'hidden'}
                        variants={containerVariants}
                    >
                        {/* Poll content - takes up 3/5 of the grid */}
                        <motion.div
                            className="bg-background relative rounded-lg border border-[#19140035] p-6 shadow-sm lg:col-span-3 dark:border-[#3E3E3A]"
                            variants={itemVariants}
                        >
                            <div className="mb-4">
                                <h3 className="text-xl font-semibold">{latestPoll.title}</h3>
                                {latestPoll.description && <p className="text-muted-foreground mt-2 text-sm">{latestPoll.description}</p>}
                            </div>

                            {/* Poll type indicators */}
                            <div className="mt-2 mb-4 flex flex-wrap gap-2 text-xs">
                                {hasEnded ? (
                                    <span className="rounded-full bg-amber-50 px-2.5 py-0.5 font-medium text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
                                        Poll ended
                                    </span>
                                ) : (
                                    <span className="rounded-full bg-green-50 px-2.5 py-0.5 font-medium text-green-700 dark:bg-green-900/20 dark:text-green-300">
                                        Active poll
                                    </span>
                                )}

                                {latestPoll.multiple_choice && (
                                    <span className="rounded-full bg-[#8847BB]/10 px-2.5 py-0.5 font-medium text-[#8847BB] dark:bg-[#8847BB]/20 dark:text-[#F9BAEE]">
                                        Multiple choice
                                    </span>
                                )}

                                <span className="rounded-full bg-gray-100 px-2.5 py-0.5 font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                                    {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}
                                </span>
                            </div>

                            {/* Success message */}
                            <AnimatePresence>
                                {success && (
                                    <motion.div
                                        className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-300"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        {success}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Poll options */}
                            <div className="space-y-3">
                                {visibleOptions?.map((option) => {
                                    const isSelected = selectedOptions.includes(option.id);
                                    const isVoted = userVotes?.includes(option.id);
                                    const votePercentage = totalVotes ? Math.round((option.votes_count / totalVotes) * 100) : 0;

                                    return (
                                        <div
                                            key={option.id}
                                            className={`relative overflow-hidden rounded-md border ${
                                                isSelected || isVoted
                                                    ? 'border-[#8847BB] dark:border-[#F9BAEE]'
                                                    : 'border-[#19140035] dark:border-[#3E3E3A]'
                                            } cursor-pointer transition-all hover:border-[#8847BB] dark:hover:border-[#F9BAEE]`}
                                            onClick={() => handleOptionSelect(option.id)}
                                        >
                                            {/* Background progress bar for vote count */}
                                            {(hasVoted || hasEnded) && (
                                                <div
                                                    className="absolute inset-0 top-0 left-0 z-0 bg-[#8847BB]/10 dark:bg-[#8847BB]/20"
                                                    style={{ width: `${votePercentage}%` }}
                                                />
                                            )}

                                            <div className="relative z-10 flex items-center justify-between p-3">
                                                <div className="flex items-center space-x-3 truncate">
                                                    {/* Checkbox/Radio display */}
                                                    <div
                                                        className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                                                            isSelected || isVoted
                                                                ? 'border-[#8847BB] bg-[#8847BB] text-white dark:border-[#F9BAEE] dark:bg-[#F9BAEE] dark:text-[#1b1b18]'
                                                                : 'border-[#19140045] dark:border-[#62605b]'
                                                        }`}
                                                    >
                                                        {(isSelected || isVoted) && (
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                strokeWidth="3"
                                                                stroke="currentColor"
                                                                className="h-3 w-3"
                                                            >
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                                            </svg>
                                                        )}
                                                    </div>

                                                    <span className="truncate text-sm">{option.text}</span>
                                                </div>

                                                {(hasVoted || hasEnded) && (
                                                    <div className="ml-2 flex items-center whitespace-nowrap">
                                                        <span className="text-sm font-medium">{votePercentage}%</span>
                                                        <span className="text-muted-foreground ml-1 text-xs">({option.votes_count})</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Show more/less options button */}
                                {showExpandButton && (
                                    <button
                                        onClick={() => setShowAllOptions(!showAllOptions)}
                                        className="bg-background mt-2 flex w-full items-center justify-center rounded-md border border-[#19140035] px-3 py-1.5 text-xs font-medium hover:bg-[#f5f5f3] dark:border-[#3E3E3A] dark:hover:bg-[#1C1C1A]"
                                    >
                                        {showAllOptions ? (
                                            <>
                                                Show less <ChevronUp className="ml-1 h-3.5 w-3.5" />
                                            </>
                                        ) : (
                                            <>
                                                Show {latestPoll.options.length - MAX_OPTIONS_VISIBLE} more{' '}
                                                <ChevronDown className="ml-1 h-3.5 w-3.5" />
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>

                            {/* Submit Vote Button */}
                            {!hasVoted && !hasEnded && (
                                <button
                                    onClick={submitVote}
                                    disabled={isSubmitting || selectedOptions.length === 0}
                                    className="mt-4 inline-flex items-center rounded-md bg-[#8847BB] px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#7040a0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8847BB] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#8847BB] dark:hover:bg-[#9957cb]"
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Vote'}
                                </button>
                            )}

                            {/* Status Messages */}
                            {hasEnded && (
                                <div className="text-muted-foreground mt-4 text-sm">This poll has ended and is no longer accepting votes.</div>
                            )}

                            {hasVoted && !hasEnded && <div className="text-muted-foreground mt-4 text-sm">Your vote has been recorded.</div>}
                        </motion.div>

                        {/* Call-to-action - takes up 2/5 of the grid */}
                        <motion.div className="flex flex-col justify-center space-y-6 lg:col-span-2 lg:pl-8" variants={itemVariants}>
                            {/*<div>
                                <h3 className="mb-3 text-2xl font-bold">Join the conversation</h3>
                            </div>*/}

                            <div className="flex flex-col gap-4 sm:flex-row">
                                <Link
                                    href={route('public-polls.index')}
                                    className="inline-flex items-center justify-center gap-2 rounded-md bg-[#8847BB] px-5 py-2.5 text-center text-sm font-medium text-white shadow-sm hover:bg-[#7040a0] dark:bg-[#8847BB] dark:hover:bg-[#9957cb]"
                                >
                                    Explore all polls
                                    <ExternalLink className="h-4 w-4" />
                                </Link>
                                {/* once I implement user accounts
                                <Link
                                    href={route('polls.create')}
                                    className="bg-background inline-flex items-center justify-center gap-2 rounded-md border border-[#19140035] px-5 py-2.5 text-center text-sm font-medium shadow-sm hover:bg-[#f5f5f3] dark:border-[#3E3E3A] dark:hover:bg-[#1C1C1A]"
                                >
                                    Create your own poll
                                </Link>
                                */}
                            </div>

                            {latestPoll && (
                                <div className="mt-4 flex items-center">
                                    <Link
                                        href={route('polls.show', latestPoll.id)}
                                        className="text-sm text-[#8847BB] hover:underline dark:text-[#F9BAEE]"
                                    >
                                        View full poll details →
                                    </Link>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
