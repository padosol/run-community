"use client";

import { createComment } from "@/app/_actions/comment";
import { CommentFormValues } from "@/lib/validation/comment";
import { useState } from "react";
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
    if (data.image && data.image[0]) {
      formData.append("image", data.image[0]);
    }
    if (data.link_url) {
      formData.append("link_url", data.link_url);
    }

    try {
      await createComment(postId, formData);
    } catch (e: any) {
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

    // 모든 댓글을 맵에 추가
    comments.forEach((comment) => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    // 부모-자식 관계 구성
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

    // 대댓글 정렬 (최신순)
    commentMap.forEach((comment) => {
      comment.replies.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    });

    return rootComments;
  };

  const commentTree = buildCommentTree(comments);

  // 정렬된 댓글
  const sortedComments = [...commentTree].sort((a, b) => {
    if (sortBy === "likes") {
      return b.likes - a.likes;
    }
    // 최신순 (내림차순)
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <div className="p-6">
      {/* 댓글 작성 폼 - 상단에 강조 배치 */}
      <div className="mb-6">
        <CommentForm
          postId={postId}
          onSubmit={handleCreateComment}
          isLoading={isLoading}
        />
      </div>

      {error && (
        <div
          className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-r mb-4"
          role="alert"
        >
          <p className="font-medium">오류 발생</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* 댓글 헤더 */}
      <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          💬 댓글
          <span className="bg-blue-100 text-blue-700 text-sm px-2 py-0.5 rounded-full">
            {comments.length}
          </span>
        </h2>
        <div className="flex gap-1">
          <button
            onClick={() => setSortBy("latest")}
            className={`px-3 py-1.5 text-sm rounded-lg transition-all duration-200 ${
              sortBy === "latest"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            🕐 최신순
          </button>
          <button
            onClick={() => setSortBy("likes")}
            className={`px-3 py-1.5 text-sm rounded-lg transition-all duration-200 ${
              sortBy === "likes"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            ❤️ 인기순
          </button>
        </div>
      </div>

      {/* 댓글 목록 */}
      {sortedComments && sortedComments.length > 0 ? (
        <div className="space-y-3">
          {sortedComments.map((comment, index) => (
            <div
              key={comment.id}
              className="animate-fadeIn"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CommentItem
                comment={comment}
                postId={postId}
                currentUserLikedCommentIds={currentUserLikedCommentIds}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-200">
          <div className="text-4xl mb-3">💭</div>
          <p className="text-gray-500 font-medium">아직 댓글이 없습니다</p>
          <p className="text-gray-400 text-sm mt-1">첫 댓글의 주인공이 되어보세요!</p>
        </div>
      )}
    </div>
  );
}
