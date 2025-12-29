'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PostFormValues, postSchema } from '@/lib/validation/post';
import { useState } from 'react';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import { DEFAULT_CATEGORY } from '@/lib/constants/category';
import CategorySelect from '@/components/common/CategorySelect';

interface PostFormProps {
  initialValues?: Partial<PostFormValues>;
  onSubmit: (data: PostFormValues) => void;
  isLoading?: boolean;
  submitButtonText?: string;
}

export default function PostForm({
  initialValues,
  onSubmit,
  isLoading = false,
  submitButtonText = '작성',
}: PostFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      ...initialValues,
      category: initialValues?.category || DEFAULT_CATEGORY,
    },
  });

  const [imagePreview, setImagePreview] = useState<string | null>(initialValues?.image instanceof File ? URL.createObjectURL(initialValues.image) : null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImagePreview(URL.createObjectURL(file));
      register('image').onChange(event);
    } else {
      setImagePreview(null);
    }
  };

  return (
    <>
      <SignedIn>
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
          {/* Category */}
          <div>
            <label className="block text-sm text-[#818384] mb-2">카테고리</label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <CategorySelect
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.category?.message}
                />
              )}
            />
          </div>

          {/* Title */}
          <div>
            <input
              id="title"
              type="text"
              {...register('title')}
              className="w-full bg-[#272729] border border-[#343536] rounded px-3 py-2 text-sm text-[#d7dadc] placeholder-[#818384] focus:outline-none focus:border-[#d7dadc]"
              placeholder="제목"
            />
            {errors.title && (
              <p className="mt-1 text-xs text-accent">{errors.title.message}</p>
            )}
          </div>

          {/* Content */}
          <div>
            <textarea
              id="content"
              {...register('content')}
              rows={8}
              className="w-full bg-[#272729] border border-[#343536] rounded px-3 py-2 text-sm text-[#d7dadc] placeholder-[#818384] focus:outline-none focus:border-[#d7dadc] resize-none"
              placeholder="내용을 입력하세요 (선택)"
            ></textarea>
            {errors.content && (
              <p className="mt-1 text-xs text-accent">{errors.content.message}</p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="flex items-center gap-2 text-sm text-[#818384] cursor-pointer hover:text-[#d7dadc] transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>이미지 첨부</span>
              <input
                id="image"
                type="file"
                accept="image/*"
                {...register('image')}
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            {errors.image && (
              <p className="mt-1 text-xs text-accent">{errors.image.message as string}</p>
            )}
            {imagePreview && (
              <div className="mt-3 relative inline-block">
                <img src={imagePreview} alt="미리보기" className="max-w-xs h-auto rounded border border-[#343536]" />
                <button
                  type="button"
                  onClick={() => setImagePreview(null)}
                  className="absolute -top-2 -right-2 w-6 h-6 btn-accent rounded-full flex items-center justify-center text-xs"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-[#343536]"></div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-accent px-4 py-1.5 text-sm rounded-full transition-colors"
            >
              {isLoading ? '처리 중...' : submitButtonText}
            </button>
          </div>
        </form>
      </SignedIn>
      <SignedOut>
        <div className="p-8 text-center">
          <p className="text-[#818384] mb-4">게시글을 작성하려면 로그인이 필요합니다.</p>
          <SignInButton mode="modal">
            <button className="btn-accent px-5 py-1.5 text-sm rounded-full transition-colors">
              로그인
            </button>
          </SignInButton>
        </div>
      </SignedOut>
    </>
  );
}
