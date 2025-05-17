import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

// Components
import AboutSection from '@/components/sections/AboutSection';
import ContactSection from '@/components/sections/ContactSection';
import ContributionsSection from '@/components/sections/ContributionsSection';
import FeaturedLinksSection from '@/components/sections/FeaturedLinks';
import Footer from '@/components/sections/Footer';
import HeroSection from '@/components/sections/HeroSection';
import LatestPollSection from '@/components/sections/LatestPollSection';
import NavBar from '@/components/sections/NavBar';
import OrganizationsSection from '@/components/sections/OrganizationsSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import SkillsSection from '@/components/sections/SkillsSection';
import SEO from '@/components/SEO';

export default function Home() {
    const { auth } = usePage<SharedData>().props;
    const [scrollY, setScrollY] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameRef = useRef<number>(null);

    // Track scroll position
    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Loading animation
    useEffect(() => {
        if (!isLoading || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas dimensions
        const updateCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        updateCanvasSize();
        window.addEventListener('resize', updateCanvasSize);

        // Bezier curve calculation helper
        const bezierPoint = (t: number, p0: number, p1: number, p2: number, p3: number) => {
            const cX = 3 * (p1 - p0);
            const bX = 3 * (p2 - p1) - cX;
            const aX = p3 - p0 - cX - bX;

            return aX * Math.pow(t, 3) + bX * Math.pow(t, 2) + cX * t + p0;
        };

        // Particle class with bezier curve paths
        class Particle {
            x: number;
            y: number;
            size: number;
            targetX: number;
            targetY: number;
            speed: number;
            color: string;
            initialX: number;
            initialY: number;
            controlPoint1X: number;
            controlPoint1Y: number;
            controlPoint2X: number;
            controlPoint2Y: number;
            progress: number;
            progressSpeed: number;
            finalPhase: boolean;
            finalAngle: number;
            finalSpeed: number;
            alpha: number;

            constructor(x: number, y: number, targetX: number, targetY: number) {
                this.initialX = Math.random() * canvas.width;
                this.initialY = Math.random() * canvas.height;
                this.x = this.initialX;
                this.y = this.initialY;
                this.size = Math.random() * 2 + 1;
                this.targetX = targetX;
                this.targetY = targetY;
                this.speed = Math.random() * 0.01 + 0.005;
                this.progress = 0;
                this.progressSpeed = Math.random() * 0.004 + 0.002;
                this.finalPhase = false;
                this.finalAngle = Math.random() * Math.PI * 2;
                this.finalSpeed = Math.random() * 3 + 1;
                this.alpha = 1;

                // Create random but smooth bezier control points
                // First control point - near start but with some randomness
                this.controlPoint1X = this.initialX + (Math.random() - 0.5) * canvas.width * 0.5;
                this.controlPoint1Y = this.initialY + (Math.random() - 0.5) * canvas.height * 0.5;

                // Second control point - near destination but with some randomness
                this.controlPoint2X = this.targetX + (Math.random() - 0.5) * canvas.width * 0.3;
                this.controlPoint2Y = this.targetY + (Math.random() - 0.5) * canvas.height * 0.3;

                // Colors from your palette with glow effect
                const colors = ['#8847BB', '#5E4290', '#F9BAEE'];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            update(globalProgress: number) {
                const bezierStartProgress = 0.05;
                const bezierEndProgress = 0.755;

                const animationEndGlobalProgress = 0.75;

                if (globalProgress <= animationEndGlobalProgress) {
                    const rawBezierT = (globalProgress - bezierStartProgress) / (bezierEndProgress - bezierStartProgress);

                    const t = Math.max(0, Math.min(1, rawBezierT));

                    this.x = bezierPoint(t, this.initialX, this.controlPoint1X, this.controlPoint2X, this.targetX);
                    this.y = bezierPoint(t, this.initialY, this.controlPoint1Y, this.controlPoint2Y, this.targetY);
                } else if (!this.finalPhase) {
                    // Transition to final dispersing phase
                    this.finalPhase = true;

                    // Calculate angle away from center
                    const dx = this.x - canvas.width / 2;
                    const dy = this.y - canvas.height / 2;
                    this.finalAngle = Math.atan2(dy, dx);
                } else {
                    // Move outward in final phase
                    const dispersionProgress = (globalProgress - 0.8) * 5; // Scale to 0-1 range
                    this.x += Math.cos(this.finalAngle) * this.finalSpeed * dispersionProgress;
                    this.y += Math.sin(this.finalAngle) * this.finalSpeed * dispersionProgress;

                    // Fade out
                    this.alpha = Math.max(0, 1 - dispersionProgress);
                }
            }

            draw(ctx: CanvasRenderingContext2D) {
                // Apply glow effect
                ctx.shadowBlur = this.size * 2;
                ctx.shadowColor = this.color;

                // Convert hex to rgba for transparency
                const hexToRgba = (hex: string, alpha: number) => {
                    const r = parseInt(hex.slice(1, 3), 16);
                    const g = parseInt(hex.slice(3, 5), 16);
                    const b = parseInt(hex.slice(5, 7), 16);
                    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
                };

                ctx.fillStyle = hexToRgba(this.color, this.alpha);
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();

                // Reset shadow for performance
                ctx.shadowBlur = 0;
            }
        }

        const createInitialsPath = () => {
            const width = Math.min(canvas.width * 0.7, 400);
            const height = width * 0.6;
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            // Adjust these to control the overall appearance
            const strokeWidth = width * 0.06; // Semi-bold weight
            const letterSpacing = width * 0.08; // Space between letters

            const path: Array<{ x: number; y: number }> = [];

            // --- Modern "J" Letter ---
            const jWidth = width * 0.24;
            const jHeight = height * 0.75;
            const jStartX = centerX - width * 0.28 - letterSpacing / 2;
            const jStartY = centerY - height * 0.32;

            // Top bar of J (outer edge)
            for (let i = 0; i <= 15; i++) {
                path.push({
                    x: jStartX + (jWidth * i) / 15,
                    y: jStartY,
                });
            }

            // Top bar of J (inner edge)
            for (let i = 10; i >= 0; i--) {
                path.push({
                    x: jStartX + (jWidth * i) / 15,
                    y: jStartY + strokeWidth,
                });
            }

            // Right side of J (outer)
            for (let i = 0; i <= 24; i++) {
                path.push({
                    x: jStartX + jWidth,
                    y: jStartY + (jHeight * 0.75 * i) / 24,
                });
            }

            // Right side of J (inner)
            for (let i = 24; i >= 5; i--) {
                path.push({
                    x: jStartX + jWidth - strokeWidth,
                    y: jStartY + (jHeight * 0.75 * i) / 24,
                });
            }

            // Bottom curve of J (outer)
            for (let i = 0; i <= 20; i++) {
                const angle = Math.PI * 2 + (Math.PI * 0.5 * i) / 10;
                const radius = jWidth * 0.5;
                path.push({
                    x: jStartX + jWidth - radius + radius * Math.cos(angle),
                    y: jStartY + jHeight * 0.75 + radius * Math.sin(angle),
                });
            }

            // Bottom curve of J (inner)
            for (let i = 20; i >= 0; i--) {
                const angle = Math.PI * 2 + (Math.PI * 0.5 * i) / 10;
                const radius = jWidth * 0.5 - strokeWidth;
                path.push({
                    x: jStartX + jWidth - radius * 2 + radius * Math.cos(angle),
                    y: jStartY + jHeight * 0.75 + radius * Math.sin(angle),
                });
            }

            // --- Modern "P" Letter ---
            const pWidth = width * 0.18;
            const pHeight = height * 0.75;
            const pStartX = centerX + letterSpacing / 2;
            const pStartY = centerY - height * 0.32;
            const pBowlRadius = pWidth * 0.55; // Radius of the curved part

            // Vertical stem of P (outer left)
            for (let i = 0; i <= 30; i++) {
                path.push({
                    x: pStartX,
                    y: pStartY + (pHeight * i) / 30,
                });
            }

            // Vertical stem of P (inner left)
            for (let i = 30; i >= 5; i--) {
                path.push({
                    x: pStartX + strokeWidth,
                    y: pStartY + (pHeight * i) / 30,
                });
            }

            // Top horizontal of P (outer)
            for (let i = 0; i <= 15; i++) {
                path.push({
                    x: pStartX + (pWidth * i) / 15,
                    y: pStartY,
                });
            }

            // Top right curve of P (outer)
            for (let i = 0; i <= 30; i++) {
                const angle = Math.PI * 0.5 + (Math.PI * i) / 30;
                path.push({
                    x: pStartX + pWidth + (pBowlRadius - pWidth) * Math.cos(angle),
                    y: pStartY + pHeight * 0.31 + (pBowlRadius - pWidth) * Math.sin(angle),
                });
            }

            // Top right curve of P (inner)
            for (let i = 30; i >= 0; i--) {
                const angle = Math.PI * 0.5 + (Math.PI * i) / 30;
                path.push({
                    x: pStartX + pWidth + (pBowlRadius - pWidth - strokeWidth) * Math.cos(angle),
                    y: pStartY + pHeight * 0.31 + (pBowlRadius - pWidth - strokeWidth) * Math.sin(angle),
                });
            }

            // Top horizontal of P (inner)
            for (let i = 15; i >= 5; i--) {
                path.push({
                    x: pStartX + (pWidth * i) / 15,
                    y: pStartY + strokeWidth,
                });
            }

            return path;
        };

        const particles: Particle[] = [];
        const particleCount = Math.min(window.innerWidth * 0.2, 250);
        const path = createInitialsPath();

        // Create particles
        for (let i = 0; i < particleCount; i++) {
            const pathPoint = path[Math.floor(Math.random() * path.length)];
            particles.push(new Particle(0, 0, pathPoint.x, pathPoint.y));
        }

        const startTime = Date.now();
        const animationDuration = 2800; // 2.8 seconds for smooth bezier animation

        // Animation loop
        const animate = () => {
            const now = Date.now();
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / animationDuration, 1);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Slight motion blur for smoother appearance
            ctx.fillStyle = 'rgba(10, 10, 10, 0.2)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Update and draw particles
            particles.forEach((particle) => {
                particle.update(progress);
                particle.draw(ctx);
            });

            if (progress >= 1) {
                // Animation complete, hide loader and show content
                setTimeout(() => {
                    setIsLoading(false);

                    setTimeout(() => {
                        if (!window.location.href.includes('#')) {
                            return;
                        }

                        const duration = 800;
                        const offset = 0;

                        const element = document.getElementById(window.location.href.split('#')[1]);

                        if (element) {
                            // Calculate where to scroll to
                            const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
                            const startPosition = window.pageYOffset;
                            const distance = targetPosition - startPosition;

                            let startTime: number | null = null;

                            // Smooth scroll animation function
                            function animation(currentTime: number) {
                                if (startTime === null) startTime = currentTime;
                                const timeElapsed = currentTime - startTime;
                                const progress = Math.min(timeElapsed / duration, 1);

                                // Easing function - easeInOutCubic
                                const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1);

                                window.scrollTo(0, startPosition + distance * ease(progress));

                                if (timeElapsed < duration) {
                                    requestAnimationFrame(animation);
                                }
                            }

                            requestAnimationFrame(animation);
                        }
                    }, 100);
                }, 100);
                return;
            }

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            window.removeEventListener('resize', updateCanvasSize);
        };
    }, [isLoading]);

    return (
        <>
            <SEO
                title="Jakub Palacký - Home | Portfolio"
                description="Welcome to my portfolio showcasing my work as a full-stack developer specializing in modern web technologies."
                keywords="portfolio, full-stack, developer, react, laravel, inertia"
                url="https://vypal.me/"
            />

            {isLoading ? (
                <div className="bg-background fixed inset-0 flex items-center justify-center">
                    <canvas ref={canvasRef} className="absolute inset-0" />
                </div>
            ) : (
                <div className="bg-background text-foreground min-h-screen">
                    {/* Navigation */}
                    <NavBar auth={auth} />

                    {/* Main Content */}
                    <main className="overflow-hidden">
                        {/* Hero Section */}
                        <HeroSection scrollY={scrollY} />

                        {/* Featured Links */}
                        <FeaturedLinksSection scrollY={scrollY} />

                        {/* About Me */}
                        <AboutSection scrollY={scrollY} />

                        {/* Skills & Technologies */}
                        <SkillsSection scrollY={scrollY} />

                        {/* Projects */}
                        <ProjectsSection scrollY={scrollY} />

                        {/* Latest Poll Section */}
                        <LatestPollSection scrollY={scrollY} />

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
            )}
        </>
    );
}
