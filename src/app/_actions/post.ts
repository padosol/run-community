"use server";

import { createClient as createServerClient } from "@/lib/supabase/server";
import { postSchema, postUpdateSchema } from "@/lib/validation/post";
import { auth } from "@clerk/nextjs/server";
import { ensureUserExists } from "@/lib/clerk/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Helper function for image upload
async function uploadImage(imageFile: File | null): Promise<string | null> {
  if (!imageFile || imageFile.size === 0) {
    return null;
  }

  const supabase = await createServerClient();
  const fileExtension = imageFile.name.split(".").pop();
  const filePath = `${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 15)}.${fileExtension}`;

  const { data, error } = await supabase.storage
    .from("post_images") // Assuming a bucket named 'post_images'
    .upload(filePath, imageFile, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Error uploading image:", error);
    throw new Error("이미지 업로드에 실패했습니다.");
  }
  return supabase.storage.from("post_images").getPublicUrl(filePath).data
    .publicUrl;
}

// Helper function to delete image from storage
async function deleteImage(imageUrl: string | null) {
  if (!imageUrl) return;
  const supabase = await createServerClient();
  const fileName = imageUrl.split("/").pop();
  if (fileName) {
    const { error } = await supabase.storage
      .from("post_images")
      .remove([fileName]);
    if (error) {
      console.error("Error deleting old image:", error);
      // Don't throw, just log for now as it shouldn't block the main operation
    }
  }
}

export async function createPost(formData: FormData) {
  // Clerk 인증 확인
  const { userId } = await auth();
  if (!userId) {
    throw new Error("로그인이 필요합니다.");
  }

  // 사용자가 users 테이블에 있는지 확인 (외래키 제약 조건 대비)
  await ensureUserExists(userId);

  const supabase = await createServerClient();

  const rawFormData = {
    title: formData.get("title"),
    content: formData.get("content"),
    image: formData.get("image"),
  };

  // Validate form data
  const validatedFields = postSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    console.error(
      "Validation errors:",
      validatedFields.error.flatten().fieldErrors
    );
    throw new Error("입력 값이 올바르지 않습니다.");
  }

  const { title, content, image } = validatedFields.data;

  let imageUrl: string | null = null;
  if (image instanceof File && image.size > 0) {
    imageUrl = await uploadImage(image);
  }

  const { error } = await supabase.from("posts").insert({
    user_id: userId,
    title,
    content,
    image_url: imageUrl,
    // 레거시 컬럼 - 마이그레이션 적용 후 제거 가능
    author_nickname: '',
    password_hash: '',
  });

  if (error) {
    console.error("Error creating post:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
    throw new Error(`게시글 작성에 실패했습니다: ${error.message || error.code || 'Unknown error'}`);
  }

  revalidatePath("/"); // Revalidate home page to show new post
  redirect("/"); // Redirect to home page
}

export async function updatePost(postId: string, formData: FormData) {
  // Clerk 인증 확인
  const { userId } = await auth();
  if (!userId) {
    throw new Error("로그인이 필요합니다.");
  }

  const supabase = await createServerClient();

  const rawFormData = {
    title: formData.get("title"),
    content: formData.get("content"),
    image: formData.get("image"), // This will be the File object or null
    image_clear_signal: formData.get("image_clear_signal") === "true", // Check if signal is present
  };

  // Validate form data
  const validatedFields = postUpdateSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    console.error(
      "Validation errors:",
      validatedFields.error.flatten().fieldErrors
    );
    throw new Error("입력 값이 올바르지 않습니다.");
  }

  const { title, content, image } = validatedFields.data; // image here might be a File or null
  const image_clear_signal = rawFormData.image_clear_signal;

  // 권한 확인: 게시글 작성자만 수정 가능
  const { data: existingPost, error: fetchError } = await supabase
    .from("posts")
    .select("user_id, image_url")
    .eq("id", postId)
    .single();

  if (fetchError || !existingPost) {
    console.error("Error fetching post for update:", fetchError);
    throw new Error("게시글을 찾을 수 없습니다.");
  }

  if (existingPost.user_id !== userId) {
    throw new Error("게시글을 수정할 권한이 없습니다.");
  }

  let imageUrl: string | null = existingPost.image_url;

  if (image_clear_signal && existingPost.image_url) {
    // User explicitly cleared image via signal
    await deleteImage(existingPost.image_url);
    imageUrl = null;
  } else if (image instanceof File && image.size > 0) {
    // New image provided, delete old one and upload new
    await deleteImage(existingPost.image_url);
    imageUrl = await uploadImage(image);
  }
  // Otherwise, if no new image and no clear signal, imageUrl remains existingPost.image_url (no change)

  // Update data object (only include fields that are provided)
  const updateData: {
    title?: string;
    content?: string;
    image_url: string | null;
  } = {
    image_url: imageUrl,
  };

  if (title !== undefined) {
    updateData.title = title;
  }
  if (content !== undefined) {
    updateData.content = content;
  }

  const { error } = await supabase
    .from("posts")
    .update(updateData)
    .eq("id", postId);

  if (error) {
    console.error("Error updating post:", error);
    throw new Error("게시글 수정에 실패했습니다.");
  }

  revalidatePath(`/posts/${postId}`); // Revalidate individual post page
  redirect(`/posts/${postId}`); // Redirect to post detail page
}

