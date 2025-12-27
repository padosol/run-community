import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

/**
 * 현재 로그인한 사용자 정보를 가져옵니다.
 * @returns 사용자 ID 또는 null (로그인하지 않은 경우)
 */
export async function getCurrentUser() {
  const { userId } = await auth();
  return userId;
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

