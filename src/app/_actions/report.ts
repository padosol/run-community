'use server';

import { createClient as createServerClient } from '@/lib/supabase/server';
import { reportSchema } from '@/lib/validation/report';
import { revalidatePath } from 'next/cache';
import { requireAuth } from '@/lib/clerk/server';

export async function createReport(
  target_id: string,
  target_type: 'post' | 'comment',
  formData: FormData
) {
  // 인증 확인
  const userId = await requireAuth();
  
  const supabase = await createServerClient();

  const rawFormData = {
    reason: formData.get('reason'),
  };

  const validatedFields = reportSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    console.error('Validation errors:', validatedFields.error.flatten().fieldErrors);
    throw new Error('신고 사유가 올바르지 않습니다.');
  }

  const { reason } = validatedFields.data;

  const { error } = await supabase
    .from('reports')
    .insert({
      target_id,
      target_type,
      reason,
    });

  if (error) {
    console.error('Error creating report:', error);
    throw new Error('신고 접수에 실패했습니다.');
  }

  // Revalidate paths for posts and comments, though reports are usually handled by admin.
  // This is mainly for demonstrating the action occurred.
  if (target_type === 'post') {
    revalidatePath(`/posts/${target_id}`);
  } else if (target_type === 'comment') {
    // Revalidate the post page where the comment is located.
    // This assumes target_id for comment report is the comment's ID,
    // and we need to find the post_id to revalidate.
    // For simplicity, we might just revalidate all posts or
    // re-fetch the post_id if necessary. For now, let's assume
    // the UI will handle showing a success message and not require
    // immediate revalidation to show a change.
    // However, if the UI needs to reflect that a comment has been reported,
    // we would need to pass post_id to this action or fetch it here.
  }

  return { success: true, message: '신고가 접수되었습니다.' };
}
