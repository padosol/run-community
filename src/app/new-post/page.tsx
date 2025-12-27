import { requireAuth } from '@/lib/clerk/server';
import NewPostClient from './NewPostClient';

export default async function NewPostPage() {
  // 인증 확인 - 로그인하지 않은 경우 로그인 페이지로 리다이렉트
  await requireAuth();

  return <NewPostClient />;
}
