import { z } from 'zod';

export const postSchema = z.object({
  title: z
    .string()
    .min(1, '제목을 입력해주세요.')
    .max(200, '제목은 200자 이하여야 합니다.'),
  content: z
    .string()
    .min(10, '내용은 10자 이상이어야 합니다.')
    .max(5000, '내용은 5000자 이하여야 합니다.'),
  image: z
    .any()
    .optional(), // File object for image upload
});

export type PostFormValues = z.infer<typeof postSchema>;

// Schema for updating a post
export const postUpdateSchema = z.object({
  title: z
    .string()
    .min(1, '제목을 입력해주세요.')
    .max(200, '제목은 200자 이하여야 합니다.')
    .optional(),
  content: z
    .string()
    .min(10, '내용은 10자 이상이어야 합니다.')
    .max(5000, '내용은 5000자 이하여야 합니다.')
    .optional(),
  image: z
    .any()
    .optional(), // File object for image upload
});

export type PostUpdateFormValues = z.infer<typeof postUpdateSchema>;
