"use server"

import { notFound } from 'next/navigation';
import { auth } from '@/lib/auth';

import connectToDatabase from '@/lib/mongodb';
import Like from '@/models/Like';
import { revalidatePath } from 'next/cache';

export async function getLikesHelper(filter: any = {}) {
  await connectToDatabase();
  const likes = await Like.find(filter).lean();
  return JSON.parse(JSON.stringify(likes));
}

export async function getLikesForPost(postId: string) {
  return getLikesHelper({ post_id: postId });
}

export async function toggleLike(postId: string) {
  await connectToDatabase();
  const session = await auth();
  if (!session?.user?.id) notFound();

  const existingLike = await Like.findOne({ user_id: session.user.id, post_id: postId });
  
  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id);
    return { action: 'unliked', success: true };
  }
  
  const newLike = await Like.create({ user_id: session.user.id, post_id: postId });
  return { action: 'liked', success: true };
}
