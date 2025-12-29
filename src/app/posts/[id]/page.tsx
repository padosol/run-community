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

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const currentUserId = await getCurrentUser();

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
      console.error("Error fetching post:", fallbackResult.error);
      notFound();
    }
    post = fallbackResult.data;
  }

  if (!post) {
    notFound();
  }

  // 저장 여부 확인
  let isSaved = false;
  let hasLiked: number = 0;
  if (currentUserId) {
    const { data: bookmark } = await supabase
      .from("bookmarks")
      .select("id")
      .eq("user_id", currentUserId)
      .eq("post_id", id)
      .single();
    isSaved = !!bookmark;

    // 추천 상태 확인
    const { data: recommendation } = await supabase
      .from("recommendations")
      .select("id, vote_type")
      .eq("user_id", currentUserId)
      .eq("post_id", id)
      .single();
    if (recommendation) {
      hasLiked = recommendation.vote_type || 0;
    }
  }

  let currentUserLikedCommentIds: string[] = [];
  if (currentUserId && post.comments && post.comments.length > 0) {
    const commentIds = post.comments.map((c: { id: string }) => c.id);
    const { data: likedComments } = await supabase
      .from("comment_likes")
      .select("comment_id")
      .eq("user_id", currentUserId)
      .in("comment_id", commentIds);

    if (likedComments) {
      currentUserLikedCommentIds = likedComments.map((lc) => lc.comment_id);
    }
  }

  const { error: updateError } = await supabase
    .from("posts")
    .update({ views: (post.views || 0) + 1 })
    .eq("id", id);

  if (updateError) {
    console.error("Error incrementing view count:", updateError);
  }

  const updatedPost = { ...post, views: (post.views || 0) + 1 };
  const commentCount = updatedPost.comments?.length || 0;

  return (
    <div className="max-w-3xl mx-auto">
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
        <div className="p-3">
          {/* Meta Info with Save and Views */}
          <div className="post-meta flex items-center justify-between gap-1 mb-2 flex-wrap">
            <div className="flex items-center gap-1 flex-wrap">
              <span className="tag-accent">
                커뮤니티
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
