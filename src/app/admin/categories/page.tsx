import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Role } from '@/lib/enums';
import { getCategories } from '@/actions/category.actions';
import { getSections } from '@/actions/section.actions';
import { Container, Typography } from '@mui/material';
import CategoryAdminClient from '@/components/admin/CategoryAdminClient';

export default async function AdminCategoriesPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== Role.ADMIN) redirect('/');

  const [categories, sections] = await Promise.all([getCategories(), getSections()]);

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>Quản lý Danh mục</Typography>
      <CategoryAdminClient categories={categories} sections={sections} />
    </Container>
  );
}
