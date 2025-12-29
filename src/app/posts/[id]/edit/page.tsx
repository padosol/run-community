// src/app/posts/[id]/edit/page.tsx
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import EditPostClient from './EditPostClient';
import { PostFormValues } from '@/lib/validation/post';
import { requireAuth } from '@/lib/clerk/server';
import Link from 'next/link';

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

  return (
    <div className="max-w-3xl mx-auto p-4">
      <Link 
        href={`/posts/${id}`} 
        className="inline-flex items-center gap-1 text-xs text-[#818384] hover:text-[#d7dadc] mb-4 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        뒤로가기
      </Link>
      <h1 className="text-xl font-semibold mb-4 text-[#d7dadc]">게시글 수정</h1>
      <div className="reddit-card">
        <EditPostClient
          postId={id}
          initialValues={initialValues}
          existingImageUrl={post.image_url}
        />
      </div>
    </div>
  );
}
