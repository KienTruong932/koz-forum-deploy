import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Role } from '@/lib/enums';
import { getSections, createSection, updateSection } from '@/actions/section.actions';
import { Container, Typography, Box, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import SectionAdminClient from '@/components/admin/SectionAdminClient';

export default async function AdminSectionsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== Role.ADMIN) redirect('/');

  const sections = await getSections();

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>Quản lý Khu vực</Typography>
      <SectionAdminClient sections={sections} />
    </Container>
  );
}
