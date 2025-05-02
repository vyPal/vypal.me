import SEO from '@/components/SEO';
import { marked } from 'marked';
import KairoPrivacyPolicy from './data/kairo.md?raw';

interface PrivacyPolicyProps {
    appName: string;
}

// Map app names to their respective privacy policies
const policyData: Record<string, { content: string; lastUpdated: string }> = {
    kairo: {
        content: KairoPrivacyPolicy,
        lastUpdated: 'May 2, 2025',
    },
    // Add more apps here as needed
};

export default function Show({ appName }: PrivacyPolicyProps) {
    const normalizedAppName = appName.toLowerCase();
    const policy = policyData[normalizedAppName] || { content: '# Privacy Policy Not Found', lastUpdated: 'N/A' };

    // Configure marked for better HTML output
    marked.setOptions({
        breaks: true,
        gfm: true,
    });

    const htmlContent = marked.parse(policy.content);

    const formattedAppName = normalizedAppName.charAt(0).toUpperCase() + normalizedAppName.slice(1);

    const markdownStyles = `
            .markdown-content h1 {
                font-size: 2.25rem !important;
                font-weight: 800 !important;
                margin-top: 2rem !important;
                margin-bottom: 1rem !important;
                color: var(--primary) !important;
            }

            .markdown-content h2 {
                font-size: 1.75rem !important;
                font-weight: 700 !important;
                margin-top: 1.75rem !important;
                margin-bottom: 0.75rem !important;
                color: var(--primary) !important;
            }
        `;

    return (
        <>
            <SEO
                title={`${formattedAppName} Privacy Policy | Jakub Palacký`}
                description={`Privacy Policy for ${formattedAppName} - A mobile application by Jakub Palacký`}
                keywords={`privacy policy, ${normalizedAppName}, mobile app, Jakub Palacký, legal document`}
                url={`https://vypal.me/privacy-policy/${normalizedAppName}`}
                tags={['privacy policy', normalizedAppName, 'mobile app', 'legal document']}
            />

            <style>{markdownStyles}</style>

            <div className="bg-background text-foreground min-h-screen">
                <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
                    <header className="mb-8">
                        <h1 className="text-primary mb-2 text-3xl font-bold md:text-4xl">{formattedAppName} Privacy Policy</h1>
                        <div className="bg-primary h-1 w-20 rounded"></div>
                    </header>

                    {/* This wrapper ensures the prose classes are applied */}
                    <article className="bg-card rounded-xl p-6 shadow-xl sm:p-10">
                        <div
                            className="markdown-content prose prose-lg dark:prose-invert prose-headings:text-primary prose-headings:font-bold prose-h1:text-3xl prose-h1:mb-6 prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-p:text-foreground prose-strong:text-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:text-primary/80 prose-hr:border-border prose-hr:my-6 prose-ul:text-foreground prose-li:marker:text-primary max-w-none"
                            dangerouslySetInnerHTML={{ __html: htmlContent }}
                        />

                        <div className="border-border text-muted-foreground mt-10 border-t pt-8 text-sm">
                            <p>
                                This privacy policy is hosted on{' '}
                                <a href="https://vypal.me" className="text-primary hover:text-primary/80 transition">
                                    vypal.me
                                </a>
                                , the personal website of Jakub Palacký.
                            </p>
                            <p>Last updated: {policy.lastUpdated}</p>
                        </div>
                    </article>
                </div>
            </div>
        </>
    );
}
