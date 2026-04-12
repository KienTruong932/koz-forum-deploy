"use server"

import connectToDatabase from '@/lib/mongodb';
import Section from '@/models/Section';

export async function getSections() {
  await connectToDatabase();
  const sections = await Section.find({}).sort({ display_order: 1, created_at: -1 }).lean();
  return JSON.parse(JSON.stringify(sections));
}

import { revalidatePath } from 'next/cache';

export async function createSection(name: string) {
  await connectToDatabase();
  await Section.create({ name });
  revalidatePath('/admin/sections');
  revalidatePath('/');
}

export async function updateSection(id: string, name: string) {
  await connectToDatabase();
  await Section.findByIdAndUpdate(id, { name });
  revalidatePath('/admin/sections');
  revalidatePath('/');
}
