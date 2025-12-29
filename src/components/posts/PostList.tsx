"use client";

import { getPosts } from "@/app/_actions/post";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

// Define the type for a single post
type Post = {
  id: string;
  created_at: string;
  user_id: string;
  title: string | null;
  content: string;
  likes: number;
  upvotes: number;
  downvotes: number;
  views: number;
  author_username?: string;
  author_avatar?: string | null;
};

interface PostListProps {
  initialPosts: Post[];
}

export default function PostList({ initialPosts }: PostListProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [page, setPage] = useState(2);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: false,
  });

  const loadMorePosts = async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);

    try {
      const newPosts = await getPosts(page, 10);
      if (newPosts && newPosts.length > 0) {
        setPosts((prevPosts) => [...prevPosts, ...newPosts]);
        setPage((prevPage) => prevPage + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to load more posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      loadMorePosts();
    }
  }, [inView, hasMore, isLoading]);

  return (
    <>
      <div className="space-y-3">
        {posts.map((post) => (
          <Link key={post.id} href={`/posts/${post.id}`} className="block">
            <article className="reddit-card flex hover:border-[#818384]">
              {/* Vote Section */}
              <div className="flex flex-col items-center justify-between py-2 px-2 bg-[#161617] rounded-l min-w-[40px]">
                {/* Upvote - 상단 */}
                <div className="flex flex-col items-center">
                  <svg
                    className="w-4 h-4 text-[#818384]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 4l-8 8h5v8h6v-8h5z" />
                  </svg>
                  <span className="text-xs font-bold text-[#d7dadc]">
                    {post.upvotes || 0}
                  </span>
                </div>
                {/* Downvote - 하단 */}
                <div className="flex flex-col items-center">
                  <span className="text-xs font-bold text-[#d7dadc]">
                    {post.downvotes || 0}
                  </span>
                  <svg
                    className="w-4 h-4 text-[#818384]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 20l8-8h-5V4H9v8H4z" />
                  </svg>
                </div>
              </div>

              {/* Content Section */}
              <div className="flex-1 p-2 min-w-0">
                {/* Meta Info */}
                <div className="post-meta flex items-center gap-1 mb-1 flex-wrap">
                  <span className="text-[#818384] text-xs">
                    Posted by{" "}
                    {post.author_username ||
                      (post.user_id
                        ? `User_${post.user_id.substring(5, 11)}`
                        : "익명")}
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
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    댓글
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

      {/* Intersection observer target */}
      {hasMore && (
        <div ref={ref} className="text-center p-4">
          {isLoading && (
            <div className="flex items-center justify-center gap-2 text-[#818384]">
              <svg
                className="animate-spin w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              로딩 중...
            </div>
          )}
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <div className="text-center p-6 text-[#818384] text-sm">
          더 이상 게시글이 없습니다
        </div>
      )}
    </>
  );
}
