'use client';

import { useState } from 'react';
import { savePost, unsavePost } from '@/app/_actions/bookmark';
import { useAuth } from '@clerk/nextjs';
import { toast } from 'react-hot-toast';

interface SaveButtonProps {
  postId: string;
  initialSaved: boolean;
}

export default function SaveButton({ postId, initialSaved }: SaveButtonProps) {
  const { isSignedIn } = useAuth();
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleSave = async () => {
    if (!isSignedIn) {
      toast.error('로그인이 필요합니다.');
      return;
    }

    if (isLoading) return;

    setIsLoading(true);

    try {
      if (isSaved) {
        await unsavePost(postId);
        setIsSaved(false);
        toast.success('저장이 취소되었습니다.');
      } else {
        const result = await savePost(postId);
        if (result.success) {
          setIsSaved(true);
          toast.success('게시글이 저장되었습니다.');
        } else {
          toast.error(result.message || '저장에 실패했습니다.');
        }
      }
    } catch (e: any) {
      console.error('Error toggling save:', e);
      toast.error(e.message || '오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleSave}
      disabled={isLoading}
      className={`action-button ${isSaved ? 'text-accent' : ''} ${isLoading ? 'opacity-50' : ''}`}
    >
      <svg 
        className="w-5 h-5" 
        fill={isSaved ? 'currentColor' : 'none'} 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
      </svg>
      {isSaved ? '저장됨' : '저장'}
    </button>
  );
}

