import Link from 'next/link';
import PostList from '@/components/posts/PostList'; // Import the new component
import { getPosts } from '@/app/_actions/post'; // Import the server action

export default async function HomePage() {
  const initialPosts = await getPosts(1, 10); // Fetch the first 10 posts

  if (!initialPosts) {
    return <div className="text-red-500">게시글을 불러오는 데 실패했습니다.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">게시글 목록</h1>
      <div className="flex justify-end mb-4">
        <Link href="/new-post" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
          글쓰기
        </Link>
      </div>

      {initialPosts.length > 0 ? (
        <PostList initialPosts={initialPosts} /> // Use the PostList component
      ) : (
        <p className="text-center text-gray-600">아직 게시글이 없습니다. 첫 글을 작성해보세요!</p>
      )}
    </div>
  );
}
