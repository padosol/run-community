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
            ? 'text-red-500 bg-red-50 hover:bg-red-100'
            : 'text-gray-500 hover:text-red-500 hover:bg-red-50'
        }
      `}
      aria-label={hasLiked ? '좋아요 취소' : '좋아요'}
    >
      <span className="transition-transform duration-200 hover:scale-110">
        {hasLiked ? '❤️' : '🤍'}
      </span>
      <span className="font-medium">{likes}</span>
    </button>
  );
}

