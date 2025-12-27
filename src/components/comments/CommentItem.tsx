"use client";

import { createComment, deleteComment } from "@/app/_actions/comment";
import ReportForm from "@/components/common/ReportForm";
import { CommentFormValues } from "@/lib/validation/comment";
import { useAuth } from "@clerk/nextjs";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "react-hot-toast";
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

  // CommentLikeButton에 전달할 초기값
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
    if (data.image && data.image[0]) {
      formData.append("image", data.image[0]);
    }
    if (data.link_url) {
      formData.append("link_url", data.link_url);
    }
    formData.append("parent_comment_id", comment.id);

    try {
      await createComment(postId, formData);
      setShowReplyForm(false);
      toast.success("대댓글이 작성되었습니다.");
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "대댓글 작성에 실패했습니다.");
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
      className={`relative transition-all duration-200 ${
        isReply 
          ? "ml-6 pl-4 border-l-2 border-blue-200 hover:border-blue-400" 
          : "bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md"
      }`}
    >
      {/* 대댓글 연결선 장식 */}
      {isReply && (
        <div className="absolute -left-[9px] top-4 w-4 h-4 bg-blue-200 rounded-full border-2 border-white" />
      )}

      {/* 작성자 정보 및 액션 버튼 */}
      <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            isReply ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-600"
          }`}>
            {comment.user_id
              ? `User ${comment.user_id.substring(0, 6)}...`
              : "익명"}
          </span>
          <span className="text-gray-400">
            {format(new Date(comment.created_at), "MM.dd HH:mm")}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {/* 좋아요 버튼 */}
          <CommentLikeButton
            commentId={comment.id}
            postId={postId}
            initialLikes={initialLikes}
            initialHasLiked={initialHasLiked}
          />

          {/* 대댓글 버튼 (최상위 댓글에서만 표시) */}
          {!isReply && currentUserId && (
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className={`px-2 py-1 rounded text-xs transition-colors ${
                showReplyForm 
                  ? "bg-blue-100 text-blue-600" 
                  : "text-gray-500 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              💬 답글
            </button>
          )}

          <button
            onClick={() => setShowReportForm(true)}
            className="px-2 py-1 rounded text-xs text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            신고
          </button>

          {isOwner && (
            <button
              onClick={handleDeleteClick}
              className="px-2 py-1 rounded text-xs text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
              disabled={isDeleting}
            >
              삭제
            </button>
          )}
        </div>
      </div>

      {/* 댓글 내용 */}
      <p className={`whitespace-pre-wrap leading-relaxed ${
        isReply ? "text-gray-600 text-sm" : "text-gray-700"
      }`}>
        {comment.content}
      </p>

      {/* 이미지 표시 */}
      {comment.image_url && (
        <CommentImage src={comment.image_url} alt="Comment image" />
      )}

      {/* 링크 미리보기 */}
      {comment.link_preview && (
        <LinkPreview preview={comment.link_preview} linkUrl={comment.link_url || undefined} />
      )}

      {/* 링크만 있고 미리보기가 없는 경우 */}
      {comment.link_url && !comment.link_preview && (
        <SimpleLinkPreview url={comment.link_url} />
      )}

      {/* 대댓글 목록 */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
          <div className="text-xs text-gray-400 mb-2">
            💬 답글 {comment.replies.length}개
          </div>
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
        <div className="mt-4 pt-4 border-t border-gray-100">
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
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold mb-4">댓글 삭제 확인</h3>
            <p className="mb-4">정말로 이 댓글을 삭제하시겠습니까?</p>
            {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={handleCancelDelete}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
              >
                취소
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 disabled:opacity-50"
              >
                {isDeleting ? "삭제 중..." : "삭제 확인"}
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
