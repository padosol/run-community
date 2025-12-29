import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createClient as createServerClient } from "@/lib/supabase/server";

/**
 * 현재 로그인한 사용자 정보를 가져옵니다.
 * @returns 사용자 ID 또는 null (로그인하지 않은 경우)
 */
export async function getCurrentUser() {
  const { userId } = await auth();
  return userId;
}

/**
 * 사용자가 users 테이블에 있는지 확인하고, 없으면 자동으로 추가합니다.
 * Webhook이 동작하지 않거나 늦게 처리되는 경우를 대비한 fallback입니다.
 * @param userId Clerk 사용자 ID
 */
export async function ensureUserExists(userId: string) {
  const supabase = await createServerClient();
  
  // 사용자가 이미 있는지 확인
  const { data: existingUser } = await supabase
    .from('users')
    .select('clerk_user_id')
    .eq('clerk_user_id', userId)
    .single();
  
  if (!existingUser) {
    // users 테이블에 사용자 추가 (기본 username 사용)
    const { error } = await supabase
      .from('users')
      .insert({
        clerk_user_id: userId,
        username: `User_${userId.substring(5, 11)}`,
      });
    
    // 23505 = unique constraint violation (동시 요청으로 이미 추가된 경우)
    if (error && error.code !== '23505') {
      console.error('Error ensuring user exists:', error);
    }
  }
}

/**
 * 인증이 필요한 경우 사용합니다.
 * 로그인하지 않은 경우 로그인 페이지로 리다이렉트합니다.
 * @returns 사용자 ID
 */
export async function requireAuth() {
  const { userId } = await auth();
  
  if (!userId) {
    // Clerk의 기본 로그인 페이지로 리다이렉트
    // Clerk는 자동으로 /sign-in 경로를 처리합니다
    redirect("/sign-in");
  }
  
  return userId;
}

