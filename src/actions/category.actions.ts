"use server";

import connectToDatabase from "@/lib/mongodb";
import Category from "@/models/Category";
import { revalidatePath } from "next/cache";

export async function getCategories() {
  await connectToDatabase();
  const categories = await Category.find({})
    .sort({ display_order: 1, created_at: -1 })
    .lean();
  return JSON.parse(JSON.stringify(categories));
}

export async function getCategoryBySlug(slug: string) {
  await connectToDatabase();
  const category = await Category.findOne({ slug }).lean();
  return JSON.parse(JSON.stringify(category));
}

export async function getCategoryById(id: string) {
  await connectToDatabase();
  const category = await Category.findById(id).lean();
  return JSON.parse(JSON.stringify(category));
}

export async function getCategoriesBySectionId(sectionId: string | null) {
  await connectToDatabase();
  const filter = sectionId ? { section_id: sectionId } : { section_id: null };
  const categories = await Category.find(filter)
    .sort({ display_order: 1, created_at: -1 })
    .lean();
  return JSON.parse(JSON.stringify(categories));
}

export async function createCategory(data: any) {
  await connectToDatabase();
  let { name, slug, ...rest } = data;

  slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  const category = await Category.create({ name, slug, ...rest });
  revalidatePath("/");
  return JSON.parse(JSON.stringify(category));
}

export async function updateCategory(id: string, data: any) {
  await connectToDatabase();
  data.slug = data.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  const category = await Category.findByIdAndUpdate(id, data, {
    returnDocument: "after",
  }).lean();
  revalidatePath("/");
  return JSON.parse(JSON.stringify(category));
}

export async function deleteCategory(id: string) {
  await connectToDatabase();
  await Category.findByIdAndDelete(id);
  revalidatePath("/");
  return { success: true };
}
