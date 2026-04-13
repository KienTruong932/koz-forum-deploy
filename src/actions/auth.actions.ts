"use server";

import { signIn, signOut } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { validatePhoneNumber, validateEmail } from "@/utils/validate";
import bcrypt from "bcryptjs";
import { getFormData } from "@/utils/format";

export async function register(formData: FormData) {
  const {
    username,
    email,
    password,
    passwordConfirm,
    gender,
    phonenumber,
    bio,
  } = getFormData(formData);

  const displayName = username;

  if (!email) return { success: false, error: "Email không được để trống" };
  if (!validateEmail(email))
    return {
      success: false,
      error: "Email không đúng định dạng example@email.com",
    };

  if (!username)
    return { success: false, error: "Tên người dùng không được để trống" };

  if (password.length < 6)
    return { success: false, error: "Mật khẩu phải có ít nhất 6 kí tự" };
  if (password !== passwordConfirm)
    return { success: false, error: "Mật khẩu nhập lại không khớp" };

  if (!validatePhoneNumber(phonenumber))
    return { success: false, error: "Số điện thoại không hợp lệ" };

  await connectToDatabase();

  const existedEmail = await User.findOne({ email });
  if (existedEmail) return { success: false, error: "Email đã tồn tại." };
  const existedUsername = await User.findOne({ username });
  if (existedUsername)
    return { success: false, error: "Tên người dùng đã tồn tại." };

  const password_hash = await bcrypt.hash(password, 10);
  await User.create({
    username,
    display_name: displayName,
    email,
    password_hash,
    gender: gender,
    phonenumber: phonenumber ? phonenumber : undefined,
    bio: bio ? bio : undefined,
  });
  return { success: true };
}

export async function login(formData: FormData) {
  try {
    const { username, password } = getFormData(formData);

    await signIn("credentials", { username, password, redirect: false });
    return { success: true };
  } catch (error: any) {
    const errorStr = String(error?.cause?.err?.message || error?.cause || error?.message || "");
    if (errorStr.includes("BANNED_USER")) {
      return { error: "Banned" };
    }
    if (
      error.type === "CredentialsSignin" ||
      error.type === "CallbackRouteError"
    )
      return { error: "Username hoặc mật khẩu không chính xác" };
    throw error;
  }
}

export async function loginWithGoogle() {
  await signIn("google");
}

export async function logout() {
  await signOut({ redirectTo: "/login" });
}
