import CommentList from "@/components/comments/CommentList";
import LikeButton from "@/components/posts/LikeButton";
import PostActions from "@/components/posts/PostActions";
import SaveButton from "@/components/posts/SaveButton";
import { getCurrentUser } from "@/lib/clerk/server";
import { createClient } from "@/lib/supabase/server";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORIES, CategoryKey } from "@/lib/constants/category";
import { Metadata } from "next";
import { cache } from "react";

// 캐시된 게시글 조회 함수 (generateMetadata와 페이지 컴포넌트 간 중복 쿼리 방지)
const getPostWithComments = cache(async (id: string) => {
  const supabase = await createClient();

  // 먼저 users 테이블 JOIN 시도
  let { data: post, error: postError } = await supabase
    .from("posts")
    .select(
      `
      *,
      author:users!fk_posts_user(username, avatar_url),
      comments(
        id,
        created_at,
        user_id,
        content,
        parent_comment_id,
        image_url,
        link_url,
        link_preview,
        likes,
        commenter:users!fk_comments_user(username, avatar_url)
      )
    `
    )
    .eq("id", id)
    .single();

  // users 테이블이 없거나 외래키가 없으면 기본 쿼리로 fallback
  if (postError) {
    console.log("Falling back to basic query:", postError.message);
    const fallbackResult = await supabase
      .from("posts")
      .select(
        `
        *,
        comments(
          id,
          created_at,
          user_id,
          content,
          parent_comment_id,
          image_url,
          link_url,
          link_preview,
          likes
        )
      `
      )
      .eq("id", id)
      .single();

    if (fallbackResult.error || !fallbackResult.data) {
      return null;
    }
    post = fallbackResult.data;
  }

  return post;
});

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const post = await getPostWithComments(id);

  if (!post) {
    return {
      title: '게시글을 찾을 수 없습니다',
    };
  }

  const title = post.title || post.content.substring(0, 50);
  const description = post.content.substring(0, 160).replace(/\n/g, ' ');

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: post.created_at,
    },
  };
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // 캐시된 함수로 게시글 조회 (generateMetadata와 공유)
  const post = await getPostWithComments(id);

  if (!post) {
    notFound();
  }

  // 현재 사용자 ID 조회
  const currentUserId = await getCurrentUser();

  // 사용자 관련 쿼리들을 병렬로 실행
  let isSaved = false;
  let hasLiked: number = 0;
  let currentUserLikedCommentIds: string[] = [];

  if (currentUserId) {
    const commentIds = post.comments?.map((c: { id: string }) => c.id) || [];

    // Promise.all로 병렬 실행 (북마크, 추천, 댓글 좋아요 동시 조회)
    const [bookmarkResult, recommendationResult, likedCommentsResult] = await Promise.all([
      supabase
        .from("bookmarks")
        .select("id")
        .eq("user_id", currentUserId)
        .eq("post_id", id)
        .single(),
      supabase
        .from("recommendations")
        .select("id, vote_type")
        .eq("user_id", currentUserId)
        .eq("post_id", id)
        .single(),
      commentIds.length > 0
        ? supabase
            .from("comment_likes")
            .select("comment_id")
            .eq("user_id", currentUserId)
            .in("comment_id", commentIds)
        : Promise.resolve({ data: null }),
    ]);

    isSaved = !!bookmarkResult.data;
    hasLiked = recommendationResult.data?.vote_type || 0;
    currentUserLikedCommentIds = likedCommentsResult.data?.map((lc: { comment_id: string }) => lc.comment_id) || [];
  }

  // 조회수 증가 (비동기 - 응답 대기 없이 실행)
  supabase
    .from("posts")
    .update({ views: (post.views || 0) + 1 })
    .eq("id", id)
    .then(({ error }) => {
      if (error) console.error("Error incrementing view count:", error);
    });

  const updatedPost = { ...post, views: (post.views || 0) + 1 };
  const commentCount = updatedPost.comments?.length || 0;

  return (
    <div className="max-w-3xl mx-auto w-full px-2 sm:px-4">
      {/* Back Button */}
      <Link 
        href="/" 
        className="inline-flex items-center gap-1 text-xs text-[#818384] hover:text-[#d7dadc] mb-3 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        목록으로
      </Link>

      {/* Post Card */}
      <article className="reddit-card">
        <div className="p-3 sm:p-4">
          {/* Meta Info with Save and Views */}
          <div className="post-meta flex items-center justify-between gap-1 mb-2 flex-wrap">
            <div className="flex items-center gap-1 flex-wrap">
              <span
                className="px-2 py-0.5 rounded-full text-xs font-medium text-white"
                style={{ backgroundColor: CATEGORIES[(updatedPost.category as CategoryKey) || 'free']?.color || '#818384' }}
              >
                {CATEGORIES[(updatedPost.category as CategoryKey) || 'free']?.label || '자유게시판'}
              </span>
              <span className="text-[#818384] text-xs">•</span>
              <span className="text-[#818384] text-xs">
                Posted by {(updatedPost.author as any)?.username || (updatedPost.user_id ? `User_${updatedPost.user_id.substring(5, 11)}` : '익명')}
              </span>
              <span className="text-[#818384] text-xs">•</span>
              <span className="text-[#818384] text-xs">
                {formatDistanceToNow(new Date(updatedPost.created_at), { addSuffix: true, locale: ko })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <SaveButton postId={updatedPost.id} initialSaved={isSaved} />
              <span className="action-button">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {updatedPost.views}
              </span>
            </div>
          </div>

            {/* Title */}
            <h1 className="text-xl font-semibold text-[#d7dadc] mb-3">
              {updatedPost.title || updatedPost.content.split("\n")[0]}
            </h1>

            {/* Content */}
            <div className="text-[#d7dadc] text-sm leading-relaxed whitespace-pre-wrap mb-4">
              {updatedPost.content}
            </div>

            {/* Image */}
            {updatedPost.image_url && (
              <div className="mb-4 rounded overflow-hidden">
                <img
                  src={updatedPost.image_url}
                  alt="첨부 이미지"
                  className="max-w-full h-auto cursor-pointer hover:opacity-95 transition-opacity"
                  onClick={() => window.open(updatedPost.image_url, '_blank')}
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-1 -ml-2 mt-2">
              {/* 첫 번째 섹션 - 비움 */}
              <div className="flex-1"></div>

              {/* 두 번째 섹션 - 좋아요 버튼 중앙 배치 */}
              <div className="flex-1 flex justify-center">
                <LikeButton
                  postId={updatedPost.id}
                  initialUpvotes={updatedPost.upvotes || 0}
                  initialDownvotes={updatedPost.downvotes || 0}
                  initialVoteType={hasLiked}
                />
              </div>

              {/* 세 번째 섹션 - Post Actions (Edit/Delete) */}
              <div className="flex-1 flex justify-end">
                <PostActions
                  postId={updatedPost.id}
                  postUserId={updatedPost.user_id || ""}
                  currentUserId={currentUserId}
                />
              </div>
            </div>
          </div>
      </article>

      {/* Comments Section */}
      <div className="reddit-card mt-3">
        <CommentList
          postId={updatedPost.id}
          postUserId={updatedPost.user_id || ""}
          comments={updatedPost.comments || []}
          currentUserLikedCommentIds={currentUserLikedCommentIds}
        />
      </div>
    </div>
  );
}
