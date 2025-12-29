import { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://bluecircle.padosol.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/sign-in/', '/sign-up/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
