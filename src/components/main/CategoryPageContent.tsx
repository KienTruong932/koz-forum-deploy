"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { Link, Container, Typography, Box, Button, Snackbar, Alert, Breadcrumbs } from "@mui/material";
import ThreadItem from "@/components/main/ThreadItem";
import Pagination from "@/components/main/Pagination";
import { UserStatus } from "@/lib/enums";
import { getUserLastThread } from "@/actions/thread.actions";

export default function CategoryPageContent({
  category,
  threads,
  totalPages,
  currentPage,
}: {
  category: any;
  threads: any[];
  totalPages: number;
  currentPage: number;
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  const handleCreateThread = async () => {
    const user = session?.user;
    if (!user) {
      router.push(`/login`)
      return;
    }

    if (user.status === UserStatus.RESTRICTED) {
      setSnackbar({ open: true, message: "Bạn đang bị hạn chế hoạt động" });
      return;
    }

    const userLastThread = await getUserLastThread(user.id);
    if (userLastThread) {
      const lastThreadTime = Date.now() - userLastThread.created_at.getTime();
      const cooldown = 5 * 60 * 1000;
      if (lastThreadTime < cooldown) {
        const remainingTime = Math.ceil((cooldown - lastThreadTime) / 1000);
        setSnackbar({
          open: true,
          message: `Bạn cần chờ ${remainingTime} giây nữa trước khi đăng bài viết mới`,
        });
        return;
      }
    }
    router.push(`/categories/${category.slug}/create`);
  };

  return (
    <>
      <Container sx={{ my: 5 }}>
        <Breadcrumbs color="primary" sx={{ mb: 3 }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            Trang chủ
          </Link>
          <Link
            href={`/categories/${category.slug}`}
            style={{ textDecoration: "none" }}
          >
            {category.name}
          </Link>
        </Breadcrumbs>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 4,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{ fontWeight: "bold" }}
              color="primary"
            >
              {category.name}
            </Typography>
            <Typography variant="subtitle1" color="secondary">
              {category.description}
            </Typography>
          </Box>
          <Button variant="contained" onClick={handleCreateThread}>
            Tạo bài viết mới
          </Button>
        </Box>

        <Box>
          {threads.map((thread) => (
            <ThreadItem key={thread._id} thread={thread} />
          ))}
        </Box>
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity="warning"
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
