'use client';

import { useState, useEffect } from 'react';
import PostList from '@/components/posts/PostList';
import Link from 'next/link';
import { getPosts } from '@/app/_actions/post';

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

interface HomeClientProps {
  initialPosts: Post[];
}

export default function HomeClient({ initialPosts }: HomeClientProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('popular');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const limit = sortBy === 'popular' ? 10 : 10;
        const fetchedPosts = await getPosts(1, limit, sortBy);
        setPosts(fetchedPosts || []);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // 정렬 변경 시 서버에서 데이터 가져오기
    fetchPosts();
  }, [sortBy]);

  return (
    <div className="max-w-3xl mx-auto">
      {/* Sort Tabs */}
      <div className="reddit-card mb-3 p-2 flex items-center gap-2">
        <button
          onClick={() => setSortBy('popular')}
          className={`action-button rounded-full transition-colors ${
            sortBy === 'popular'
              ? 'bg-[#272729] !text-[#d7dadc]'
              : 'hover:bg-[#272729]'
          }`}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
          인기
        </button>
        <button
          onClick={() => setSortBy('latest')}
          className={`action-button rounded-full transition-colors ${
            sortBy === 'latest'
              ? 'bg-[#272729] !text-[#d7dadc]'
              : 'hover:bg-[#272729]'
          }`}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          최신
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="reddit-card p-4 text-center">
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
        </div>
      )}

      {/* Post List */}
      {!isLoading && posts.length > 0 ? (
        <PostList initialPosts={posts} />
      ) : !isLoading && posts.length === 0 ? (
        <div className="reddit-card p-8 text-center">
          <div className="text-[#818384] mb-4">
            <svg
              className="w-16 h-16 mx-auto mb-4"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
            </svg>
            <p className="text-lg">아직 게시글이 없습니다</p>
            <p className="text-sm mt-2">첫 글을 작성해보세요!</p>
          </div>
          <Link href="/new-post" className="inline-block reddit-button">
            글쓰기
          </Link>
        </div>
      ) : null}
    </div>
  );
}

