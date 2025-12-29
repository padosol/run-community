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
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center p-4 z-50">
      <div className="bg-[#1a1a1b] border border-[#343536] rounded-lg p-6 w-full max-w-sm">
        <h3 className="text-lg font-bold mb-4 text-[#d7dadc]">
          신고하기 ({targetType === 'post' ? '게시글' : '댓글'})
        </h3>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <label htmlFor="report_reason" className="sr-only">신고 사유</label>
            <textarea
              id="report_reason"
              {...register('reason')}
              rows={4}
              className="w-full bg-[#272729] border border-[#343536] rounded px-3 py-2 text-sm text-[#d7dadc] placeholder-[#818384] focus:outline-none focus:border-[#d7dadc] resize-none"
              placeholder="신고 사유를 입력해주세요."
            ></textarea>
            {errors.reason && (
              <p className="mt-2 text-xs text-accent">{errors.reason.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-[#d7dadc] bg-[#272729] rounded hover:bg-[#343536] transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-3 py-1.5 text-xs text-white bg-red-700 rounded hover:bg-red-800 transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              {isLoading ? '신고 접수 중...' : '신고하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
