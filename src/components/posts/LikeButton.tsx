'use client';

import { useState } from 'react';
import { addLike } from '@/app/_actions/recommendation';

interface LikeButtonProps {
  postId: string;
  initialLikes: number;
}

export default function LikeButton({ postId, initialLikes }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = async () => {
    if (hasLiked || isLoading) return;

    setIsLoading(true);

    try {
      const result = await addLike(postId);
      if (result && result.success) {
        setLikes((prev) => prev + 1);
        setHasLiked(true);
      }
    } catch (e: any) {
      console.error('Error adding like:', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button 
        onClick={handleLike}
        disabled={isLoading || hasLiked}
        className={`vote-arrow upvote p-1 transition-colors ${
          hasLiked ? 'text-accent' : 'text-[#818384] hover:text-accent'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 4l-8 8h5v8h6v-8h5z"/>
        </svg>
      </button>
      <span className="text-xs font-bold text-[#d7dadc] my-1">
        {likes}
      </span>
      <button 
        className="vote-arrow downvote p-1 text-[#818384] hover:text-[#7193ff] transition-colors"
        onClick={(e) => e.preventDefault()}
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 20l8-8h-5V4H9v8H4z"/>
        </svg>
      </button>
    </div>
  );
}
