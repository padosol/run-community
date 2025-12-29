"use client";

import { vote } from "@/app/_actions/recommendation";
import { useAuth } from "@clerk/nextjs";
import { useState } from "react";
import { toast } from "react-hot-toast";

interface LikeButtonProps {
  postId: string;
  initialUpvotes: number;
  initialDownvotes: number;
  initialVoteType?: number; // 1: upvote, -1: downvote, 0: no vote
}

export default function LikeButton({
  postId,
  initialUpvotes,
  initialDownvotes,
  initialVoteType = 0,
}: LikeButtonProps) {
  const { isSignedIn } = useAuth();
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [downvotes, setDownvotes] = useState(initialDownvotes);
  const [voteType, setVoteType] = useState(initialVoteType);
  const [isLoading, setIsLoading] = useState(false);

  const handleVote = async (newVoteType: 1 | -1) => {
    if (!isSignedIn) {
      toast.error("로그인이 필요합니다.");
      return;
    }
    if (isLoading) return;

    setIsLoading(true);

    // Optimistic update
    const oldVoteType = voteType;
    const oldUpvotes = upvotes;
    const oldDownvotes = downvotes;

    let newUpvotes = upvotes;
    let newDownvotes = downvotes;
    let finalVoteType = newVoteType;

    if (voteType === newVoteType) {
      // 같은 방향 → 취소
      if (newVoteType === 1) {
        newUpvotes = Math.max(0, upvotes - 1);
      } else {
        newDownvotes = Math.max(0, downvotes - 1);
      }
      finalVoteType = 0;
    } else if (voteType === 0) {
      // 투표 없음 → 새 투표
      if (newVoteType === 1) {
        newUpvotes = upvotes + 1;
      } else {
        newDownvotes = downvotes + 1;
      }
    } else {
      // 반대 방향 → 변경
      if (voteType === 1) {
        newUpvotes = Math.max(0, upvotes - 1);
        newDownvotes = downvotes + 1;
      } else {
        newDownvotes = Math.max(0, downvotes - 1);
        newUpvotes = upvotes + 1;
      }
    }

    setUpvotes(newUpvotes);
    setDownvotes(newDownvotes);
    setVoteType(finalVoteType === 0 ? 0 : newVoteType);

    try {
      await vote(postId, newVoteType);
    } catch (e: any) {
      // Rollback on error
      setUpvotes(oldUpvotes);
      setDownvotes(oldDownvotes);
      setVoteType(oldVoteType);
      console.error("Error voting:", e);
      toast.error(e.message || "오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Upvote button */}
      <button
        onClick={() => handleVote(1)}
        disabled={isLoading}
        className={`p-1 transition-colors cursor-pointer ${
          voteType === 1 ? "text-accent" : "text-[#818384] hover:text-accent"
        } ${isLoading ? "opacity-50 !cursor-not-allowed" : ""}`}
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 4l-8 8h5v8h6v-8h5z" />
        </svg>
      </button>
      
      {/* Upvotes count */}
      <span
        className={`text-sm font-bold min-w-[30px] text-center ${
          voteType === 1 ? "text-accent" : "text-[#d7dadc]"
        }`}
      >
        {upvotes}
      </span>
      
      {/* Downvotes count */}
      <span
        className={`text-sm font-bold min-w-[30px] text-center ${
          voteType === -1 ? "text-[#7193ff]" : "text-[#d7dadc]"
        }`}
      >
        {downvotes}
      </span>
      
      {/* Downvote button */}
      <button
        onClick={() => handleVote(-1)}
        disabled={isLoading}
        className={`p-1 transition-colors cursor-pointer ${
          voteType === -1
            ? "text-[#7193ff]"
            : "text-[#818384] hover:text-[#7193ff]"
        } ${isLoading ? "opacity-50 !cursor-not-allowed" : ""}`}
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 20l8-8h-5V4H9v8H4z" />
        </svg>
      </button>
    </div>
  );
}
