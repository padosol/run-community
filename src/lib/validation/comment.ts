import { z } from 'zod';

export const commentSchema = z.object({
  content: z
    .string()
    .min(5, '내용은 5자 이상이어야 합니다.')
    .max(1000, '내용은 1000자 이하여야 합니다.'),
  image: z
    .any()
    .optional(), // File object for image upload
  link_url: z
    .string()
    .url('올바른 URL 형식이 아닙니다.')
    .optional()
    .or(z.literal('')), // 빈 문자열도 허용
  parent_comment_id: z
    .string()
    .uuid('올바른 댓글 ID 형식이 아닙니다.')
    .optional()
    .nullable(),
});

export type CommentFormValues = z.infer<typeof commentSchema>;
