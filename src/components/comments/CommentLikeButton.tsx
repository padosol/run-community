'use client';

import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { likeComment, unlikeComment } from '@/app/_actions/comment';
import { toast } from 'react-hot-toast';

interface CommentLikeButtonProps {
  commentId: string;
  postId: string;
  initialLikes: number;
  initialHasLiked: boolean;
}

export default function CommentLikeButton({
  commentId,
  postId,
  initialLikes,
  initialHasLiked,
}: CommentLikeButtonProps) {
  const { userId } = useAuth();
  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(initialHasLiked);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (!userId) {
      toast.error('로그인이 필요합니다.');
      return;
    }

    if (isLoading) return;

    setIsLoading(true);

    try {
      if (hasLiked) {
        // 좋아요 취소
        await unlikeComment(commentId, postId);
        setLikes((prev) => Math.max(0, prev - 1));
        setHasLiked(false);
      } else {
        // 좋아요 추가
        const result = await likeComment(commentId, postId);
        if (result.success) {
          setLikes((prev) => prev + 1);
          setHasLiked(true);
        } else if (result.message) {
          toast.error(result.message);
        }
      }
    } catch (error: any) {
      console.error('Error toggling like:', error);
      toast.error(error.message || '좋아요 처리에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`
        flex items-center space-x-1 px-2 py-1 rounded text-xs transition-all duration-200
        ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${
          hasLiked
            ? 'text-accent hover:text-accent-hover hover:bg-[#2d2d2e]'
            : 'text-[#818384] hover:text-accent hover:bg-[#2d2d2e]'
        }
      `}
      aria-label={hasLiked ? '좋아요 취소' : '좋아요'}
    >
      <span className="transition-transform duration-200 hover:scale-110">
        {hasLiked ? (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        )}
      </span>
      <span className="font-medium">{likes}</span>
    </button>
  );
}

