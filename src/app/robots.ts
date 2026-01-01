import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/admin/', // Don't index admin pages
        },
        sitemap: 'https://stallmb.com/sitemap.xml',
    };
}
