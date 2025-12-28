'use server';

import { revalidatePath } from 'next/cache';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/clerk/server';

// vote_type: 1 = upvote, -1 = downvote
export async function vote(postId: string, voteType: 1 | -1) {
  const userId = await requireAuth();
  const supabase = await createServerClient();

  // 현재 투표 상태 확인
  const { data: existingVote, error: checkError } = await supabase
    .from('recommendations')
    .select('id, vote_type')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .single();

  if (checkError && checkError.code !== 'PGRST116') {
    console.error('Error checking existing vote:', checkError);
    throw new Error('투표 확인에 실패했습니다.');
  }

  // 현재 게시글의 upvotes, downvotes 가져오기
  const { data: currentPost } = await supabase
    .from('posts')
    .select('upvotes, downvotes')
    .eq('id', postId)
    .single();

  let upvotes = currentPost?.upvotes || 0;
  let downvotes = currentPost?.downvotes || 0;

  if (existingVote) {
    const currentVoteType = existingVote.vote_type || 0;

    if (currentVoteType === voteType) {
      // 같은 방향 클릭 → 취소
      const { error: deleteError } = await supabase
        .from('recommendations')
        .delete()
        .eq('id', existingVote.id);

      if (deleteError) {
        console.error('Error deleting vote:', deleteError);
        throw new Error('투표 취소에 실패했습니다.');
      }

      // 기존 투표 취소
      if (voteType === 1) {
        upvotes = Math.max(0, upvotes - 1);
      } else {
        downvotes = Math.max(0, downvotes - 1);
      }
    } else {
      // 반대 방향 클릭 → 변경
      const { error: updateError } = await supabase
        .from('recommendations')
        .update({ vote_type: voteType })
        .eq('id', existingVote.id);

      if (updateError) {
        console.error('Error updating vote:', updateError);
        throw new Error('투표 변경에 실패했습니다.');
      }

      // 기존 투표 취소 + 새 투표 적용
      if (currentVoteType === 1) {
        upvotes = Math.max(0, upvotes - 1);
        downvotes = downvotes + 1;
      } else {
        downvotes = Math.max(0, downvotes - 1);
        upvotes = upvotes + 1;
      }
    }
  } else {
    // 새 투표
    const { error: insertError } = await supabase
      .from('recommendations')
      .insert({
        post_id: postId,
        user_id: userId,
        vote_type: voteType,
      });

    if (insertError) {
      console.error('Error inserting vote:', insertError);
      throw new Error(`투표에 실패했습니다: ${insertError.message}`);
    }

    if (voteType === 1) {
      upvotes = upvotes + 1;
    } else {
      downvotes = downvotes + 1;
    }
  }

  // upvotes, downvotes 업데이트
  await supabase
    .from('posts')
    .update({ upvotes, downvotes })
    .eq('id', postId);

  revalidatePath(`/posts/${postId}`);
  revalidatePath('/');

  return { success: true };
}

export async function getVoteStatus(postId: string): Promise<number> {
  const userId = await requireAuth();
  const supabase = await createServerClient();

  const { data } = await supabase
    .from('recommendations')
    .select('vote_type')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .single();

  return data?.vote_type || 0;
}
