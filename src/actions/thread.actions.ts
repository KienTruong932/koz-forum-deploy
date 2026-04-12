"use server";

import { notFound, redirect } from "next/navigation";

import connectToDatabase from "@/lib/mongodb";
import Thread from "@/models/Thread";
import Post from "@/models/Post";
import Like from "@/models/Like";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { ThreadStatus, UserStatus, Role } from "@/lib/enums";
import User from "@/models/User";

export async function getThreads(filter: any = {}) {
  await connectToDatabase();
  const threads = await Thread.find(filter)
    .sort({ is_pinned: -1, created_at: -1 })
    .lean();
  return JSON.parse(JSON.stringify(threads));
}

export async function getHotThreads(limit = 3) {
  await connectToDatabase();
  const threads = await Thread.find({ status: ThreadStatus.ACTIVE })
    .populate("author_id", "username")
    .populate("category_id", "name slug")
    .sort({ view_count: -1 })
    .limit(limit)
    .lean();
  return JSON.parse(JSON.stringify(threads));
}

export async function getRecentThreads(limit = 5) {
  await connectToDatabase();
  const threads = await Thread.find({ status: ThreadStatus.ACTIVE })
    .populate("author_id", "username")
    .populate("category_id", "name slug")
    .sort({ created_at: -1 })
    .limit(limit)
    .lean();
  return JSON.parse(JSON.stringify(threads));
}

export async function getThreadById(id: string) {
  await connectToDatabase();
  const thread = await Thread.findById(id).lean();
  return JSON.parse(JSON.stringify(thread));
}

export async function getThreadBySlug(slug: string) {
  await connectToDatabase();
  const thread = await Thread.findOneAndUpdate(
    { slug },
    { $inc: { view_count: 1 } },
    { returnDocument: "after" },
  )
    .populate("author_id", "username")
    .populate("category_id", "name slug")
    .lean();

  if (!thread) return null;
  return JSON.parse(JSON.stringify(thread));
}

export async function getThreadsByCategory(
  categoryId: string,
  page = 1,
  limit = 10,
) {
  await connectToDatabase();
  const session = await auth();
  const isAdminOrModerator =
    session?.user?.role === Role.ADMIN ||
    session?.user?.role === Role.MODERATOR;

  const filter: any = { category_id: categoryId };
  if (!isAdminOrModerator) {
    filter.status = { $ne: ThreadStatus.HIDDEN };
  }

  const skip = (page - 1) * limit;
  const total = await Thread.countDocuments(filter);
  const threads = await Thread.find(filter)
    .populate("author_id", "username")
    .sort({ created_at: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
  return {
    threads: JSON.parse(JSON.stringify(threads)),
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  };
}

export async function getUserLastThread(userId: string) {
  await connectToDatabase();
  const thread = await Thread.findOne({ author_id: userId })
    .sort({ created_at: -1 })
    .lean();
  return JSON.parse(JSON.stringify(thread));
}

export async function updateThread(id: string, data: any) {
  await connectToDatabase();

  data.slug = data.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  const thread = await Thread.findByIdAndUpdate(id, data, {
    returnDocument: "after",
  }).lean();
  revalidatePath("/");
  return JSON.parse(JSON.stringify(thread));
}

export async function createThread(data: any) {
  await connectToDatabase();  
  const session = await auth();
  if (!session?.user?.id) notFound();

  const user = await User.findById(session.user.id).lean();
  if (user.status === UserStatus.RESTRICTED) {
    return { error: "Bạn đang bị hạn chế hoạt động" };
  }

  const userLastThread = await Thread.findOne({
    author_id: session.user.id,
  }).sort({ created_at: -1 });

  if (userLastThread) {
    const lastThreadTime = Date.now() - userLastThread.created_at.getTime();
    const cooldown = 5 * 60 * 1000;
    if (lastThreadTime < cooldown) {
      const remainingTime = Math.ceil((cooldown - lastThreadTime) / 1000);
      return {
        error: `Bạn cần chờ ${remainingTime} giây nữa trước khi đăng bài viết mới`,
      };
    }
  }

  let slug = data.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  const existingThread = await Thread.findOne({ slug });
  if (existingThread) {
    slug = `${slug}-${Date.now()}`;
  }

  const thread = await Thread.create({
    title: data.title,
    slug,
    category_id: data.category_id,
    author_id: session.user.id,
  });

  await Post.create({
    thread_id: thread._id,
    author_id: session.user.id,
    content: data.content,
  });

  revalidatePath(`/categories/[category_slug]`);
  return JSON.parse(JSON.stringify(thread));
}

export async function toggleThreadLock(threadId: string) {
  await connectToDatabase();
  const session = await auth();
  const role = session?.user?.role;
  if (!session?.user || (role !== Role.MODERATOR && role !== Role.ADMIN)) {
    return { error: "Bạn không có quyền thực hiện hành động này" };
  }

  const thread = await Thread.findById(threadId);
  if (!thread) return { error: "Không tìm thấy chủ đề" };

  thread.status =
    thread.status === ThreadStatus.ACTIVE
      ? ThreadStatus.LOCKED
      : ThreadStatus.ACTIVE;
  await thread.save();

  revalidatePath(`/threads/[thread_slug]`);
  return { success: true, status: thread.status };
}

export async function toggleThreadHide(threadId: string) {
  await connectToDatabase();
  const session = await auth();
  if (!session?.user || session.user.role !== Role.ADMIN) {
    return { error: "Bạn không có quyền thực hiện hành động này" };
  }

  const thread = await Thread.findById(threadId);
  if (!thread) return { error: "Không tìm thấy chủ đề" };

  thread.status =
    thread.status === ThreadStatus.ACTIVE
      ? ThreadStatus.HIDDEN
      : ThreadStatus.ACTIVE;
  await thread.save();

  revalidatePath(`/threads/[thread_slug]`);
  return { success: true, status: thread.status };
}

export async function deleteThread(threadId: string) {
  await connectToDatabase();
  const session = await auth();
  if (!session?.user || session.user.role !== Role.ADMIN) {
    return { error: "Bạn không có quyền thực hiện hành động này" };
  }

  const thread = await Thread.findById(threadId);
  if (!thread) return { error: "Không tìm thấy chủ đề" };

  const posts = await Post.find({ thread_id: threadId });
  const postIds = posts.map((p) => p._id);

  await Like.deleteMany({ post_id: { $in: postIds } });
  await Post.deleteMany({ thread_id: threadId });
  await Thread.findByIdAndDelete(threadId);

  revalidatePath("/");
  revalidatePath("/categories/[category_slug]");
  return { success: true };
}
