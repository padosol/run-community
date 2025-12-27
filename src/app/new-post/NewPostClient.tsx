'use client';

import PostForm from '@/components/posts/PostForm';
import { createPost } from '@/app/_actions/post';
import { useState } from 'react';

export default function NewPostClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('content', data.content);
    if (data.image && data.image[0]) {
      formData.append('image', data.image[0]);
    }

    try {
      await createPost(formData);
    } catch (e: any) {
      console.error(e);
      setError(e.message || '게시글 작성에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="reddit-card mb-3 p-3 border-b-4 border-[#ff4500]">
        <h1 className="text-lg font-medium text-[#d7dadc]">게시글 작성</h1>
      </div>

      {/* Error Message */}
      {error && (
        <div className="reddit-card mb-3 p-3 border-l-4 border-[#ff4500] bg-[#1a1a1b]">
          <div className="flex items-center gap-2 text-[#ff4500]">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="reddit-card">
        <PostForm onSubmit={handleSubmit} isLoading={isLoading} submitButtonText="게시" />
      </div>
    </div>
  );
}
