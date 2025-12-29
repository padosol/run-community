"use client";

import { getPosts } from "@/app/_actions/post";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { CATEGORIES, CategoryKey } from "@/lib/constants/category";

// Define the type for a single post
type Post = {
  id: string;
  created_at: string;
  user_id: string;
  title: string | null;
  content: string;
  category?: CategoryKey;
  likes: number;
  upvotes: number;
  downvotes: number;
  views: number;
  author_username?: string;
  author_avatar?: string | null;
  comment_count?: number;
};

interface PostListProps {
  initialPosts: Post[];
  sortBy?: 'latest' | 'popular';
}

export default function PostList({ initialPosts, sortBy = 'latest' }: PostListProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [page, setPage] = useState(2);
  const [hasMore, setHasMore] = useState(sortBy === 'latest'); // 인기는 무한스크롤 비활성화
  const [isLoading, setIsLoading] = useState(false);

  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: false,
  });

  // sortBy가 변경되면 posts와 상태 초기화
  useEffect(() => {
    setPosts(initialPosts);
    setPage(2);
    setHasMore(sortBy === 'latest');
  }, [initialPosts, sortBy]);

  const loadMorePosts = async () => {
    if (isLoading || !hasMore || sortBy !== 'latest') return;
    setIsLoading(true);

    try {
      const limit = 5; // 최신 정렬일 때 5개씩
      const newPosts = await getPosts(page, limit, sortBy);
      if (newPosts && newPosts.length > 0) {
        setPosts((prevPosts) => [...prevPosts, ...newPosts]);
        setPage((prevPage) => prevPage + 1);
        // 5개 미만이면 더 이상 없음
        if (newPosts.length < limit) {
          setHasMore(false);
        }
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
            <article className="reddit-card hover:border-[#818384]">
              {/* Content Section */}
              <div className="flex-1 p-2 sm:p-3 min-w-0">
                {/* Meta Info */}
                <div className="post-meta flex items-center gap-1 mb-1 flex-wrap">
                  {/* Category Tag */}
                  {post.category && CATEGORIES[post.category] && (
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: CATEGORIES[post.category].color }}
                    >
                      {CATEGORIES[post.category].label}
                    </span>
                  )}
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
                <h2 className="text-lg font-medium text-[#d7dadc] mb-2 line-clamp-2">
                  {post.title || post.content.split("\n")[0]}
                </h2>

                {/* Action Buttons - 좋아요, 댓글, 조회수 */}
                <div className="flex items-center gap-1 -ml-2">
                  <span className="action-button">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                    {post.upvotes || 0}
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
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    {post.comment_count || 0}
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
