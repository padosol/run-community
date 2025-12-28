import { getPosts } from "@/app/_actions/post";
import PostList from "@/components/posts/PostList";
import Link from "next/link";

export default async function HomePage() {
  const initialPosts = await getPosts(1, 10);

  if (!initialPosts) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="reddit-card p-4 text-center text-accent">
          게시글을 불러오는 데 실패했습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Sort Tabs */}
      <div className="reddit-card mb-3 p-2 flex items-center gap-2">
        <span className="action-button bg-[#272729] rounded-full !text-[#d7dadc]">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
          인기
        </span>
        <span className="action-button">
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
        </span>
      </div>

      {/* Post List */}
      {initialPosts.length > 0 ? (
        <PostList initialPosts={initialPosts} />
      ) : (
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
      )}
    </div>
  );
}
