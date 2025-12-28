'use server';

import { revalidatePath } from 'next/cache';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/clerk/server';

export async function savePost(postId: string) {
  const userId = await requireAuth();
  const supabase = await createServerClient();

  // 이미 저장했는지 확인
  const { data: existing } = await supabase
    .from('bookmarks')
    .select('id')
    .eq('user_id', userId)
    .eq('post_id', postId)
    .single();

  if (existing) {
    return { success: false, message: '이미 저장된 게시글입니다.' };
  }

  const { error } = await supabase
    .from('bookmarks')
    .insert({
      user_id: userId,
      post_id: postId,
    });

  if (error) {
    console.error('Error saving post:', error);
    console.error('Supabase error details:', JSON.stringify(error, null, 2));
    throw new Error(`게시글 저장에 실패했습니다: ${error.message}`);
  }

  revalidatePath(`/posts/${postId}`);
  revalidatePath('/saved');
  return { success: true };
}

export async function unsavePost(postId: string) {
  const userId = await requireAuth();
  const supabase = await createServerClient();

  const { error } = await supabase
    .from('bookmarks')
    .delete()
    .eq('user_id', userId)
    .eq('post_id', postId);

  if (error) {
    console.error('Error unsaving post:', error);
    throw new Error('저장 취소에 실패했습니다.');
  }

  revalidatePath(`/posts/${postId}`);
  revalidatePath('/saved');
  return { success: true };
}

export async function checkSaved(postId: string): Promise<boolean> {
  const userId = await requireAuth();
  const supabase = await createServerClient();

  const { data } = await supabase
    .from('bookmarks')
    .select('id')
    .eq('user_id', userId)
    .eq('post_id', postId)
    .single();

  return !!data;
}

export async function getSavedPosts(page: number = 1, limit: number = 10) {
  const userId = await requireAuth();
  const supabase = await createServerClient();

  const offset = (page - 1) * limit;

  const { data, error } = await supabase
    .from('bookmarks')
    .select(`
      id,
      created_at,
      post:posts(
        id,
        created_at,
        user_id,
        title,
        content,
        likes,
        views
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Error fetching saved posts:', error);
    throw new Error('저장된 게시글을 불러오는데 실패했습니다.');
  }

  return data?.map(bookmark => bookmark.post).filter(Boolean) || [];
}

