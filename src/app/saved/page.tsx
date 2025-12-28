import { getSavedPosts } from "@/app/_actions/bookmark";
import { getCurrentUser } from "@/lib/clerk/server";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function SavedPostsPage() {
  const currentUserId = await getCurrentUser();

  if (!currentUserId) {
    redirect("/sign-in");
  }

  let savedPosts: any[] = [];
  try {
    savedPosts = await getSavedPosts(1, 50);
  } catch (error) {
    console.error("Error fetching saved posts:", error);
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Link
          href="/"
          className="text-xs text-[#818384] hover:text-[#d7dadc] transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </Link>
        <h1 className="text-lg font-bold text-[#d7dadc]">저장된 게시글</h1>
        <span className="text-xs text-[#818384]">({savedPosts.length})</span>
      </div>

      {/* Posts */}
      {savedPosts.length > 0 ? (
        <div className="space-y-3">
          {savedPosts.map((post: any) => (
            <Link key={post.id} href={`/posts/${post.id}`} className="block">
              <article className="reddit-card flex hover:border-[#818384]">
                {/* Vote Section */}
                <div className="flex flex-col items-center py-2 px-2 bg-[#161617] rounded-l min-w-[40px]">
                  <svg
                    className="w-5 h-5 text-[#818384]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 4l-8 8h5v8h6v-8h5z" />
                  </svg>
                  <span className="text-xs font-bold text-[#d7dadc] my-1">
                    {post.likes}
                  </span>
                  <svg
                    className="w-5 h-5 text-[#818384]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 20l8-8h-5V4H9v8H4z" />
                  </svg>
                </div>

                {/* Content Section */}
                <div className="flex-1 p-2 min-w-0">
                  {/* Meta Info */}
                  <div className="post-meta flex items-center gap-1 mb-1 flex-wrap">
                    <span className="text-[#818384] text-xs">
                      Posted by u/
                      {post.user_id ? post.user_id.substring(0, 8) : "익명"}
                    </span>
                    <span className="text-[#818384] text-xs">•</span>
                    <span className="text-[#818384] text-xs">
                      {formatDistanceToNow(new Date(post.created_at), {
                        addSuffix: true,
                        locale: ko,
                      })}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-lg font-medium text-[#d7dadc] mb-1 line-clamp-2">
                    {post.title || post.content.split("\n")[0]}
                  </h2>

                  {/* Content Preview */}
                  <p className="text-sm text-[#818384] line-clamp-2 mb-2">
                    {post.content}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1 -ml-2">
                    <span className="action-button text-accent">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                        />
                      </svg>
                      저장됨
                    </span>
                    <span className="action-button">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      {post.views}
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      ) : (
        <div className="reddit-card p-8 text-center">
          <svg
            className="w-12 h-12 mx-auto text-[#818384] mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
          <p className="text-[#818384] text-sm">저장된 게시글이 없습니다</p>
          <p className="text-[#818384] text-xs mt-1">
            마음에 드는 게시글을 저장해보세요!
          </p>
        </div>
      )}
    </div>
  );
}

