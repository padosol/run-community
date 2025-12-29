import { getPosts } from "@/app/_actions/post";
import HomeClient from "./HomeClient";

export default async function HomePage() {
  const initialPosts = await getPosts(1, 10, 'popular');

  if (!initialPosts) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="reddit-card p-4 text-center text-accent">
          게시글을 불러오는 데 실패했습니다.
        </div>
      </div>
    );
  }

  return <HomeClient initialPosts={initialPosts} />;
}
