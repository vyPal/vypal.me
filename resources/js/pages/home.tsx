import { type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

// Components
import AboutSection from '@/components/sections/AboutSection';
import ContactSection from '@/components/sections/ContactSection';
import ContributionsSection from '@/components/sections/ContributionsSection';
import Footer from '@/components/sections/Footer';
import HeroSection from '@/components/sections/HeroSection';
import NavBar from '@/components/sections/NavBar';
import OrganizationsSection from '@/components/sections/OrganizationsSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import SkillsSection from '@/components/sections/SkillsSection';

export default function Home() {
    const { auth } = usePage<SharedData>().props;
    const [scrollY, setScrollY] = useState(0);

    // Track scroll position
    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <Head title="Jakub Palacký - Portfolio">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>

            <div className="min-h-screen bg-[#FDFDFC] text-[#1b1b18] dark:bg-[#0a0a0a] dark:text-[#EDEDEC]">
                {/* Navigation */}
                <NavBar auth={auth} />

                {/* Main Content */}
                <main className="overflow-hidden">
                    {/* Hero Section */}
                    <HeroSection scrollY={scrollY} />

                    {/* About Me */}
                    <AboutSection scrollY={scrollY} />

                    {/* Skills & Technologies */}
                    <SkillsSection scrollY={scrollY} />

                    {/* Projects */}
                    <ProjectsSection scrollY={scrollY} />

                    {/* Open Source Contributions */}
                    <ContributionsSection scrollY={scrollY} />

                    {/* GitHub Organizations */}
                    <OrganizationsSection scrollY={scrollY} />

                    {/* Contact */}
                    <ContactSection scrollY={scrollY} />
                </main>

                {/* Footer */}
                <Footer />
            </div>
        </>
    );
}
