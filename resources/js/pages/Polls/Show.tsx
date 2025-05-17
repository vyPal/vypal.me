import { Link } from '@inertiajs/react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, BarChart3Icon, CalendarIcon, UserIcon } from 'lucide-react';
import { useState } from 'react';

// Components
import Footer from '@/components/sections/Footer';
import NavBar from '@/components/sections/NavBar';
import SEO from '@/components/SEO';
import { Auth } from '@/types';

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

interface PollDetailProps {
    poll: Poll;
    userVotes: number[] | null;
    auth: Auth;
}

export default function PollDetail({ poll, userVotes: initialUserVotes, auth }: PollDetailProps) {
    const [userVotes, setUserVotes] = useState<number[]>(initialUserVotes || []);
    const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [pollData, setPollData] = useState<Poll>(poll);

    // Check if poll has ended
    const hasEnded = poll.ends_at && new Date(poll.ends_at) <= new Date();
    // Check if user has already voted
    const hasVoted = userVotes && userVotes.length > 0;
    // Calculate total votes
    const totalVotes = pollData.all_votes_count || 0;

    const handleOptionSelect = (optionId: number) => {
        if (hasVoted || hasEnded) return;

        if (poll.multiple_choice) {
            // Toggle selection for multiple choice
            setSelectedOptions((prev) => (prev.includes(optionId) ? prev.filter((id) => id !== optionId) : [...prev, optionId]));
        } else {
            // Single selection
            setSelectedOptions([optionId]);
        }
    };

    const submitVote = async () => {
        if (!selectedOptions.length) {
            setError('Please select an option before voting.');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const payload = poll.multiple_choice ? { option_ids: selectedOptions } : { option_id: selectedOptions[0] };

            const response = await axios.post(route('polls.vote', poll.id), payload);

            // Update poll data with new vote counts
            setPollData(response.data.poll);

            // Update user votes
            setUserVotes(selectedOptions);

            // Show success message
            setSuccess('Your vote has been recorded successfully!');

            // Clear selected options
            setSelectedOptions([]);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to submit your vote. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
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
        <>
            <SEO
                title={`${poll.title} | Poll`}
                description={poll.description || `Vote on "${poll.title}" poll and see the results.`}
                keywords="poll, vote, results, community poll"
                url={`/polls/${poll.id}`}
                pollId={poll.id}
            />

            <div className="bg-background text-foreground min-h-screen">
                <NavBar auth={auth} />

                <main className="container mx-auto px-6 pt-28 pb-16">
                    <div className="mb-6">
                        <Link
                            href={route('public-polls.index')}
                            className="text-muted-foreground hover:text-foreground inline-flex items-center text-sm transition-colors"
                        >
                            <ArrowLeftIcon className="mr-1 h-3.5 w-3.5" />
                            Back to Polls
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        <div className="md:col-span-2">
                            <motion.div className="space-y-4" initial="hidden" animate="show" variants={containerAnimation}>
                                <motion.h1 className="text-3xl font-bold tracking-tight sm:text-4xl" variants={itemAnimation}>
                                    {poll.title}
                                </motion.h1>

                                {poll.description && (
                                    <motion.p className="text-muted-foreground text-lg" variants={itemAnimation}>
                                        {poll.description}
                                    </motion.p>
                                )}

                                <motion.div className="text-muted-foreground flex flex-wrap gap-4 text-sm" variants={itemAnimation}>
                                    <div className="flex items-center">
                                        <UserIcon className="mr-1.5 h-4 w-4" />
                                        <span>Created by {poll.user.name}</span>
                                    </div>

                                    <div className="flex items-center">
                                        <CalendarIcon className="mr-1.5 h-4 w-4" />
                                        <span>
                                            {poll.ends_at
                                                ? hasEnded
                                                    ? `Ended ${new Date(poll.ends_at).toLocaleDateString()}`
                                                    : `Ends ${new Date(poll.ends_at).toLocaleDateString()}`
                                                : 'No end date'}
                                        </span>
                                    </div>

                                    {poll.multiple_choice && (
                                        <div className="rounded-full bg-[#8847BB]/10 px-2.5 py-0.5 text-xs font-medium text-[#8847BB] dark:bg-[#8847BB]/20 dark:text-[#F9BAEE]">
                                            Multiple choice
                                        </div>
                                    )}
                                </motion.div>

                                <motion.hr className="my-6 border-[#19140025] dark:border-[#3E3E3A]" variants={itemAnimation} />

                                {/* Error and Success Messages */}
                                {error && (
                                    <motion.div
                                        className="rounded-md bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        {error}
                                    </motion.div>
                                )}

                                {success && (
                                    <motion.div
                                        className="rounded-md bg-green-50 p-4 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-300"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        {success}
                                    </motion.div>
                                )}

                                {/* Poll Options */}
                                <motion.div className="space-y-3 pt-2" variants={containerAnimation}>
                                    {pollData.options.map((option) => {
                                        const isSelected = selectedOptions.includes(option.id);
                                        const isVoted = userVotes?.includes(option.id);
                                        const votePercentage = totalVotes ? Math.round((option.votes_count / totalVotes) * 100) : 0;

                                        return (
                                            <motion.div
                                                key={option.id}
                                                className={`relative rounded-lg border ${
                                                    isSelected ? 'border-[#8847BB] dark:border-[#F9BAEE]' : 'border-[#19140035] dark:border-[#3E3E3A]'
                                                } cursor-pointer overflow-hidden transition-all hover:border-[#8847BB] dark:hover:border-[#F9BAEE]`}
                                                onClick={() => handleOptionSelect(option.id)}
                                                variants={itemAnimation}
                                            >
                                                {/* Background progress bar for vote count */}
                                                {(hasVoted || hasEnded) && (
                                                    <div
                                                        className="absolute inset-0 top-0 left-0 z-0 bg-[#8847BB]/10 dark:bg-[#8847BB]/20"
                                                        style={{ width: `${votePercentage}%` }}
                                                    />
                                                )}

                                                <div className="relative z-10 flex items-center justify-between p-4">
                                                    <div className="flex items-center space-x-3">
                                                        {/* Checkbox/Radio display */}
                                                        <div
                                                            className={`flex h-5 w-5 items-center justify-center rounded-full border ${
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

                                                        <span className="font-medium">{option.text}</span>
                                                    </div>

                                                    {(hasVoted || hasEnded) && (
                                                        <div className="flex items-center">
                                                            <span className="text-sm font-medium">{votePercentage}%</span>
                                                            <span className="text-muted-foreground ml-2 text-xs">
                                                                ({option.votes_count} {option.votes_count === 1 ? 'vote' : 'votes'})
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </motion.div>

                                {/* Submit Vote Button */}
                                {!hasVoted && !hasEnded && (
                                    <motion.button
                                        onClick={submitVote}
                                        disabled={isSubmitting || selectedOptions.length === 0}
                                        className={`mt-4 inline-flex items-center rounded-md bg-[#8847BB] px-5 py-2.5 text-center text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#7040a0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8847BB] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#8847BB] dark:hover:bg-[#9957cb]`}
                                        variants={itemAnimation}
                                    >
                                        {isSubmitting ? 'Submitting...' : 'Submit Vote'}
                                    </motion.button>
                                )}

                                {/* Status Messages */}
                                {hasEnded && (
                                    <motion.div
                                        className="mt-4 rounded-md bg-amber-50 p-4 text-sm text-amber-700 dark:bg-amber-900/20 dark:text-amber-300"
                                        variants={itemAnimation}
                                    >
                                        <p>This poll has ended and is no longer accepting votes.</p>
                                    </motion.div>
                                )}

                                {hasVoted && !hasEnded && (
                                    <motion.div className="text-muted-foreground mt-4 flex items-center gap-2 text-sm" variants={itemAnimation}>
                                        <BarChart3Icon className="h-4 w-4" />
                                        <p>You have already voted in this poll.</p>
                                    </motion.div>
                                )}
                            </motion.div>
                        </div>

                        <div>
                            <motion.div
                                className="bg-background rounded-lg border border-[#19140035] p-6 dark:border-[#3E3E3A]"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <h3 className="text-lg font-semibold">Poll Information</h3>
                                <div className="mt-4 space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Status</span>
                                        <span
                                            className={`font-medium ${hasEnded ? 'text-amber-600 dark:text-amber-400' : 'text-green-600 dark:text-green-400'}`}
                                        >
                                            {hasEnded ? 'Ended' : 'Active'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Total Votes</span>
                                        <span className="font-medium">{totalVotes}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Created On</span>
                                        <span className="font-medium">{new Date(poll.created_at).toLocaleDateString()}</span>
                                    </div>
                                    {poll.ends_at && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">End Date</span>
                                            <span className="font-medium">{new Date(poll.ends_at).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Type</span>
                                        <span className="font-medium">{poll.multiple_choice ? 'Multiple choice' : 'Single choice'}</span>
                                    </div>
                                </div>

                                {auth.user && auth.user.id === poll.user.id && (
                                    <div className="mt-6 border-t border-[#19140025] pt-6 dark:border-[#3E3E3A]">
                                        <h4 className="text-sm font-medium">Admin Options</h4>
                                        <div className="mt-3 flex flex-col space-y-2">
                                            <Link
                                                href={route('polls.edit', poll.id)}
                                                className="bg-background text-foreground inline-flex items-center justify-center rounded-md border border-[#19140035] px-4 py-2 text-xs font-medium transition-colors hover:bg-[#f5f5f3] dark:border-[#3E3E3A] dark:hover:bg-[#1C1C1A]"
                                            >
                                                Edit Poll
                                            </Link>
                                            <Link
                                                href={route('polls.destroy', poll.id)}
                                                method="delete"
                                                as="button"
                                                className="inline-flex items-center justify-center rounded-md bg-red-100 px-4 py-2 text-xs font-medium text-red-700 transition-colors hover:bg-red-200 dark:bg-red-900/20 dark:text-red-300 dark:hover:bg-red-900/30"
                                                type="button"
                                            >
                                                Delete Poll
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </motion.div>

                            <motion.div
                                className="bg-background mt-6 rounded-lg border border-[#19140035] p-6 dark:border-[#3E3E3A]"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <h3 className="text-lg font-semibold">Share This Poll</h3>
                                <p className="text-muted-foreground mt-2 text-sm">Share this poll with others so they can vote too!</p>

                                <div className="mt-4 flex flex-col space-y-2">
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(window.location.href);
                                            setSuccess('Poll URL copied to clipboard!');
                                            setTimeout(() => setSuccess(null), 3000);
                                        }}
                                        className="inline-flex items-center justify-center rounded-md bg-[#8847BB]/10 px-4 py-2 text-xs font-medium text-[#8847BB] transition-colors hover:bg-[#8847BB]/20 dark:bg-[#8847BB]/20 dark:text-[#F9BAEE] dark:hover:bg-[#8847BB]/30"
                                    >
                                        Copy Link
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        </>
    );
}
