import SEO from '@/components/SEO';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

interface PollOption {
    id: number;
    title: string;
    color?: string;
    icon?: string;
}

interface Poll {
    id: number;
    title: string;
    description?: string;
    type: 'yes_no' | 'multiple_choice' | 'ranking' | 'custom_input';
    options: PollOption[];
    is_active: boolean;
}

interface Props {
    polls: Poll[];
}

export default function PollsIndex({ polls }: Props) {
    return (
        <div className="mx-auto min-h-screen max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
            <SEO
                title="vyPal Polls | Interactive Community Surveys"
                description="Vote in interactive polls and see real-time results. Share your opinions on a variety of topics through simple and engaging polls."
                keywords="polls, voting, interactive, community surveys, opinions, feedback"
                url="https://vypal.me/polls"
                tags={['polls', 'voting', 'interactive', 'feedback']}
            />

            <div className="text-center">
                <motion.h1
                    className="text-3xl font-bold tracking-tight sm:text-4xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Interactive <span className="text-[#8847BB] dark:text-[#F9BAEE]">Polls</span>
                </motion.h1>
                <motion.p
                    className="mx-auto mt-3 max-w-2xl text-lg text-[#706f6c] dark:text-[#A1A09A]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    Vote in interactive polls and see real-time results. Share your opinions on a variety of topics!
                </motion.p>
            </div>

            <motion.div
                className="mt-12 grid gap-6 md:grid-cols-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                {polls.length === 0 ? (
                    <div className="col-span-2 rounded-lg border border-[#5E4290]/20 bg-white p-8 text-center dark:bg-[#161615]">
                        <h2 className="text-xl font-semibold">No active polls at the moment</h2>
                        <p className="mt-2 text-[#706f6c] dark:text-[#A1A09A]">Check back soon for new polls to participate in!</p>
                    </div>
                ) : (
                    polls.map((poll, index) => (
                        <motion.div
                            key={poll.id}
                            className="group overflow-hidden rounded-lg border border-[#5E4290]/20 bg-white shadow-sm transition-all hover:shadow-md dark:bg-[#161615]"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                        >
                            <Link href={`/polls/${poll.id}`}>
                                <div className="p-6">
                                    <h2 className="mb-2 text-xl font-medium group-hover:text-[#8847BB] dark:group-hover:text-[#F9BAEE]">
                                        {poll.title}
                                    </h2>

                                    {poll.description && (
                                        <p className="mb-4 text-sm text-[#706f6c] dark:text-[#A1A09A]">
                                            {poll.description.length > 120 ? `${poll.description.substring(0, 120)}...` : poll.description}
                                        </p>
                                    )}

                                    <div className="flex items-center justify-between">
                                        <div className="flex -space-x-2">
                                            {poll.options.slice(0, 4).map((option, i) => (
                                                <div
                                                    key={i}
                                                    className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-xs font-medium dark:border-[#161615]"
                                                    style={{
                                                        backgroundColor: option.color || '#8847BB',
                                                        zIndex: 4 - i,
                                                    }}
                                                >
                                                    {option.title.charAt(0)}
                                                </div>
                                            ))}

                                            {poll.options.length > 4 && (
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-500 text-xs font-medium dark:border-[#161615]">
                                                    +{poll.options.length - 4}
                                                </div>
                                            )}
                                        </div>

                                        <span className="inline-flex items-center rounded-full bg-[#8847BB]/10 px-2.5 py-0.5 text-xs font-medium text-[#8847BB] dark:bg-[#5E4290]/20 dark:text-[#F9BAEE]">
                                            {poll.type === 'yes_no' && 'Yes/No'}
                                            {poll.type === 'multiple_choice' && 'Multiple Choice'}
                                            {poll.type === 'ranking' && 'Ranking'}
                                            {poll.type === 'custom_input' && 'Custom Input'}
                                        </span>
                                    </div>
                                    <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-[#8847BB] to-[#5E4290] transition-all duration-300 group-hover:w-full dark:from-[#F9BAEE] dark:to-[#8847BB]"></div>
                                </div>
                            </Link>
                        </motion.div>
                    ))
                )}
            </motion.div>

            <motion.div
                className="mt-16 rounded-lg border border-[#5E4290]/20 bg-white p-8 text-center shadow-sm dark:bg-[#161615]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
                <h2 className="text-2xl font-semibold">Have an idea for a poll?</h2>
                <p className="mx-auto mt-2 max-w-2xl text-[#706f6c] dark:text-[#A1A09A]">
                    If you have a suggestion for a poll topic, feel free to reach out!
                </p>
                <a
                    href="/#contact"
                    className="mt-6 inline-block rounded-md bg-[#8847BB] px-6 py-3 text-white transition-colors hover:bg-[#7838a6] dark:bg-[#5E4290] dark:hover:bg-[#4e3578]"
                >
                    Suggest a Poll Topic
                </a>
            </motion.div>
        </div>
    );
}
