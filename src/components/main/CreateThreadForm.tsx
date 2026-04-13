'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Link as MuiLink,
  Container,
  Breadcrumbs,
  Typography,
  CircularProgress,
  Button,
  TextField,
} from "@mui/material";
import NextLink from "next/link";
import dynamic from "next/dynamic";
import { createThread } from "@/actions/thread.actions";
import { useSession } from "next-auth/react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { UserStatus } from "@/lib/enums";

const EditorContent = dynamic(() => import("@/components/main/EditorContent"), {
  ssr: false,
});

export default function CreateThreadForm({ category }: { category: any }) {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editorInstance, setEditorInstance] = useState<any>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  useEffect(() => {
    if (
      status === "authenticated" &&
      session.user?.status === UserStatus.RESTRICTED
    ) {
      setSnackbar({ open: true, message: "Bạn đang bị hạn chế hoạt động" });
    }
  }, [status, session]);

  if (status === "loading") {
    return (
      <Container sx={{ my: 5, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!session) return null;

  const isRestricted = session.user?.status === UserStatus.RESTRICTED;

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      setSnackbar({
        open: true,
        message: "Vui lòng nhập đầy đủ tiêu đề và nội dung bài viết!",
      });
      return;
    }

    if (editorInstance) {
      const pendingActions = editorInstance.plugins.get("PendingActions");
      if (pendingActions && pendingActions.hasAny) {
        setSnackbar({
          open: true,
          message: "Vui lòng đợi hình ảnh tải lên hoàn tất trước khi đăng bài!",
        });
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const result = await createThread({
        title: title.trim(),
        category_id: category._id,
        content: content.trim(),
      });

      if ((result as any)?.error) {
        setSnackbar({ open: true, message: (result as any).error });
        setIsSubmitting(false);
        return;
      }

      router.push(`/threads/${(result as any).slug}`);
      router.refresh();
    } catch (error: any) {
      console.error(error);
      setSnackbar({ open: true, message: "Đã xảy ra lỗi hệ thống!" });
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Container sx={{ my: 5 }}>
        <Breadcrumbs color="primary" sx={{ mb: 3 }}>
          <MuiLink
            component={NextLink}
            href="/"
            style={{ textDecoration: "none" }}
          >
            Trang chủ
          </MuiLink>
          <MuiLink
            component={NextLink}
            href={`/categories/${category.slug}`}
            style={{ textDecoration: "none" }}
          >
            {category.name}
          </MuiLink>
          <Typography color="text.primary">Tạo bài viết mới</Typography>
        </Breadcrumbs>

        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontWeight: "bold" }}
          color="primary"
        >
          Tạo bài viết trong {category.name}
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 4 }}>
          <TextField
            label="Tiêu đề bài viết"
            variant="outlined"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <Box>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
              Nội dung bài viết
            </Typography>
            <EditorContent
              content={content}
              onChange={setContent}
              onReady={setEditorInstance}
            />
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={
                isSubmitting || isRestricted || !title.trim() || !content.trim()
              }
              startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
            >
              Đăng bài viết
            </Button>
          </Box>
        </Box>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={isRestricted ? "warning" : "error"}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
