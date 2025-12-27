'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PostFormValues, postSchema } from '@/lib/validation/post';
import { useState } from 'react';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';

interface PostFormProps {
  initialValues?: Partial<PostFormValues>; // For editing existing posts
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
    formState: { errors },
    reset,
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: initialValues,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(initialValues?.image instanceof File ? URL.createObjectURL(initialValues.image) : null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImagePreview(URL.createObjectURL(file));
      register('image').onChange(event); // Manually call onChange for react-hook-form
    } else {
      setImagePreview(null);
    }
  };


  return (
    <>
      <SignedIn>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              제목
            </label>
            <input
              id="title"
              type="text"
              {...register('title')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
              placeholder="게시글 제목을 입력하세요"
            />
            {errors.title && (
              <p className="mt-2 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              내용
            </label>
            <textarea
              id="content"
              {...register('content')}
              rows={10}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
            ></textarea>
            {errors.content && (
              <p className="mt-2 text-sm text-red-600">{errors.content.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
              이미지 (선택 사항)
            </label>
            <input
              id="image"
              type="file"
              accept="image/*"
              {...register('image')}
              onChange={handleImageChange}
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
            {errors.image && (
              <p className="mt-2 text-sm text-red-600">{errors.image.message as string}</p>
            )}
            {imagePreview && (
              <div className="mt-4">
                <img src={imagePreview} alt="Image Preview" className="max-w-xs h-auto rounded-md shadow-md" />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? '처리 중...' : submitButtonText}
          </button>
        </form>
      </SignedIn>
      <SignedOut>
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">게시글을 작성하려면 로그인이 필요합니다.</p>
          <SignInButton mode="modal">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
              로그인
            </button>
          </SignInButton>
        </div>
      </SignedOut>
    </>
  );
}
