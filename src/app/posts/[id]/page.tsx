import CommentList from "@/components/comments/CommentList";
import LikeButton from "@/components/posts/LikeButton";
import PostActions from "@/components/posts/PostActions";
import { getCurrentUser } from "@/lib/clerk/server";
import { createClient } from "@/lib/supabase/server";
import { format } from "date-fns";
import { notFound } from "next/navigation";

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const currentUserId = await getCurrentUser(); // 현재 로그인한 사용자 ID

  // Fetch post details with extended comment fields
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
    notFound(); // If post not found, show 404 page
  }

  // 현재 사용자가 좋아요한 댓글 ID 목록 가져오기
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

  // Increment view count (simple for MVP)
  const { error: updateError } = await supabase
    .from("posts")
    .update({ views: (post.views || 0) + 1 })
    .eq("id", id);

  if (updateError) {
    console.error("Error incrementing view count:", updateError);
    // Optionally, handle error more gracefully, but don't block page load for this.
  }

  // Update post views in the local object for display
  const updatedPost = { ...post, views: (post.views || 0) + 1 };

  const commentCount = updatedPost.comments?.length || 0;

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      {/* 게시글 헤더 - 간결하게 표시 */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-3">
          {updatedPost.title || updatedPost.content.split("\n")[0]}
        </h1>
        <div className="flex flex-wrap justify-between items-center text-sm text-blue-100">
          <span className="flex items-center gap-2">
            <span className="bg-blue-500 px-2 py-1 rounded-full text-xs">
              {updatedPost.user_id
                ? `User ${updatedPost.user_id.substring(0, 8)}...`
                : "익명"}
            </span>
            <span>{format(new Date(updatedPost.created_at), "yyyy.MM.dd HH:mm")}</span>
          </span>
          <div className="flex items-center gap-4 mt-2 sm:mt-0">
            <LikeButton
              postId={updatedPost.id}
              initialLikes={updatedPost.likes}
            />
            <span className="flex items-center gap-1">
              👁️ {updatedPost.views}
            </span>
            <span className="flex items-center gap-1">
              💬 {commentCount}
            </span>
          </div>
        </div>
      </div>

      {/* 게시글 본문 */}
      <div className="bg-white p-6 border-x border-gray-200 shadow-sm">
        <div className="prose max-w-none">
          <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
            {updatedPost.content}
          </p>
          {updatedPost.image_url && (
            <div className="mt-4">
              <img
                src={updatedPost.image_url}
                alt="첨부 이미지"
                className="max-w-full h-auto rounded-lg shadow-md cursor-pointer hover:opacity-95 transition-opacity"
                onClick={() => window.open(updatedPost.image_url, '_blank')}
              />
            </div>
          )}
        </div>

        {/* 게시글 액션 */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <PostActions
            postId={updatedPost.id}
            postUserId={updatedPost.user_id || ""}
            currentUserId={currentUserId}
          />
        </div>
      </div>

      {/* 댓글 섹션 - 메인 콘텐츠로 강조 */}
      <div className="bg-gray-50 rounded-b-xl border border-t-0 border-gray-200 shadow-lg">
        <CommentList
          postId={updatedPost.id}
          comments={updatedPost.comments || []}
          currentUserLikedCommentIds={currentUserLikedCommentIds}
        />
      </div>
    </div>
  );
}
