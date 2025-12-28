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

  const { data: post, error: postError } = await supabase
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

  if (postError || !post) {
    console.error("Error fetching post:", postError);
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
        <div className="flex">
          {/* Vote Section */}
          <div className="flex flex-col items-center justify-center py-3 px-3 bg-[#161617] rounded-l min-w-[50px]">
            <LikeButton
              postId={updatedPost.id}
              initialUpvotes={updatedPost.upvotes || 0}
              initialDownvotes={updatedPost.downvotes || 0}
              initialVoteType={hasLiked}
            />
          </div>

          {/* Content Section */}
          <div className="flex-1 p-3 min-w-0">
            {/* Meta Info */}
            <div className="post-meta flex items-center gap-1 mb-2 flex-wrap">
              <span className="tag-accent">
                커뮤니티
              </span>
              <span className="text-[#818384] text-xs">•</span>
              <span className="text-[#818384] text-xs">
                Posted by u/{updatedPost.user_id ? updatedPost.user_id.substring(0, 8) : '익명'}
              </span>
              <span className="text-[#818384] text-xs">•</span>
              <span className="text-[#818384] text-xs">
                {formatDistanceToNow(new Date(updatedPost.created_at), { addSuffix: true, locale: ko })}
              </span>
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
              <span className="action-button">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {commentCount} 댓글
              </span>
              <SaveButton postId={updatedPost.id} initialSaved={isSaved} />
              <span className="action-button">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {updatedPost.views}
              </span>

              {/* Post Actions (Edit/Delete) */}
              <div className="ml-auto">
                <PostActions
                  postId={updatedPost.id}
                  postUserId={updatedPost.user_id || ""}
                  currentUserId={currentUserId}
                />
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Comments Section */}
      <div className="reddit-card mt-3">
        <CommentList
          postId={updatedPost.id}
          comments={updatedPost.comments || []}
          currentUserLikedCommentIds={currentUserLikedCommentIds}
        />
      </div>
    </div>
  );
}
