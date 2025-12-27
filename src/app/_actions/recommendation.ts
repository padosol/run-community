'use server';

import { revalidatePath } from 'next/cache';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/clerk/server';

export async function addLike(postId: string) {
  // 인증 확인
  const userId = await requireAuth();
  
  const supabase = await createServerClient();

  // Check if user already liked this post
  const { data: existingRecommendation, error: recError } = await supabase
    .from('recommendations')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .single();

  if (recError && recError.code !== 'PGRST116') { // PGRST116 means 'no rows found'
    console.error('Error checking existing recommendation:', recError);
    throw new Error('추천 여부 확인에 실패했습니다.');
  }

  if (existingRecommendation) {
    // Already liked, do nothing
    console.log('Post already liked by this user identifier.');
    return { success: false, message: '이미 추천했습니다.' };
  }

  // Add recommendation
  const { error: insertError } = await supabase
    .from('recommendations')
    .insert({
      post_id: postId,
      user_id: userId,
    });

  if (insertError) {
    console.error('Error inserting recommendation:', insertError);
    throw new Error('추천 기록에 실패했습니다.');
  }

  // Increment post likes count
  // First, get current likes count
  const { data: currentPost, error: fetchError } = await supabase
    .from('posts')
    .select('likes')
    .eq('id', postId)
    .single();

  if (fetchError) {
    console.error('Error fetching post for like update:', fetchError);
    // Even if this fails, recommendation is recorded. Decide if this is acceptable.
    // For MVP, just log.
  } else if (currentPost) {
    const { error: updateError } = await supabase
      .from('posts')
      .update({ likes: (currentPost.likes || 0) + 1 })
      .eq('id', postId);

    if (updateError) {
      console.error('Error updating post likes count:', updateError);
      // Even if this fails, recommendation is recorded. Decide if this is acceptable.
      // For MVP, just log.
    }
  }

  revalidatePath(`/posts/${postId}`); // Revalidate the post detail page
  revalidatePath('/'); // Revalidate home page for updated like count

  return { success: true };
}
