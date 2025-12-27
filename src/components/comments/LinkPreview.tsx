'use client';

interface LinkPreviewData {
  title?: string;
  description?: string;
  image?: string;
  url: string;
}

interface LinkPreviewProps {
  preview: LinkPreviewData;
  linkUrl?: string;
}

export default function LinkPreview({ preview, linkUrl }: LinkPreviewProps) {
  const displayUrl = preview.url || linkUrl;

  if (!displayUrl) {
    return null;
  }

  return (
    <a
      href={displayUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-3 block border border-gray-200 rounded-lg overflow-hidden hover:bg-gray-50 transition-colors group"
    >
      <div className="flex">
        {/* 이미지 썸네일 */}
        {preview.image && (
          <div className="w-24 h-24 flex-shrink-0 bg-gray-100">
            <img
              src={preview.image}
              alt={preview.title || 'Link preview'}
              className="w-full h-full object-cover"
              onError={(e) => {
                // 이미지 로드 실패 시 숨김
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}

        {/* 텍스트 정보 */}
        <div className="p-3 flex-1 min-w-0">
          {/* 제목 */}
          <p className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
            {preview.title || displayUrl}
          </p>

          {/* 설명 */}
          {preview.description && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
              {preview.description}
            </p>
          )}

          {/* URL */}
          <p className="text-xs text-blue-500 mt-1 truncate">
            {displayUrl}
          </p>
        </div>
      </div>
    </a>
  );
}

// 링크만 있고 미리보기가 없는 경우 사용
export function SimpleLinkPreview({ url }: { url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-2 inline-flex items-center text-sm text-blue-500 hover:text-blue-700 hover:underline transition-colors"
    >
      <span className="mr-1">🔗</span>
      <span className="truncate max-w-xs">{url}</span>
    </a>
  );
}

