"use client";

import { createComment, deleteComment } from "@/app/_actions/comment";
import ReportForm from "@/components/common/ReportForm";
import { CommentFormValues } from "@/lib/validation/comment";
import { useAuth } from "@clerk/nextjs";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import CommentForm from "./CommentForm";
import CommentImage from "./CommentImage";
import LinkPreview, { SimpleLinkPreview } from "./LinkPreview";
import CommentLikeButton from "./CommentLikeButton";

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
  replies?: Comment[];
  commenter?: {
    nickname: string;
    avatar_url?: string | null;
  } | null;
}

interface CommentItemProps {
  comment: Comment;
  postId: string;
  isReply?: boolean;
  currentUserLikedCommentIds?: string[];
}

export default function CommentItem({
  comment,
  postId,
  isReply = false,
  currentUserLikedCommentIds = [],
}: CommentItemProps) {
  const { userId: currentUserId } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showReportForm, setShowReportForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isLoadingReply, setIsLoadingReply] = useState(false);

  const initialLikes = comment.likes;
  const initialHasLiked = currentUserLikedCommentIds.includes(comment.id);
  const isOwner = currentUserId === comment.user_id;

  const handleDeleteClick = () => {
    if (!isOwner) {
      toast.error("댓글을 삭제할 권한이 없습니다.");
      return;
    }
    setShowDeleteConfirm(true);
    setError(null);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      await deleteComment(comment.id, postId);
      toast.success("댓글이 삭제되었습니다.");
    } catch (e: any) {
      if (isRedirectError(e)) {
        throw e;
      }
      console.error("Error deleting comment:", e);
      setError(e.message || "댓글 삭제에 실패했습니다.");
      toast.error(e.message || "댓글 삭제에 실패했습니다.");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setError(null);
  };

  const handleReplySubmit = async (data: CommentFormValues) => {
    setIsLoadingReply(true);
    const formData = new FormData();
    formData.append("content", data.content);
    formData.append("parent_comment_id", comment.id);

    try {
      await createComment(postId, formData);
      setShowReplyForm(false);
      toast.success("답글이 작성되었습니다.");
    } catch (e: any) {
      if (isRedirectError(e)) {
        throw e;
      }
      console.error(e);
      toast.error(e.message || "답글 작성에 실패했습니다.");
    } finally {
      setIsLoadingReply(false);
    }
  };

  const handleReportSuccess = (message: string) => {
    toast.success(message);
    setShowReportForm(false);
  };

  const handleReportError = (message: string) => {
    toast.error(message);
  };

  return (
    <div
      className={`relative ${
        isReply 
          ? "ml-3 pl-2 border-l-2 border-[#343536]" 
          : "p-2 bg-[#1a1a1b] rounded border border-[#343536] hover:border-[#818384] transition-colors"
      }`}
    >
      {/* 작성자 정보 및 액션 버튼 */}
      <div className="flex justify-between items-center text-xs mb-2">
        <div className="flex items-center gap-2 text-[#818384]">
          <span className="text-[#d7dadc]">
            u/{comment.commenter?.nickname || (comment.user_id ? `User_${comment.user_id.substring(5, 11)}` : "익명")}
          </span>
          <span>•</span>
          <span>
            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: ko })}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <CommentLikeButton
            commentId={comment.id}
            postId={postId}
            initialLikes={initialLikes}
            initialHasLiked={initialHasLiked}
          />

          {!isReply && currentUserId && (
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className={`action-button text-xs ${showReplyForm ? "text-accent" : ""}`}
            >
              답글
            </button>
          )}

          <button
            onClick={() => setShowReportForm(true)}
            className="action-button text-xs"
          >
            신고
          </button>

          {isOwner && (
            <button
              onClick={handleDeleteClick}
              className="action-button text-xs hover:text-red-500"
              disabled={isDeleting}
            >
              삭제
            </button>
          )}
        </div>
      </div>

      {/* 댓글 내용 */}
      <p className="text-[#d7dadc] text-sm whitespace-pre-wrap leading-relaxed">
        {comment.content}
      </p>

      {/* 이미지 표시 */}
      {comment.image_url && (
        <div className="mt-2">
          <CommentImage src={comment.image_url} alt="Comment image" />
        </div>
      )}

      {/* 링크 미리보기 */}
      {comment.link_preview && (
        <div className="mt-2">
          <LinkPreview preview={comment.link_preview} linkUrl={comment.link_url || undefined} />
        </div>
      )}

      {comment.link_url && !comment.link_preview && (
        <div className="mt-2">
          <SimpleLinkPreview url={comment.link_url} />
        </div>
      )}

      {/* 대댓글 목록 */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2 space-y-2">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              isReply={true}
              currentUserLikedCommentIds={currentUserLikedCommentIds}
            />
          ))}
        </div>
      )}

      {/* 대댓글 작성 폼 */}
      {showReplyForm && (
        <div className="mt-2 pt-2 border-t border-[#343536]">
          <CommentForm
            postId={postId}
            onSubmit={handleReplySubmit}
            isLoading={isLoadingReply}
            parentCommentId={comment.id}
            onCancel={() => setShowReplyForm(false)}
          />
        </div>
      )}

      {/* 삭제 확인 모달 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center p-4 z-50">
          <div className="bg-[#1a1a1b] border border-[#343536] rounded-lg p-4 w-full max-w-xs">
            <h3 className="text-sm font-bold text-[#d7dadc] mb-2">댓글 삭제</h3>
            <p className="text-[#818384] text-xs mb-3">정말로 이 댓글을 삭제하시겠습니까?</p>
            {error && <p className="text-accent text-xs mb-2">{error}</p>}
            <div className="flex justify-end gap-2">
              <button
                onClick={handleCancelDelete}
                className="px-3 py-1.5 text-xs text-[#d7dadc] bg-[#272729] rounded hover:bg-[#343536] transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-3 py-1.5 text-xs text-white bg-red-600 rounded hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isDeleting ? "..." : "삭제"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 신고 폼 */}
      {showReportForm && (
        <ReportForm
          targetId={comment.id}
          targetType="comment"
          onClose={() => setShowReportForm(false)}
          onSuccess={handleReportSuccess}
          onError={handleReportError}
        />
      )}
    </div>
  );
}
