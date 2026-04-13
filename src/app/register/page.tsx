import { Metadata } from "next";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Đăng ký | KOZ Forum",
  description: "Tạo danh tính mới trên diễn đàn KOZ và bắt đầu hành trình của bạn ngay hôm nay.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}