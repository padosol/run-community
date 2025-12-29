'use client';

import PostForm from '@/components/posts/PostForm';
import { updatePost } from '@/app/_actions/post';
import { PostFormValues } from '@/lib/validation/post';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { isRedirectError } from 'next/dist/client/components/redirect-error';

interface EditPostClientProps {
  postId: string;
  initialValues: Partial<PostFormValues>;
  existingImageUrl?: string | null;
}

export default function EditPostClient({
  postId,
  initialValues,
  existingImageUrl,
}: EditPostClientProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values: PostFormValues) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('content', values.content);
    
    if (values.image && values.image[0]) {
      formData.append('image', values.image[0]);
    } else if (existingImageUrl && !values.image) {
      // 기존 이미지가 있고 새 이미지가 없으면 이미지 삭제 신호
      formData.append('image_clear_signal', 'true');
    }

    try {
      await updatePost(postId, formData);
      router.push(`/posts/${postId}`);
      router.refresh();
    } catch (e: any) {
      if (isRedirectError(e)) {
        throw e;
      }
      console.error('Error updating post:', e);
      alert(e.message || '게시글 수정에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PostForm
      initialValues={initialValues}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      submitButtonText="게시글 수정"
    />
  );
}

