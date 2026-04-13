import { getCategoryBySlug } from "@/actions/category.actions";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import CreateThreadForm from "@/components/main/CreateThreadForm";

export default async function CreateThreadPage(props: {
  params: Promise<{ category_slug: string }>;
}) {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const { category_slug } = await props.params;
  const category = await getCategoryBySlug(category_slug);

  if (!category) {
    notFound();
  }

  return <CreateThreadForm category={category} />;
}
