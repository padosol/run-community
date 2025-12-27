import { z } from 'zod';

export const reportSchema = z.object({
  reason: z.string().min(1, '신고 사유를 입력해주세요.'),
});

export type ReportFormValues = z.infer<typeof reportSchema>;
