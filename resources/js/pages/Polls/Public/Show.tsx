import SEO from '@/components/SEO';
import { Link, router } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

interface PollOption {
    id: number;
    title: string;
    color?: string;
    icon?: string;
    description?: string;
}

interface Poll {
    id: number;
    title: string;
    description?: string;
    type: 'yes_no' | 'multiple_choice' | 'ranking' | 'custom_input';
    allow_multiple: boolean;
    allow_custom: boolean;
    show_results_without_voting: boolean;
    options: PollOption[];
}

interface PollResult {
    option: PollOption;
    votes: number;
    percentage: number;
}

interface Results {
    total: number;
    options: {
        [key: string]: PollResult; // Numeric keys for standard options
        custom?: Record<string, number>; // "custom" key for custom answers
    };
}

interface Props {
    poll: Poll;
    hasVoted: boolean;
    results: Results | null;
}

export default function PollShow({ poll, hasVoted, results: initialResults }: Props) {
    const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
    const [customAnswer, setCustomAnswer] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [results] = useState<Results | null>(initialResults);
    const [showResults, setShowResults] = useState(hasVoted);
    const [voteSuccess] = useState(false);

    const handleOptionSelect = (optionId: number) => {
        if (poll.allow_multiple) {
            // For multiple selection
            if (selectedOptions.includes(optionId)) {
                setSelectedOptions(selectedOptions.filter((id) => id !== optionId));
            } else {
                setSelectedOptions([...selectedOptions, optionId]);
            }
        } else {
            // For single selection
            setSelectedOptions([optionId]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedOptions.length && !customAnswer) {
            return;
        }

        setIsSubmitting(true);

        const data: any = {};

        if (poll.allow_multiple) {
            data.option_ids = selectedOptions;
        } else {
            data.option_ids = selectedOptions[0];
        }

        if (poll.allow_custom && customAnswer.trim()) {
            data.custom_answer = customAnswer.trim();
        }

        router.post(`/polls/${poll.id}/vote`, data, {
            onSuccess: () => {
                setIsSubmitting(false);
                setShowResults(true);

                // Reset form
                setSelectedOptions([]);
                setCustomAnswer('');
            },
            onError: () => {
                setIsSubmitting(false);
            },
        });
    };

    // Render poll option icons
    const renderOptionIcon = (iconName: string | null) => {
        if (!iconName) return null;

        switch (iconName) {
            case 'thumbs-up':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                    </svg>
                );
            case 'thumbs-down':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
                    </svg>
                );
            case 'star':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                );
            case 'heart':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path
                            fillRule="evenodd"
                            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                            clipRule="evenodd"
                        />
                    </svg>
                );
            case 'check':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                        />
                    </svg>
                );
            case 'x':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                );
            case 'question':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                            clipRule="evenodd"
                        />
                    </svg>
                );
            case 'exclamation':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                        />
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <div className="mx-auto min-h-screen max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
            <SEO
                title={`${poll.title} | vyPal Polls`}
                description={poll.description || `Vote in this interactive poll about ${poll.title} and see real-time results.`}
                keywords={`polls, voting, interactive, ${poll.title}, opinion, feedback`}
                url={`https://vypal.me/polls/${poll.id}`}
                tags={['polls', 'voting', 'interactive', 'feedback']}
            />

            <Link href="/polls" className="mb-6 inline-flex items-center text-sm font-medium text-[#8847BB] hover:underline dark:text-[#F9BAEE]">
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path
                        fillRule="evenodd"
                        d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                        clipRule="evenodd"
                    />
                </svg>
                Back to Polls
            </Link>

            <motion.div
                className="rounded-lg border border-[#5E4290]/20 bg-white p-6 shadow-sm sm:p-8 dark:bg-[#161615]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <h1 className="mb-2 text-2xl font-bold sm:text-3xl">{poll.title}</h1>

                {poll.description && <p className="mb-6 text-[#706f6c] dark:text-[#A1A09A]">{poll.description}</p>}

                {/* Success message when vote is registered */}
                <AnimatePresence>
                    {voteSuccess && (
                        <motion.div
                            className="mb-6 rounded-md bg-green-500/20 p-4 text-green-500"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            <div className="flex">
                                <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span>Your vote has been recorded! Thank you for participating.</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {hasVoted ? (
                    <div className="mb-4 rounded-md bg-blue-500/20 p-4 text-blue-500">
                        <div className="flex">
                            <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span>You have already voted in this poll.</span>
                        </div>
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        <motion.form onSubmit={handleSubmit} className="mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <div className="space-y-3">
                                {poll.options.map((option) => (
                                    <div
                                        key={option.id}
                                        className={`cursor-pointer rounded-md border transition-all ${
                                            selectedOptions.includes(option.id)
                                                ? `border-transparent ${option.color ? `bg-[${option.color}]/20 text-[${option.color}]` : 'bg-[#8847BB]/20 text-[#8847BB] dark:bg-[#5E4290]/30 dark:text-[#F9BAEE]'}`
                                                : 'border-gray-200 bg-white hover:border-[#8847BB]/50 dark:border-gray-700 dark:bg-[#1E1E1D] dark:hover:border-[#F9BAEE]/50'
                                        }`}
                                        onClick={() => handleOptionSelect(option.id)}
                                    >
                                        <div className="flex items-center px-4 py-3">
                                            <div
                                                className={`mr-3 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border ${
                                                    selectedOptions.includes(option.id)
                                                        ? `border-transparent ${option.color ? `bg-[${option.color}]` : 'bg-[#8847BB] dark:bg-[#F9BAEE]'}`
                                                        : 'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800'
                                                }`}
                                            >
                                                {!selectedOptions.includes(option.id) ? (
                                                    <svg className="h-3 w-3 text-white dark:text-[#1E1E1D]" fill="currentColor" viewBox="0 0 20 20">
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                ) : (
                                                    <svg className="h-3 w-3 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                )}
                                            </div>
                                            <div className="flex flex-1 items-center">
                                                <div className="flex items-center gap-2 text-sm font-medium">
                                                    {option.icon && (
                                                        <span
                                                            className={`${selectedOptions.includes(option.id) ? (option.color ? `text-[${option.color}]` : 'text-[#8847BB] dark:text-[#F9BAEE]') : 'text-gray-500 dark:text-gray-400'}`}
                                                        >
                                                            {renderOptionIcon(option.icon)}
                                                        </span>
                                                    )}
                                                    {option.title}
                                                </div>
                                            </div>
                                        </div>
                                        {option.description && (
                                            <div className="border-t border-gray-100 px-4 py-2 text-sm text-[#706f6c] dark:border-gray-700 dark:text-[#A1A09A]">
                                                {option.description}
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {poll.allow_custom ? (
                                    <div className="rounded-md border border-gray-200 bg-white dark:border-gray-700 dark:bg-[#1E1E1D]">
                                        <div className="p-4">
                                            <label htmlFor="custom-answer" className="mb-1 block text-sm font-medium">
                                                Other (specify)
                                            </label>
                                            <input
                                                id="custom-answer"
                                                type="text"
                                                value={customAnswer}
                                                onChange={(e) => setCustomAnswer(e.target.value)}
                                                className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 focus:border-[#8847BB] focus:ring-1 focus:ring-[#8847BB] focus:outline-none dark:border-gray-600 dark:focus:border-[#F9BAEE] dark:focus:ring-[#F9BAEE]"
                                                placeholder="Enter your own answer"
                                            />
                                        </div>
                                    </div>
                                ) : null}
                            </div>

                            <div className="mt-6 flex items-center justify-between">
                                {poll.show_results_without_voting && (
                                    <button
                                        type="button"
                                        onClick={() => setShowResults(true)}
                                        className="rounded-md px-4 py-2 text-sm font-medium text-[#8847BB] hover:bg-[#8847BB]/10 dark:text-[#F9BAEE] dark:hover:bg-[#F9BAEE]/10"
                                    >
                                        See results without voting
                                    </button>
                                )}

                                <button
                                    type="submit"
                                    disabled={isSubmitting || (!selectedOptions.length && !customAnswer)}
                                    className={`ml-auto rounded-md bg-[#8847BB] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#7838a6] dark:bg-[#5E4290] dark:hover:bg-[#4e3578] ${
                                        isSubmitting || (!selectedOptions.length && !customAnswer) ? 'cursor-not-allowed opacity-50' : ''
                                    }`}
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Vote'}
                                </button>
                            </div>
                        </motion.form>
                    </AnimatePresence>
                )}

                {showResults && results && (
                    <motion.div className="mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-medium">Results</h2>
                            <span className="text-sm text-[#706f6c] dark:text-[#A1A09A]">Total votes: {results.total}</span>
                        </div>

                        <div className="space-y-4">
                            {/* Render standard poll options */}
                            {results.options &&
                                Object.entries(results.options)
                                    .filter(([key]) => key !== 'custom') // Filter out the custom key
                                    .map(([key, result], index) => {
                                        // Make sure we're dealing with a PollResult object with an option property
                                        if (!result.option) return null;

                                        return (
                                            <motion.div
                                                key={result.option.id || `option-${key}`}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        {result.option.icon && (
                                                            <span className="text-[#8847BB] dark:text-[#F9BAEE]">
                                                                {renderOptionIcon(result.option.icon)}
                                                            </span>
                                                        )}
                                                        <span className="font-medium">{result.option.title}</span>
                                                    </div>
                                                    <span className="font-mono text-sm font-bold">{result.percentage}%</span>
                                                </div>
                                                <div className="mt-1 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                                                    <motion.div
                                                        className="h-full rounded-full"
                                                        style={{
                                                            backgroundColor: result.option.color || '#8847BB',
                                                        }}
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${result.percentage}%` }}
                                                        transition={{ duration: 0.8, delay: index * 0.05 }}
                                                    ></motion.div>
                                                </div>
                                                <div className="mt-1 text-xs text-[#706f6c] dark:text-[#A1A09A]">
                                                    {result.votes} {result.votes === 1 ? 'vote' : 'votes'}
                                                </div>
                                            </motion.div>
                                        );
                                    })}

                            {/* Custom answers section */}
                            {results.options && results.options.custom && Object.keys(results.options.custom).length > 0 && (
                                <div className="mt-6 rounded-md bg-gray-100 p-4 dark:bg-gray-800">
                                    <h3 className="mb-2 text-sm font-medium">Custom Answers</h3>
                                    <ul className="space-y-1 text-sm">
                                        {Object.entries(results.options.custom).map(([answer, count], index) => (
                                            <li key={index} className="flex items-center justify-between">
                                                <span>{answer}</span>
                                                <span className="font-mono text-xs font-bold">
                                                    {count} {count === 1 ? 'vote' : 'votes'}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {!hasVoted && (
                            <button
                                onClick={() => setShowResults(false)}
                                className="mt-6 rounded-md px-4 py-2 text-sm font-medium text-[#8847BB] hover:bg-[#8847BB]/10 dark:text-[#F9BAEE] dark:hover:bg-[#F9BAEE]/10"
                            >
                                Back to voting
                            </button>
                        )}
                    </motion.div>
                )}

                <div className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-700">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <span className="rounded-full bg-[#8847BB]/10 px-2.5 py-0.5 text-xs font-medium text-[#8847BB] dark:bg-[#5E4290]/20 dark:text-[#F9BAEE]">
                                {poll.type === 'yes_no' && 'Yes/No'}
                                {poll.type === 'multiple_choice' && 'Multiple Choice'}
                                {poll.type === 'ranking' && 'Ranking'}
                                {poll.type === 'custom_input' && 'Custom Input'}
                            </span>

                            {poll.allow_multiple ? (
                                <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-500">
                                    Multiple selections allowed
                                </span>
                            ) : null}
                        </div>

                        <Link href="/polls" className="text-sm font-medium text-[#8847BB] hover:underline dark:text-[#F9BAEE]">
                            View all polls
                        </Link>
                    </div>
                </div>
            </motion.div>

            <div className="mt-8 text-center">
                <p className="text-sm text-[#706f6c] dark:text-[#A1A09A]">
                    Have an idea for a poll?{' '}
                    <a href="/#contact" className="text-[#8847BB] hover:underline dark:text-[#F9BAEE]">
                        Suggest it here
                    </a>
                </p>
            </div>
        </div>
    );
}
