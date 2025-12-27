"use client";

import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';
import { format } from 'date-fns';
import { getPosts } from '@/app/_actions/post';

// Define the type for a single post
type Post = {
    id: string;
    created_at: string;
    user_id: string;
    title: string | null;
    content: string;
    likes: number;
    views: number;
};

interface PostListProps {
  initialPosts: Post[];
}

export default function PostList({ initialPosts }: PostListProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [page, setPage] = useState(2); // Start loading from the second page
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
      // Optionally, handle the error in the UI
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
      <div className="space-y-4">
        {posts.map((post) => (
          <Link key={post.id} href={`/posts/${post.id}`}>
            <div className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">
                  {post.user_id ? `User ${post.user_id.substring(0, 8)}...` : '알 수 없음'} | {format(new Date(post.created_at), 'yyyy.MM.dd HH:mm')}
                </span>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <span>추천 {post.likes}</span>
                  <span>조회 {post.views}</span>
                </div>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2 truncate">
                {post.title || post.content.split('\n')[0]}
              </h2>
              <p className="text-gray-700 line-clamp-2">
                {post.content}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Intersection observer target */}
      {hasMore && (
        <div ref={ref} className="text-center p-4">
          {isLoading ? '로딩 중...' : ''}
        </div>
      )}

      {!hasMore && (
        <div className="text-center p-4 text-gray-500">
          더 이상 게시글이 없습니다.
        </div>
      )}
    </>
  );
}
