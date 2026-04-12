import { getThreadBySlug } from '@/actions/thread.actions';
import { notFound } from 'next/navigation';
import { getPostsWithLikes } from '@/actions/post.actions';
import ThreadPageContent from '@/components/main/ThreadPageContent';

export default async function ThreadPage({
  params,
  searchParams,
}: {
  params: Promise<{ thread_slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { thread_slug } = await params;
  const { page: pageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr || '1', 10) || 1);

  const thread = await getThreadBySlug(thread_slug);
  if (!thread) notFound();

  const { posts, totalPages, currentPage } = await getPostsWithLikes(thread._id, page);

  return <ThreadPageContent thread={thread} posts={posts} totalPages={totalPages} currentPage={currentPage} />;
}
