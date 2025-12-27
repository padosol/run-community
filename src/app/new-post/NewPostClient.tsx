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
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">새 게시글 작성</h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
      <PostForm onSubmit={handleSubmit} isLoading={isLoading} submitButtonText="게시글 작성" />
    </div>
  );
}

