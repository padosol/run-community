'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ReportFormValues, reportSchema } from '@/lib/validation/report';
import { useState } from 'react';
import { createReport } from '@/app/_actions/report';

interface ReportFormProps {
  targetId: string;
  targetType: 'post' | 'comment';
  onClose: () => void; // Function to close the modal/form
  onSuccess: (message: string) => void; // Function to show success message
  onError: (message: string) => void; // Function to show error message
}

export default function ReportForm({
  targetId,
  targetType,
  onClose,
  onSuccess,
  onError,
}: ReportFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
  });

  const handleFormSubmit = async (data: ReportFormValues) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('reason', data.reason);
      const result = await createReport(targetId, targetType, formData);
      if (result.success) {
        onSuccess(result.message);
        onClose();
        reset();
      } else {
        onError(result.message || '신고 접수에 실패했습니다.');
      }
    } catch (e: any) {
      console.error('Error submitting report:', e);
      onError(e.message || '신고 접수 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
        <h3 className="text-lg font-bold mb-4">신고하기 ({targetType === 'post' ? '게시글' : '댓글'})</h3>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <label htmlFor="report_reason" className="sr-only">신고 사유</label>
            <textarea
              id="report_reason"
              {...register('reason')}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm p-2"
              placeholder="신고 사유를 입력해주세요."
            ></textarea>
            {errors.reason && (
              <p className="mt-2 text-sm text-red-600">{errors.reason.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
              disabled={isLoading}
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 disabled:opacity-50"
            >
              {isLoading ? '신고 접수 중...' : '신고하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
