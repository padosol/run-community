"use client";

import { CommentFormValues, commentSchema } from "@/lib/validation/comment";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface CommentFormProps {
  postId: string;
  onSubmit: (data: CommentFormValues) => Promise<void>;
  isLoading?: boolean;
  parentCommentId?: string | null; // 대댓글 작성 모드
  onCancel?: () => void; // 대댓글 작성 취소
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
    watch,
  } = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      parent_comment_id: parentCommentId || null,
    },
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFormSubmit = async (data: CommentFormValues) => {
    await onSubmit(data);
    reset(); // Clear form after successful submission
    setImagePreview(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  return (
    <>
      <SignedOut>
        <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-600 mb-3">
            댓글을 작성하려면 로그인이 필요합니다.
          </p>
          <SignInButton mode="modal">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm">
              로그인
            </button>
          </SignInButton>
        </div>
      </SignedOut>
      <SignedIn>
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-4 bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100"
        >
          {parentCommentId && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-2 text-sm text-blue-700">
              대댓글 작성 모드
            </div>
          )}
          <h3 className="text-lg font-semibold">
            {parentCommentId ? "대댓글 작성" : "댓글 작성"}
          </h3>

          <div>
            <label
              htmlFor="comment_content"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              내용
            </label>
            <textarea
              id="comment_content"
              {...register("content")}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
              placeholder="댓글 내용을 입력하세요"
            ></textarea>
            {errors.content && (
              <p className="mt-2 text-sm text-red-600">
                {errors.content.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="comment_image"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              이미지 (선택 사항)
            </label>
            <input
              id="comment_image"
              type="file"
              accept="image/*"
              {...register("image")}
              onChange={handleImageChange}
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
            {errors.image && (
              <p className="mt-2 text-sm text-red-600">
                {errors.image.message as string}
              </p>
            )}
            {imagePreview && (
              <div className="mt-4">
                <img
                  src={imagePreview}
                  alt="Image Preview"
                  className="max-w-xs h-auto rounded-md shadow-md"
                />
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="comment_link_url"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              링크 URL (선택 사항)
            </label>
            <input
              id="comment_link_url"
              type="url"
              {...register("link_url")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
              placeholder="https://example.com"
            />
            {errors.link_url && (
              <p className="mt-2 text-sm text-red-600">
                {errors.link_url.message}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            {parentCommentId && onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                취소
              </button>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading
                ? "작성 중..."
                : parentCommentId
                ? "대댓글 작성"
                : "댓글 작성"}
            </button>
          </div>
        </form>
      </SignedIn>
    </>
  );
}
