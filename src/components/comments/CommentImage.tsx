'use client';

import { useState } from 'react';

interface CommentImageProps {
  src: string;
  alt?: string;
}

export default function CommentImage({ src, alt = 'Comment image' }: CommentImageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsModalOpen(false);
    }
  };

  if (hasError) {
    return (
      <div className="mt-3 p-4 bg-gray-100 rounded-md text-gray-500 text-sm">
        이미지를 불러올 수 없습니다.
      </div>
    );
  }

  return (
    <>
      {/* 썸네일 이미지 */}
      <div className="mt-3 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-md">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}
        <img
          src={src}
          alt={alt}
          className={`max-w-full max-h-64 h-auto rounded-md shadow-sm cursor-pointer hover:opacity-90 transition-opacity ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onClick={handleImageClick}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
        />
      </div>

      {/* 이미지 모달 */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
          onClick={handleCloseModal}
          onKeyDown={handleKeyDown}
          role="dialog"
          aria-modal="true"
          tabIndex={0}
        >
          <button
            className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300 transition-colors"
            onClick={handleCloseModal}
            aria-label="Close modal"
          >
            ✕
          </button>
          <img
            src={src}
            alt={alt}
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}

