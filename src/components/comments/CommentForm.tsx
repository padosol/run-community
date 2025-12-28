"use client";

import { CommentFormValues, commentSchema } from "@/lib/validation/comment";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface CommentFormProps {
  postId: string;
  onSubmit: (data: CommentFormValues) => Promise<void>;
  isLoading?: boolean;
  parentCommentId?: string | null;
  onCancel?: () => void;
}

export default function CommentForm({
  postId,
  onSubmit,
  isLoading = false,
  parentCommentId = null,
  onCancel,
}: CommentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      parent_comment_id: parentCommentId || null,
    },
  });

  const handleFormSubmit = async (data: CommentFormValues) => {
    await onSubmit(data);
    reset();
  };

  return (
    <>
      <SignedOut>
        <div className="flex items-center justify-between p-2 bg-[#272729] rounded border border-[#343536]">
          <span className="text-xs text-[#818384]">댓글을 작성하려면 로그인하세요</span>
          <SignInButton mode="modal">
            <button className="btn-accent px-3 py-1 text-xs rounded-full">
              로그인
            </button>
          </SignInButton>
        </div>
      </SignedOut>
      <SignedIn>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          {parentCommentId && (
            <div className="text-xs text-[#818384] mb-2">
              답글 작성 중...
            </div>
          )}
          <div className="flex gap-2 items-center">
            <input
              type="text"
              {...register("content")}
              className="flex-1 bg-[#272729] border border-[#343536] rounded px-3 h-7 text-sm text-[#d7dadc] placeholder-[#818384] focus:outline-none focus:border-[#d7dadc]"
              placeholder={parentCommentId ? "답글을 입력하세요..." : "댓글을 입력하세요..."}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="btn-accent px-3 h-7 text-xs rounded transition-colors"
            >
              {isLoading ? "..." : parentCommentId ? "답글" : "작성"}
            </button>
            {parentCommentId && onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-2 h-7 text-xs text-[#818384] hover:text-[#d7dadc] transition-colors"
              >
                취소
              </button>
            )}
          </div>
          {errors.content && (
            <p className="mt-1 text-xs text-accent">{errors.content.message}</p>
          )}
        </form>
      </SignedIn>
    </>
  );
}
