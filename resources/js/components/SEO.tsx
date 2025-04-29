import { Head } from '@inertiajs/react';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    type?: string;
    url?: string;
    tags?: string[]; // New tags property
}

export default function SEO({
    title = 'Jakub Palacký - Everything Developer',
    description = 'Everything Developer specializing in backend, frontend, mobile and embedded applications. View my portfolio of projects and skills.',
    keywords = 'portfolio, developer, backend, frontend, mobile, embedded, applications, projects, skills',
    image,
    type = 'website',
    url,
    tags = [], // Default to empty array
}: SEOProps) {
    // Use the current URL if none provided
    const pageUrl = url || window.location.href;

    // Generate comma-separated tags for the og-image query string
    const tagsParam = tags.length > 0 ? `&tags=${encodeURIComponent(tags.join(','))}` : '';

    // Use dynamic OG image if not explicitly provided
    const ogImage =
        image || `/api/og-image?title=${encodeURIComponent(title.split(' | ')[0])}&path=${encodeURIComponent(window.location.pathname)}${tagsParam}`;

    return (
        <Head>
            <title>{title}</title>
            <meta name="title" content={title} />
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />

            <meta property="og:type" content={type} />
            <meta property="og:url" content={pageUrl} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={ogImage} />

            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={pageUrl} />
            <meta property="twitter:title" content={title} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={ogImage} />

            <link rel="canonical" href={pageUrl} />
        </Head>
    );
}
