import { Link } from '@inertiajs/react';
import { CalendarIcon, UserIcon, VoteIcon } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

// Components
import NavBar from '@/components/sections/NavBar';
import Footer from '@/components/sections/Footer';
import SEO from '@/components/SEO';

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

interface PublicPollsProps {
    polls: {
        data: Poll[];
        links: any;
        meta: any;
    };
    auth: {
        user: any;
    };
}

export default function PublicPolls({ polls, auth }: PublicPollsProps) {
    const [filter, setFilter] = useState('all');
    
    const filteredPolls = polls.data.filter(poll => {
        if (filter === 'active') {
            return !poll.ends_at || new Date(poll.ends_at) > new Date();
        } else if (filter === 'ended') {
            return poll.ends_at && new Date(poll.ends_at) <= new Date();
        }
        return true;
    });

    const staggerAnimation = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemAnimation = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <>
            <SEO
                title="Public Polls | Vote on community polls"
                description="Browse and vote on public polls created by the community."
                keywords="polls, voting, community polls, public polls"
                url="/polls"
            />
            
            <div className="bg-background text-foreground min-h-screen">
                <NavBar auth={auth} />
                
                <main className="container mx-auto px-6 pt-28 pb-16">
                    <div className="mb-12 flex flex-col items-center text-center">
                        <motion.h1 
                            className="text-4xl font-bold tracking-tight sm:text-5xl"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            Public Polls
                        </motion.h1>
                        <motion.p 
                            className="mt-4 text-xl text-muted-foreground max-w-xl"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            Browse and vote on polls created by the community
                        </motion.p>

                        <motion.div 
                            className="mt-6 flex gap-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            {auth.user && (
                                <Link 
                                    href={route('polls.create')} 
                                    className="inline-flex items-center rounded-md bg-[#8847BB] px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#7040a0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8847BB] dark:bg-[#8847BB] dark:hover:bg-[#9957cb]"
                                >
                                    Create New Poll
                                </Link>
                            )}
                            <Link 
                                href={auth.user ? route('polls.index') : route('login')} 
                                className="inline-flex items-center rounded-md border border-[#19140035] bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-[#f5f5f3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8847BB] dark:border-[#3E3E3A] dark:hover:bg-[#1C1C1A]"
                            >
                                {auth.user ? "My Polls" : "Sign in to Create"}
                            </Link>
                        </motion.div>
                    </div>
                    
                    <div className="mb-8 flex items-center justify-between">
                        <div className="flex gap-4">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                                    filter === 'all' 
                                        ? 'bg-[#8847BB] text-white dark:bg-[#8847BB]' 
                                        : 'hover:bg-[#f5f5f3] dark:hover:bg-[#1C1C1A]'
                                }`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setFilter('active')}
                                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                                    filter === 'active' 
                                        ? 'bg-[#8847BB] text-white dark:bg-[#8847BB]' 
                                        : 'hover:bg-[#f5f5f3] dark:hover:bg-[#1C1C1A]'
                                }`}
                            >
                                Active
                            </button>
                            <button
                                onClick={() => setFilter('ended')}
                                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                                    filter === 'ended' 
                                        ? 'bg-[#8847BB] text-white dark:bg-[#8847BB]' 
                                        : 'hover:bg-[#f5f5f3] dark:hover:bg-[#1C1C1A]'
                                }`}
                            >
                                Ended
                            </button>
                        </div>
                        
                        <div className="text-sm text-muted-foreground">
                            {filteredPolls.length} {filteredPolls.length === 1 ? 'poll' : 'polls'}
                        </div>
                    </div>
                    
                    {filteredPolls.length > 0 ? (
                        <motion.div 
                            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
                            variants={staggerAnimation}
                            initial="hidden"
                            animate="show"
                        >
                            {filteredPolls.map(poll => (
                                <motion.div
                                    key={poll.id}
                                    variants={itemAnimation}
                                    className="group flex flex-col rounded-lg border border-[#19140035] bg-background p-6 shadow-sm transition-all hover:border-[#1915014a] hover:shadow-md dark:border-[#3E3E3A] dark:hover:border-[#62605b]"
                                >
                                    <Link href={route('polls.show', poll.id)} className="flex-1">
                                        <h3 className="line-clamp-2 text-lg font-semibold group-hover:text-[#8847BB] dark:group-hover:text-[#F9BAEE]">
                                            {poll.title}
                                        </h3>
                                        
                                        {poll.description && (
                                            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                                                {poll.description}
                                            </p>
                                        )}
                                    </Link>
                                    
                                    <div className="mt-4 pt-4 border-t border-[#19140025] dark:border-[#3E3E3A]">
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                            <div className="flex items-center space-x-1">
                                                <UserIcon className="size-3.5" />
                                                <span>{poll.user.name}</span>
                                            </div>
                                            
                                            <div className="flex items-center space-x-1">
                                                <CalendarIcon className="size-3.5" />
                                                <span>
                                                    {poll.ends_at 
                                                        ? new Date(poll.ends_at) <= new Date() 
                                                            ? "Ended" 
                                                            : `Ends ${new Date(poll.ends_at).toLocaleDateString()}`
                                                        : "No end date"}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-3 flex items-center justify-between">
                                            <div className="flex items-center space-x-1 text-xs">
                                                <span className="font-semibold">{poll.all_votes_count}</span>
                                                <span className="text-muted-foreground">votes</span>
                                            </div>
                                            
                                            <Link
                                                href={route('polls.show', poll.id)}
                                                className="flex items-center rounded-md bg-[#8847BB]/10 px-2.5 py-1 text-xs font-medium text-[#8847BB] transition-colors hover:bg-[#8847BB]/20 dark:bg-[#8847BB]/20 dark:text-[#F9BAEE] dark:hover:bg-[#8847BB]/30"
                                            >
                                                Vote Now
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-[#19140035] bg-background p-12 text-center dark:border-[#3E3E3A]">
                            <div className="text-6xl mb-4">🗳️</div>
                            <h3 className="text-xl font-medium">No polls found</h3>
                            <p className="mt-2 text-muted-foreground">
                                {filter !== 'all' 
                                    ? `No ${filter} polls available. Try a different filter.` 
                                    : 'There are no public polls available at the moment.'}
                            </p>
                        </div>
                    )}
                    
                    {polls.meta.last_page > 1 && (
                        <div className="mt-12 flex justify-center">
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
                                                : 'opacity-50 cursor-default'
                                        } rounded-md`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </nav>
                        </div>
                    )}
                </main>
                
                <Footer />
            </div>
        </>
    );
}