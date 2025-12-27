/**
 * 링크의 메타데이터를 가져옵니다 (Open Graph 태그 등)
 * @param url 링크 URL
 * @returns 링크 미리보기 데이터 또는 null
 */
export async function fetchLinkPreview(url: string): Promise<{
  title?: string;
  description?: string;
  image?: string;
  url: string;
} | null> {
  try {
    // 서버 사이드에서만 실행되므로 fetch 사용 가능
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LinkPreviewBot/1.0)',
      },
      // 타임아웃 설정 (5초)
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      return null;
    }

    const html = await response.text();
    
    // 간단한 OG 태그 파싱 (실제로는 더 정교한 파싱이 필요할 수 있음)
    const ogTitle = html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i)?.[1];
    const ogDescription = html.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i)?.[1];
    const ogImage = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i)?.[1];
    
    // OG 태그가 없으면 기본 메타 태그 사용
    const title = ogTitle || html.match(/<title>([^<]+)<\/title>/i)?.[1] || '';
    const description = ogDescription || html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i)?.[1] || '';

    return {
      title: title.trim() || undefined,
      description: description.trim() || undefined,
      image: ogImage?.trim() || undefined,
      url,
    };
  } catch (error) {
    console.error('Error fetching link preview:', error);
    return null;
  }
}

