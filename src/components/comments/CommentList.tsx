"use client";

import { createComment } from "@/app/_actions/comment";
import { CommentFormValues } from "@/lib/validation/comment";
import { useState } from "react";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";

interface Comment {
  id: string;
  created_at: string;
  user_id: string;
  content: string;
  parent_comment_id?: string | null;
  image_url?: string | null;
  link_url?: string | null;
  link_preview?: {
    title?: string;
    description?: string;
    image?: string;
    url: string;
  } | null;
  likes: number;
}

interface CommentListProps {
  postId: string;
  comments: Comment[];
  currentUserLikedCommentIds?: string[];
}

export default function CommentList({
  postId,
  comments,
  currentUserLikedCommentIds = [],
}: CommentListProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"latest" | "likes">("latest");

  const handleCreateComment = async (data: CommentFormValues) => {
    setIsLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("content", data.content);

    try {
      await createComment(postId, formData);
    } catch (e: any) {
      if (isRedirectError(e)) {
        throw e;
      }
      console.error(e);
      setError(e.message || "댓글 작성에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 댓글을 트리 구조로 구성
  const buildCommentTree = (comments: Comment[]) => {
    const commentMap = new Map<string, Comment & { replies: Comment[] }>();
    const rootComments: (Comment & { replies: Comment[] })[] = [];

    comments.forEach((comment) => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    comments.forEach((comment) => {
      const commentWithReplies = commentMap.get(comment.id)!;
      if (
        comment.parent_comment_id &&
        commentMap.has(comment.parent_comment_id)
      ) {
        commentMap
          .get(comment.parent_comment_id)!
          .replies.push(commentWithReplies);
      } else {
        rootComments.push(commentWithReplies);
      }
    });

    commentMap.forEach((comment) => {
      comment.replies.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    });

    return rootComments;
  };

  const commentTree = buildCommentTree(comments);

  const sortedComments = [...commentTree].sort((a, b) => {
    if (sortBy === "likes") {
      return b.likes - a.likes;
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <div className="p-3">
      {/* 댓글 헤더 */}
      <div className="flex justify-between items-center mb-3 pb-2 border-b border-[#343536]">
        <h2 className="text-xs font-bold text-[#d7dadc] flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          댓글 {comments.length}개
        </h2>
        <div className="flex gap-1">
          <button
            onClick={() => setSortBy("latest")}
            className={`px-2 py-0.5 text-xs rounded transition-colors ${
              sortBy === "latest"
                ? "bg-[#272729] text-[#d7dadc]"
                : "text-[#818384] hover:text-[#d7dadc]"
            }`}
          >
            최신순
          </button>
          <button
            onClick={() => setSortBy("likes")}
            className={`px-2 py-0.5 text-xs rounded transition-colors ${
              sortBy === "likes"
                ? "bg-[#272729] text-[#d7dadc]"
                : "text-[#818384] hover:text-[#d7dadc]"
            }`}
          >
            인기순
          </button>
        </div>
      </div>

      {/* 댓글 작성 폼 */}
      <div className="mb-3">
        <CommentForm
          postId={postId}
          onSubmit={handleCreateComment}
          isLoading={isLoading}
        />
      </div>

      {error && (
        <div className="mb-3 p-2 bg-[#1a1a1b] border-l-2 border-accent rounded text-xs text-accent">
          {error}
        </div>
      )}

      {/* 댓글 목록 */}
      {sortedComments && sortedComments.length > 0 ? (
        <div className="space-y-2">
          {sortedComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={postId}
              currentUserLikedCommentIds={currentUserLikedCommentIds}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-[#818384] text-xs">아직 댓글이 없습니다</p>
        </div>
      )}
    </div>
  );
}
