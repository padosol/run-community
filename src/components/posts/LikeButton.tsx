'use client';

import { useState } from 'react';
import { addLike } from '@/app/_actions/recommendation';
import { ThumbsUp } from 'lucide-react'; // Using lucide-react for icon

interface LikeButtonProps {
  postId: string;
  initialLikes: number;
}

export default function LikeButton({ postId, initialLikes }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(false); // To prevent multiple clicks from client-side
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLike = async () => {
    if (hasLiked || isLoading) return; // Prevent multiple submissions

    setIsLoading(true);
    setError(null);

    try {
      const result = await addLike(postId);
      if (result && result.success) {
        setLikes((prev) => prev + 1);
        setHasLiked(true);
      } else if (result && result.message) {
        setError(result.message); // Display message like '이미 추천했습니다.'
      }
    } catch (e: any) {
      console.error('Error adding like:', e);
      setError(e.message || '추천 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={isLoading || hasLiked}
      className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium transition-all
        ${hasLiked ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
        ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <ThumbsUp size={16} />
      <span>추천 {likes}</span>
      {error && <span className="ml-2 text-red-500">{error}</span>}
    </button>
  );
}
