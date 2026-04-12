"use server"

import { notFound } from 'next/navigation';

import connectToDatabase from '@/lib/mongodb';
import Post from '@/models/Post';
import Like from '@/models/Like';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { UserStatus, Role } from '@/lib/enums';
import User from '@/models/User';

export async function getPosts(filter: any = {}) {
  await connectToDatabase();
  const posts = await Post.find(filter).sort({ created_at: -1 }).lean();
  return JSON.parse(JSON.stringify(posts));
}

export async function getPostsWithLikes(threadId: string, page = 1, limit = 10) {
  await connectToDatabase();
  const session = await auth();
  const skip = (page - 1) * limit;
  const total = await Post.countDocuments({ thread_id: threadId });

  const posts = await Post.find({ thread_id: threadId })
    .populate('author_id', 'username display_name avatar')
    .sort({ created_at: 1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const result = await Promise.all(posts.map(async (post) => {
    const likesCount = await Like.countDocuments({ post_id: post._id });
    let userHasLiked = false;
    if (session?.user?.id) {
       const userLike = await Like.findOne({ post_id: post._id, user_id: session.user.id });
       userHasLiked = !!userLike;
    }
    return { ...post, likesCount, userHasLiked };
  }));

  return {
    posts: JSON.parse(JSON.stringify(result)),
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  };
}

export async function getPostById(id: string) {
  await connectToDatabase();
  const post = await Post.findById(id).lean();
  return JSON.parse(JSON.stringify(post));
}

export async function createPost(data: any) {
  await connectToDatabase();
  const session = await auth();
  if (!session?.user?.id) notFound();

  const user = await User.findById(session.user.id).lean();
  if (!user || user.status === UserStatus.RESTRICTED) {
    return { error: 'Bạn đang bị hạn chế hoạt động' };
  }

  const postData = { ...data, author_id: session.user.id };
  const post = await Post.create(postData);
  revalidatePath('/threads/[thread_slug]', 'page');
  return JSON.parse(JSON.stringify(post));
}

export async function updatePost(id: string, data: any) {
  await connectToDatabase();
  const session = await auth();
  if (!session?.user?.id) notFound();

  const existingPost = await Post.findById(id);
  if (!existingPost) notFound();
  if (existingPost.author_id.toString() !== session.user.id) notFound();

  const post = await Post.findByIdAndUpdate(id, data, { returnDocument: 'after' }).lean();
  revalidatePath('/threads/[thread_slug]', 'page');
  return JSON.parse(JSON.stringify(post));
}

export async function deletePost(id: string) {
  await connectToDatabase();
  const session = await auth();
  if (!session?.user?.id) notFound();

  const existingPost = await Post.findById(id);
  if (!existingPost) notFound();
  
  const isAuthor = existingPost.author_id.toString() === session.user.id;
  const isModOrAdmin = session.user.role === Role.MODERATOR || session.user.role === Role.ADMIN;
  
  if (!isAuthor && !isModOrAdmin) notFound();

  await Post.findByIdAndDelete(id);
  revalidatePath('/threads/[thread_slug]', 'page');
  return { success: true };
}
