import { z } from 'zod';

export const commentSchema = z.object({
  content: z
    .string()
    .min(1, '내용을 입력해주세요.')
    .max(1000, '내용은 1000자 이하여야 합니다.'),
  image: z
    .any()
    .optional()
    .nullable(),
  link_url: z
    .string()
    .url('올바른 URL 형식이 아닙니다.')
    .optional()
    .nullable()
    .or(z.literal('')),
  parent_comment_id: z
    .string()
    .uuid('올바른 댓글 ID 형식이 아닙니다.')
    .optional()
    .nullable(),
});

export type CommentFormValues = z.infer<typeof commentSchema>;
