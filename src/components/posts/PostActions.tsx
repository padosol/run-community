'use client';

import { useState } from 'react';
import Link from 'next/link';
import { deletePost } from '@/app/_actions/post'; // Server Action
import ReportForm from '@/components/common/ReportForm';
import { toast } from 'react-hot-toast';

interface PostActionsProps {
  postId: string;
  postUserId: string; // 게시글 작성자의 user_id
  currentUserId: string | null; // 현재 로그인한 사용자의 user_id
}

export default function PostActions({ postId, postUserId, currentUserId }: PostActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showReportForm, setShowReportForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // 현재 사용자가 게시글 작성자인지 확인
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
      // Call the server action directly (password 파라미터 제거됨)
      await deletePost(postId);
      // Server action will handle revalidatePath and redirect
      toast.success('게시글이 삭제되었습니다.');
    } catch (e: any) {
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
    <div className="flex justify-end space-x-2 border-t pt-4 mt-6">
      <button
        onClick={() => setShowReportForm(true)}
        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
      >
        신고
      </button>
      {isOwner && (
        <>
          <Link href={`/posts/${postId}/edit`} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors">
            수정
          </Link>
          <button
            onClick={handleDeleteClick}
            disabled={isDeleting}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition-colors"
          >
            {isDeleting ? '삭제 중...' : '삭제'}
          </button>
        </>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold mb-4">게시글 삭제 확인</h3>
            <p className="mb-4">정말로 이 게시글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</p>
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
                {isDeleting ? '삭제 중...' : '삭제 확인'}
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
