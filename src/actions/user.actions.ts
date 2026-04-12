"use server";

import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import Thread from "@/models/Thread";
import Post from "@/models/Post";
import Like from "@/models/Like";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { UserStatus, Role } from "@/lib/enums";

export async function getUsers(filter: any = {}) {
  await connectToDatabase();
  const users = await User.find(filter).lean();
  return JSON.parse(JSON.stringify(users));
}

export async function getUserById(id: string) {
  await connectToDatabase();
  const user = await User.findById(id).lean();
  return JSON.parse(JSON.stringify(user));
}

export async function getUserProfileByUsername(username: string) {
  await connectToDatabase();
  const user = (await User.findOne({ username }).lean()) as any;
  if (!user) return null;

  const threadsCount = await Thread.countDocuments({ author_id: user._id });

  const userPosts = await Post.find({ author_id: user._id }).lean();
  const postsCount = userPosts.length;

  const postIds = userPosts.map((p: any) => p._id);
  const likesCount = await Like.countDocuments({ post_id: { $in: postIds } });

  return JSON.parse(
    JSON.stringify({
      ...user,
      threadsCount,
      postsCount,
      likesCount,
    }),
  );
}

export async function updateProfile(data: any) {
  const session = await auth();
  if (!session?.user?.id)
    return { error: "Bạn cần đăng nhập để thực hiện thao tác này" };

  await connectToDatabase();

  const { display_name, bio, gender, phonenumber, avatar } = data;

  const updatedUser = await User.findByIdAndUpdate(
    session.user.id,
    { $set: { display_name, bio, gender, phonenumber, avatar } },
    { returnDocument: "after" },
  );

  if (updatedUser?.username) {
    revalidatePath(`/profile/${updatedUser.username}`);
  }

  return { success: true };
}

export async function changePassword(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Vui lòng đăng nhập" };
  }

  const oldPassword = formData.get("oldPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!newPassword || newPassword.length < 6) {
    return { error: "Mật khẩu phải có ít nhất 6 ký tự" };
  }
  if (newPassword !== confirmPassword) {
    return { error: "Mật khẩu nhập lại không khớp" };
  }

  await connectToDatabase();
  const user = await User.findById(session.user.id);
  if (!user) {
    return { error: "Không tìm thấy người dùng" };
  }

  if (user.password_hash !== "GOOGLE_OAUTH_NO_PASSWORD") {
    if (!oldPassword) {
      return { error: "Vui lòng nhập mật khẩu cũ" };
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password_hash);
    if (!isMatch) {
      return { error: "Mật khẩu cũ không chính xác" };
    }
  }

  const password_hash = await bcrypt.hash(newPassword, 10);
  user.password_hash = password_hash;
  await user.save();

  return { success: true };
}

export async function toggleRestrictUser(username: string) {
  await connectToDatabase();
  const session = await auth();
  const role = session?.user?.role;
  if (!session?.user?.id || (role !== Role.MODERATOR && role !== Role.ADMIN)) {
    return { error: "Bạn không có quyền thực hiện hành động này" };
  }

  const targetUser = await User.findOne({ username });
  if (!targetUser) return { error: "Không tìm thấy người dùng" };

  if (targetUser._id.toString() === session.user.id) {
    return { error: "Bạn không thể tự hạn chế chính mình" };
  }

  targetUser.status =
    targetUser.status === UserStatus.RESTRICTED
      ? UserStatus.ACTIVE
      : UserStatus.RESTRICTED;
  await targetUser.save();

  revalidatePath(`/profile/${username}`);
  return { success: true, status: targetUser.status };
}

export async function toggleBanUser(username: string) {
  await connectToDatabase();
  const session = await auth();
  if (!session?.user?.id || session.user.role !== Role.ADMIN) {
    return { error: "Bạn không có quyền thực hiện hành động này" };
  }

  const targetUser = await User.findOne({ username });
  if (!targetUser) return { error: "Không tìm thấy người dùng" };

  if (targetUser._id.toString() === session.user.id) {
    return { error: "Bạn không thể khóa chính mình" };
  }
  if (targetUser.role === Role.ADMIN) {
    return { error: "Bạn không thể khóa một Quản trị viên khác" };
  }

  targetUser.status =
    targetUser.status === UserStatus.BANNED
      ? UserStatus.ACTIVE
      : UserStatus.BANNED;
  await targetUser.save();

  revalidatePath(`/profile/${username}`);
  return { success: true, status: targetUser.status };
}

export async function getPaginatedUsers(
  query: string = "",
  page: number = 1,
  limit: number = 10,
) {
  await connectToDatabase();
  const session = await auth();
  if (!session?.user?.id || session.user.role !== Role.ADMIN) {
    return null;
  }

  const skip = (page - 1) * limit;
  let filter: any = {};

  if (query) {
    const regex = new RegExp(query, "i");
    filter = {
      $or: [{ username: regex }, { email: regex }, { display_name: regex }],
    };
  }

  const total = await User.countDocuments(filter);
  const users = await User.find(filter)
    .sort({ created_at: -1 })
    .skip(skip)
    .limit(limit)
    .select("-password_hash")
    .lean();

  return {
    users: JSON.parse(JSON.stringify(users)),
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  };
}

export async function updateUserRoleAdmin(userId: string, newRole: string) {
  await connectToDatabase();
  const session = await auth();
  if (!session?.user?.id || session.user.role !== Role.ADMIN) {
    return { error: "Bạn không có quyền thực hiện hành động này" };
  }

  if (newRole === Role.ADMIN) {
    return { error: "Không thể cấp quyền Quản trị viên qua giao diện này" };
  }

  const targetUser = await User.findById(userId);
  if (!targetUser) return { error: "Không tìm thấy người dùng" };

  if (targetUser.role === Role.ADMIN) {
    return { error: "Không thể thay đổi quyền của một Quản trị viên khác" };
  }

  targetUser.role = newRole;
  await targetUser.save();

  revalidatePath("/admin/users");
  return { success: true };
}

export async function updateUserStatusAdmin(userId: string, newStatus: string) {
  await connectToDatabase();
  const session = await auth();
  if (!session?.user?.id || session.user.role !== Role.ADMIN) {
    return { error: "Bạn không có quyền thực hiện hành động này" };
  }

  const targetUser = await User.findById(userId);
  if (!targetUser) return { error: "Không tìm thấy người dùng" };

  if (targetUser.role === Role.ADMIN && newStatus !== UserStatus.ACTIVE) {
    return { error: "Không thể khóa hoặc hạn chế một Quản trị viên" };
  }

  targetUser.status = newStatus;
  await targetUser.save();

  revalidatePath("/admin/users");
  return { success: true };
}
