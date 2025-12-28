'use client';

import { useState } from 'react';
import Link from 'next/link';
import { deletePost } from '@/app/_actions/post';
import ReportForm from '@/components/common/ReportForm';
import { toast } from 'react-hot-toast';
import { isRedirectError } from 'next/dist/client/components/redirect-error';

interface PostActionsProps {
  postId: string;
  postUserId: string;
  currentUserId: string | null;
}

export default function PostActions({ postId, postUserId, currentUserId }: PostActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showReportForm, setShowReportForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isOwner = currentUserId === postUserId;

  const handleDeleteClick = () => {
    if (!isOwner) {
      toast.error('게시글을 삭제할 권한이 없습니다.');
      return;
    }
    setShowDeleteConfirm(true);
    setError(null);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      await deletePost(postId);
      toast.success('게시글이 삭제되었습니다.');
    } catch (e: any) {
      if (isRedirectError(e)) {
        throw e;
      }
      console.error('Error deleting post:', e);
      setError(e.message || '게시글 삭제에 실패했습니다.');
      toast.error(e.message || '게시글 삭제에 실패했습니다.');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setError(null);
  };

  const handleReportSuccess = (message: string) => {
    toast.success(message);
    setShowReportForm(false);
  };

  const handleReportError = (message: string) => {
    toast.error(message);
  };

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => setShowReportForm(true)}
        className="action-button text-xs"
      >
        신고
      </button>
      {isOwner && (
        <>
          <Link href={`/posts/${postId}/edit`} className="action-button text-xs">
            수정
          </Link>
          <button
            onClick={handleDeleteClick}
            disabled={isDeleting}
            className="action-button text-xs hover:text-red-500"
          >
            {isDeleting ? '...' : '삭제'}
          </button>
        </>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center p-4 z-50">
          <div className="bg-[#1a1a1b] border border-[#343536] rounded-lg p-4 w-full max-w-xs">
            <h3 className="text-sm font-bold text-[#d7dadc] mb-2">게시글 삭제</h3>
            <p className="text-[#818384] text-xs mb-3">정말로 삭제하시겠습니까?</p>
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
                {isDeleting ? '...' : '삭제'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showReportForm && (
        <ReportForm
          targetId={postId}
          targetType="post"
          onClose={() => setShowReportForm(false)}
          onSuccess={handleReportSuccess}
          onError={handleReportError}
        />
      )}
    </div>
  );
}
