'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Container from '@mui/material/Container';
import dynamic from 'next/dynamic';
import { createThread } from '@/actions/thread.actions';
import { getCategoryBySlug } from '@/actions/category.actions';
import { useSession } from 'next-auth/react';
import { notFound } from 'next/navigation';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { UserStatus } from '@/lib/enums';

const EditorContent = dynamic(() => import('@/components/main/EditorContent'), { ssr: false });

export default function CreateThreadPage({ params }: { params: Promise<{ category_slug: string }> }) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const { data: session, status } = useSession();

  const [category, setCategory] = useState<any>(null);
  const [loadingCategory, setLoadingCategory] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editorInstance, setEditorInstance] = useState<any>(null);
  const [isNotFound, setIsNotFound] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated' && session.user?.status === UserStatus.RESTRICTED) {
      setSnackbar({ open: true, message: 'Bạn đang bị hạn chế hoạt động' });
    }
  }, [status, session]);

  useEffect(() => {
    getCategoryBySlug(unwrappedParams.category_slug).then((cat) => {
      if (!cat) {
        setIsNotFound(true);
      } else {
        setCategory(cat);
      }
      setLoadingCategory(false);
    }).catch(() => {
      setIsNotFound(true);
    });
  }, [unwrappedParams.category_slug]);

  if (isNotFound) {
    notFound();
  }

  if (status === 'loading' || loadingCategory) {
    return (
      <Container sx={{ my: 5, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!session) return null;

  const isRestricted = session.user?.status === UserStatus.RESTRICTED;

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      setSnackbar({ open: true, message: 'Vui lòng nhập đầy đủ tiêu đề và nội dung bài viết!' });
      return;
    }

    if (editorInstance) {
      const pendingActions = editorInstance.plugins.get('PendingActions');
      if (pendingActions && pendingActions.hasAny) {
        setSnackbar({ open: true, message: 'Vui lòng đợi hình ảnh tải lên hoàn tất trước khi đăng bài!' });
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const result = await createThread({
        title: title.trim(),
        category_id: category._id,
        content: content.trim()
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
      notFound();
    }
  };

  return (
    <>
      <Container sx={{ my: 5 }}>
        <Breadcrumbs color="primary" sx={{ mb: 3 }}>
          <Link href="/" style={{ textDecoration: 'none' }}>Trang chủ</Link>
          <Link href={`/categories/${category.slug}`} style={{ textDecoration: 'none' }}>{category.name}</Link>
          <Typography color="text.primary">Tạo bài viết mới</Typography>
        </Breadcrumbs>

        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }} color="primary">
          Tạo bài viết trong {category.name}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 4 }}>
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
            <EditorContent content={content} onChange={setContent} onReady={setEditorInstance} />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
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
              disabled={isSubmitting || isRestricted || !title.trim() || !content.trim()}
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
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={isRestricted ? 'warning' : 'error'} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

