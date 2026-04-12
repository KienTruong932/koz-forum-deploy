import { getCategoryBySlug } from '@/actions/category.actions';
import { notFound } from 'next/navigation';
import { getThreadsByCategory } from '@/actions/thread.actions';
import CategoryPageContent from '@/components/main/CategoryPageContent';

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category_slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { category_slug } = await params;
  const { page: pageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr || '1', 10) || 1);

  const category = await getCategoryBySlug(category_slug);
  if (!category) notFound();

  const { threads, totalPages, currentPage } = await getThreadsByCategory(category._id, page);
  return <CategoryPageContent category={category} threads={threads} totalPages={totalPages} currentPage={currentPage} />;
}
