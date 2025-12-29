import { MetadataRoute } from 'next';
import { getAllPostsForSitemap } from '@/app/_actions/post';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://bluecircle.padosol.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPostsForSitemap();

  const postUrls = posts.map((post) => ({
    url: `${SITE_URL}/posts/${post.id}`,
    lastModified: new Date(post.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${SITE_URL}/new-post`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...postUrls,
  ];
}
