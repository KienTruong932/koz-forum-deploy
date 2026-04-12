import { globalSearch } from '@/actions/search.actions';
import SearchPageContent from '@/components/main/SearchPageContent';

export const dynamic = 'force-dynamic';

export default async function SearchPage(props: {
  searchParams: Promise<{ q: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams.q || '';
  const initialResults = await globalSearch(query);

  return <SearchPageContent initialResults={initialResults} query={query} />;
}
