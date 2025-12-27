// src/app/posts/[id]/edit/page.tsx
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import PostForm from '@/components/posts/PostForm';
import { updatePost } from '@/app/_actions/post'; // Server Action
import { PostFormValues } from '@/lib/validation/post';
import { requireAuth } from '@/lib/clerk/server';

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  // 인증 확인 - 로그인하지 않은 경우 로그인 페이지로 리다이렉트
  const userId = await requireAuth();
  
  const { id } = await params;
  const supabase = await createClient();

  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !post) {
    console.error('Error fetching post for edit:', error);
    notFound();
  }

  // 권한 확인: 게시글 작성자만 수정 가능
  if (post.user_id !== userId) {
    notFound(); // 권한이 없으면 404 페이지 표시
  }

  // Prepare initial values for the form
  const initialValues: Partial<PostFormValues> = {
    title: post.title,
    content: post.content,
  };

  // Define a client-callable function that wraps the server action
  const updatePostAction = async (values: PostFormValues) => {
    // This onSubmit is called from the client-side PostForm.
    // We need to construct FormData here again, as values is a JS object.
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('content', values.content);
    if (values.image && values.image[0]) {
      formData.append('image', values.image[0]);
    } else if (post.image_url && !values.image) {
      // If an existing image was cleared (values.image is null/undefined)
      // This signals to updatePost action to clear the image
      formData.append('image_clear_signal', 'true');
    }

    try {
      await updatePost(id, formData);
    } catch (e: any) {
      alert(e.message || '게시글 수정에 실패했습니다.');
      throw e;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">게시글 수정</h1>
      <PostForm
        initialValues={initialValues}
        onSubmit={updatePostAction} // Client component passing to client component, which wraps server action
        submitButtonText="게시글 수정"
      />
    </div>
  );
}
