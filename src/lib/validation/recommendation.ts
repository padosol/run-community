import { z } from 'zod';

export const recommendationSchema = z.object({
  postId: z.string().uuid('유효하지 않은 게시글 ID입니다.'),
  // user_identifier will be generated server-side (e.g., hashed IP/cookie)
});

export type RecommendationFormValues = z.infer<typeof recommendationSchema>;
