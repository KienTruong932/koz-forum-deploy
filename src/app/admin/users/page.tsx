import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { getPaginatedUsers } from "@/actions/user.actions";
import { Container } from "@mui/material";
import UserManagementTable from "@/components/admin/UserManagementTable";
import { Role } from "@/lib/enums";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function AdminUsersPage({ searchParams }: PageProps) {
  const session = await auth();

  if (!session?.user || session.user.role !== Role.ADMIN) {
    redirect("/");
  }

  const awaitedSearchParams = await searchParams;
  const page = parseInt((awaitedSearchParams.page as string) || "1", 10);
  const q = (awaitedSearchParams.q as string) || "";

  const result = await getPaginatedUsers(q, page, 10);

  if (!result) return notFound();

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <UserManagementTable
        users={result.users}
        totalPages={result.totalPages}
        currentPage={result.currentPage}
        query={q}
      />
    </Container>
  );
}
