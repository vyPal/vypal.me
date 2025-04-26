import React, { useRef, useState } from 'react';

interface ContactSectionProps {
    scrollY: number;
}

export default function ContactSection({ scrollY }: ContactSectionProps) {
    const sectionRef = useRef<HTMLElement>(null);
    const isVisible = scrollY > (sectionRef.current?.offsetTop || 0) - 500;

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError('');

        try {
            // Create a mailto link with the form data
            const subject = `Contact from ${formData.name} via personal website`;
            const body = `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`;

            // Encode the subject and body for the mailto URL
            const mailtoLink = `mailto:vypal420@proton.me?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

            // Open the mailto link
            window.location.href = mailtoLink;

            setSubmitSuccess(true);

            // Reset form after success
            setFormData({ name: '', email: '', message: '' });

            // Reset success message after 5 seconds
            setTimeout(() => {
                setSubmitSuccess(false);
            }, 5000);
        } catch {
            setSubmitError('Something went wrong. Please try again or email me directly at vypal420@proton.me');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section ref={sectionRef} className="bg-[#f5f5f3] py-20 md:py-32 dark:bg-[#0d0d0d]" id="contact">
            <div className="container mx-auto px-6">
                <div className="mx-auto max-w-5xl">
                    <h2
                        className={`mb-4 text-3xl font-bold transition-all duration-700 md:text-4xl ${
                            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                        }`}
                    >
                        Get in <span className="text-[#8847BB] dark:text-[#8847BB]">Touch</span>
                    </h2>

                    <p
                        className={`mb-12 max-w-2xl text-[#706f6c] transition-all delay-200 duration-700 dark:text-[#A1A09A] ${
                            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                        }`}
                    >
                        Have a project in mind or just want to chat? Feel free to reach out to me.
                    </p>

                    <div className="grid gap-12 md:grid-cols-2">
                        <div
                            className={`transition-all delay-300 duration-700 ${
                                isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
                            }`}
                        >
                            <div className="mb-8">
                                <h3 className="mb-4 text-xl font-medium">Contact Information</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-md bg-[#5E4290]/10 text-[#5E4290] dark:bg-[#5E4290]/10 dark:text-[#F9BAEE]">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="font-medium">Email</h4>
                                            <a
                                                href="mailto:vypal420@proton.me"
                                                className="text-sm text-[#706f6c] transition-colors hover:text-[#f53003] dark:text-[#A1A09A] dark:hover:text-[#F9BAEE]"
                                            >
                                                vypal420@proton.me
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-md bg-[#5E4290]/10 text-[#5E4290] dark:bg-[#5E4290]/10 dark:text-[#F9BAEE]">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="font-medium">Location</h4>
                                            <p className="text-sm text-[#706f6c] dark:text-[#A1A09A]">Brno, Czech Republic</p>
                                        </div>
                                    </div>

                                    {/*
                                    <div className="flex items-start">
                                        <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-md bg-[#5E4290]/10 text-[#5E4290] dark:bg-[#5E4290]/10 dark:text-[#F9BAEE]">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="font-medium">Call Me</h4>
                                            <a
                                                href="tel:+1234567890"
                                                className="text-sm text-[#706f6c] transition-colors hover:text-[#f53003] dark:text-[#A1A09A] dark:hover:text-[#FF4433]"
                                            >
                                                +420 234 567 890
                                            </a>
                                        </div>
                                    </div>
                                    */}
                                </div>
                            </div>

                            <h3 className="mb-4 text-xl font-medium">Follow Me</h3>
                            <div className="flex space-x-4">
                                <a
                                    href="https://github.com/vyPal"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e3e3e0] transition-colors hover:border-[#5E4290] dark:border-[#3E3E3A] dark:hover:border-[#F9BAEE]"
                                >
                                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                    </svg>
                                </a>
                                <a
                                    href="https://linkedin.com/in/jakub-palacky"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e3e3e0] transition-colors hover:border-[#5E4290] dark:border-[#3E3E3A] dark:hover:border-[#F9BAEE]"
                                >
                                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                    </svg>
                                </a>
                                <a
                                    href="https://twitter.com/vyPal420"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e3e3e0] transition-colors hover:border-[#5E4290] dark:border-[#3E3E3A] dark:hover:border-[#F9BAEE]"
                                >
                                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        <div
                            className={`transition-all delay-500 duration-700 ${
                                isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
                            }`}
                        >
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="mb-2 block text-sm font-medium">
                                        Your Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full rounded-md border border-[#e3e3e0] bg-white px-4 py-2 focus:ring-2 focus:ring-[#F9BAEE] focus:outline-none dark:border-[#3E3E3A] dark:bg-[#161615] dark:focus:ring-[#F9BAEE]"
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="mb-2 block text-sm font-medium">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full rounded-md border border-[#e3e3e0] bg-white px-4 py-2 focus:ring-2 focus:ring-[#F9BAEE] focus:outline-none dark:border-[#3E3E3A] dark:bg-[#161615] dark:focus:ring-[#F9BAEE]"
                                        placeholder="john@example.com"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" className="mb-2 block text-sm font-medium">
                                        Your Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows={5}
                                        required
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="w-full rounded-md border border-[#e3e3e0] bg-white px-4 py-2 focus:ring-2 focus:ring-[#F9BAEE] focus:outline-none dark:border-[#3E3E3A] dark:bg-[#161615] dark:focus:ring-[#F9BAEE]"
                                        placeholder="How can I help you?"
                                    />
                                </div>

                                {submitSuccess && (
                                    <div className="rounded-md bg-green-100 p-3 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-300">
                                        Your message has been sent successfully. I'll get back to you soon!
                                    </div>
                                )}

                                {submitError && (
                                    <div className="rounded-md bg-red-100 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
                                        {submitError}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full rounded-md bg-[#1b1b18] px-6 py-3 font-medium text-white transition-all hover:bg-black dark:bg-[#eeeeec] dark:text-[#1C1C1A] dark:hover:bg-white ${
                                        isSubmitting ? 'cursor-not-allowed opacity-70' : ''
                                    }`}
                                >
                                    {isSubmitting ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