export async function deletePost(postId: string) {
  // Clerk 인증 확인
  const { userId } = await auth();
  if (!userId) {
    throw new Error("로그인이 필요합니다.");
  }

  const supabase = await createServerClient();

  // 권한 확인: 게시글 작성자만 삭제 가능
  const { data: existingPost, error: fetchError } = await supabase
    .from("posts")
    .select("user_id, image_url")
    .eq("id", postId)
    .single();

  if (fetchError || !existingPost) {
    console.error("Error fetching post for delete:", fetchError);
    throw new Error("게시글을 찾을 수 없습니다.");
  }

  if (existingPost.user_id !== userId) {
    throw new Error("게시글을 삭제할 권한이 없습니다.");
  }

  // Delete associated image from storage
  await deleteImage(existingPost.image_url);

  const { error } = await supabase.from("posts").delete().eq("id", postId);

  if (error) {
    console.error("Error deleting post:", error);
    throw new Error("게시글 삭제에 실패했습니다.");
  }

  revalidatePath("/"); // Revalidate home page
  redirect("/"); // Redirect to home page
}

export async function getPosts(page = 1, limit = 10) {
  const supabase = await createServerClient();
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // 먼저 users 테이블 JOIN 시도
  let { data: posts, error } = await supabase
    .from('posts')
    .select(`
      id, 
      created_at, 
      user_id, 
      title, 
      content, 
      likes, 
      upvotes, 
      downvotes, 
      views,
      users!fk_posts_user(username, avatar_url)
    `)
    .order('created_at', { ascending: false })
    .range(from, to);

  // users 테이블이 없거나 외래키가 없으면 기본 쿼리로 fallback
  if (error) {
    console.log('Falling back to basic query (users table not ready):', error.message);
    const fallbackResult = await supabase
      .from('posts')
      .select('id, created_at, user_id, title, content, likes, upvotes, downvotes, views')
      .order('created_at', { ascending: false })
      .range(from, to);
    
    if (fallbackResult.error) {
      console.error('Error fetching posts:', fallbackResult.error);
      throw new Error('게시글을 불러오는 데 실패했습니다.');
    }
    
    posts = fallbackResult.data;
  }

  // users 테이블 연결이 안되어 있을 경우를 대비한 fallback
  return (posts || []).map(post => ({
    ...post,
    author_username: (post as any).users?.username || `User_${post.user_id?.substring(5, 11) || 'Unknown'}`,
    author_avatar: (post as any).users?.avatar_url || null,
  }));
}

// username 조회 헬퍼 함수
export async function getUsername(userId: string): Promise<string> {
  const supabase = await createServerClient();
  
  const { data, error } = await supabase
    .from('users')
    .select('username')
    .eq('clerk_user_id', userId)
    .single();

  if (error || !data) {
    return `User_${userId.substring(5, 11)}`;
  }

  return data.username;
}