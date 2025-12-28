'use server';

import { revalidatePath } from 'next/cache';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { commentSchema } from '@/lib/validation/comment';
import { requireAuth } from '@/lib/clerk/server';
import { fetchLinkPreview } from '@/lib/utils/link-preview';

// Helper function for comment image upload
async function uploadCommentImage(imageFile: File | null): Promise<string | null> {
  if (!imageFile || imageFile.size === 0) {
    return null;
  }

  const supabase = await createServerClient();
  const fileExtension = imageFile.name.split('.').pop();
  const filePath = `comments/${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 15)}.${fileExtension}`;

  const { data, error } = await supabase.storage
    .from('comment_images')
    .upload(filePath, imageFile, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Error uploading comment image:', error);
    throw new Error('이미지 업로드에 실패했습니다.');
  }
  return supabase.storage.from('comment_images').getPublicUrl(filePath).data.publicUrl;
}

export async function createComment(postId: string, formData: FormData) {
  // 인증 확인
  const userId = await requireAuth();
  
  const supabase = await createServerClient();

  const rawFormData = {
    content: formData.get('content'),
    image: formData.get('image'),
    link_url: formData.get('link_url'),
    parent_comment_id: formData.get('parent_comment_id'),
  };

  // Validate form data
  const validatedFields = commentSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    console.error('Validation errors:', validatedFields.error.flatten().fieldErrors);
    throw new Error('입력 값이 올바르지 않습니다.');
  }

  const { content, image, link_url, parent_comment_id } = validatedFields.data;

  // 이미지 업로드
  let imageUrl: string | null = null;
  if (image instanceof File && image.size > 0) {
    imageUrl = await uploadCommentImage(image);
  }

  // 링크 미리보기 가져오기
  let linkPreview: any = null;
  if (link_url && typeof link_url === 'string' && link_url.trim() !== '') {
    linkPreview = await fetchLinkPreview(link_url);
  }

  const { error } = await supabase
    .from('comments')
    .insert({
      post_id: postId,
      user_id: userId,
      content,
      parent_comment_id: parent_comment_id || null,
      image_url: imageUrl,
      link_url: link_url && typeof link_url === 'string' && link_url.trim() !== '' ? link_url : null,
      link_preview: linkPreview ? linkPreview : null,
    });

  if (error) {
    console.error('Error creating comment:', error);
    console.error('Supabase error details:', JSON.stringify(error, null, 2));
    throw new Error(`댓글 작성에 실패했습니다: ${error.message}`);
  }

  revalidatePath(`/posts/${postId}`); // Revalidate the post detail page
  // No redirect needed, stay on the same page
}

export async function deleteComment(commentId: string, postId: string) {
  // 인증 확인
  const userId = await requireAuth();
  
  const supabase = await createServerClient();

  // 권한 확인: 댓글 작성자만 삭제 가능
  const { data: existingComment, error: fetchError } = await supabase
    .from('comments')
    .select('user_id')
    .eq('id', commentId)
    .single();

  if (fetchError || !existingComment) {
    console.error('Error fetching comment for delete:', fetchError);
    throw new Error('댓글을 찾을 수 없습니다.');
  }

  if (existingComment.user_id !== userId) {
    throw new Error('댓글을 삭제할 권한이 없습니다.');
  }

  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId);

  if (error) {
    console.error('Error deleting comment:', error);
    throw new Error('댓글 삭제에 실패했습니다.');
  }

  revalidatePath(`/posts/${postId}`); // Revalidate the post detail page
  // No redirect needed, stay on the same page
}

export async function likeComment(commentId: string, postId: string) {
  // 인증 확인
  const userId = await requireAuth();
  
  const supabase = await createServerClient();

  // 이미 좋아요를 눌렀는지 확인
  const { data: existingLike, error: checkError } = await supabase
    .from('comment_likes')
    .select('id')
    .eq('comment_id', commentId)
    .eq('user_id', userId)
    .single();

  if (checkError && checkError.code !== 'PGRST116') { // PGRST116 means 'no rows found'
    console.error('Error checking existing like:', checkError);
    throw new Error('좋아요 여부 확인에 실패했습니다.');
  }

  if (existingLike) {
    // 이미 좋아요를 눌렀으면 아무것도 하지 않음
    return { success: false, message: '이미 좋아요를 눌렀습니다.' };
  }

  // 좋아요 추가
  const { error: insertError } = await supabase
    .from('comment_likes')
    .insert({
      comment_id: commentId,
      user_id: userId,
    });

  if (insertError) {
    console.error('Error inserting comment like:', insertError);
    throw new Error('좋아요 기록에 실패했습니다.');
  }

  // 댓글의 좋아요 수 증가
  const { data: currentComment, error: fetchError } = await supabase
    .from('comments')
    .select('likes')
    .eq('id', commentId)
    .single();

  if (fetchError) {
    console.error('Error fetching comment for like update:', fetchError);
    // 좋아요는 기록되었으므로 에러를 던지지 않음
  } else if (currentComment) {
    const { error: updateError } = await supabase
      .from('comments')
      .update({ likes: (currentComment.likes || 0) + 1 })
      .eq('id', commentId);

    if (updateError) {
      console.error('Error updating comment likes count:', updateError);
      // 좋아요는 기록되었으므로 에러를 던지지 않음
    }
  }

  revalidatePath(`/posts/${postId}`); // Revalidate the post detail page
  return { success: true };
}

export async function unlikeComment(commentId: string, postId: string) {
  // 인증 확인
  const userId = await requireAuth();
  
  const supabase = await createServerClient();

  // 좋아요 삭제
  const { error: deleteError } = await supabase
    .from('comment_likes')
    .delete()
    .eq('comment_id', commentId)
    .eq('user_id', userId);

  if (deleteError) {
    console.error('Error deleting comment like:', deleteError);
    throw new Error('좋아요 취소에 실패했습니다.');
  }

  // 댓글의 좋아요 수 감소
  const { data: currentComment, error: fetchError } = await supabase
    .from('comments')
    .select('likes')
    .eq('id', commentId)
    .single();

  if (fetchError) {
    console.error('Error fetching comment for unlike update:', fetchError);
    // 좋아요는 삭제되었으므로 에러를 던지지 않음
  } else if (currentComment && currentComment.likes > 0) {
    const { error: updateError } = await supabase
      .from('comments')
      .update({ likes: (currentComment.likes || 0) - 1 })
      .eq('id', commentId);

    if (updateError) {
      console.error('Error updating comment likes count:', updateError);
      // 좋아요는 삭제되었으므로 에러를 던지지 않음
    }
  }

  revalidatePath(`/posts/${postId}`); // Revalidate the post detail page
  return { success: true };
}
