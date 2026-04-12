'use client';
import { Link, Container, Typography, Box, Breadcrumbs, Button, Snackbar, Alert } from '@mui/material';
import PostItem from '@/components/main/PostItem';
import PostEditor from '@/components/main/PostEditor';
import { useSession } from 'next-auth/react';
import { createPost } from '@/actions/post.actions';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { toggleThreadLock, toggleThreadHide, deleteThread } from '@/actions/thread.actions';
import { useRouter } from 'next/navigation';
import Pagination from '@/components/main/Pagination';
import { useState } from 'react';
import { ThreadStatus, Role } from '@/lib/enums';

export default function ThreadPageContent({ thread, posts, totalPages, currentPage }: { thread: any, posts: any[], totalPages: number, currentPage: number }) {
  const { data: session } = useSession();
  const [threadStatus, setThreadStatus] = useState(thread.status);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' as 'error' | 'success' | 'info' });

  const router = useRouter();
  const role = session?.user?.role;
  const isModOrAdmin = role === Role.MODERATOR || role === Role.ADMIN;
  const isAdmin = role === Role.ADMIN;
  const isLocked = threadStatus === ThreadStatus.LOCKED;
  const isHidden = threadStatus === ThreadStatus.HIDDEN;
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const handleCreatePost = async (content: string) => {
    const result = await createPost({ thread_id: thread._id, content });
    if ((result as any)?.error) {
      setSnackbar({ open: true, message: (result as any).error, severity: 'error' });
    }
  };

  const handleToggleLock = async () => {
    const result = await toggleThreadLock(thread._id);
    if ((result as any)?.error) {
      setSnackbar({ open: true, message: (result as any).error, severity: 'error' });
    } else {
      setThreadStatus((result as any).status);
      setSnackbar({
        open: true,
        message: isLocked ? 'Đã mở khóa chủ đề.' : 'Đã khóa chủ đề.',
        severity: 'success',
      });
    }
  };

  const handleToggleHide = async () => {
    const result = await toggleThreadHide(thread._id);
    if ((result as any)?.error) {
      setSnackbar({ open: true, message: (result as any).error, severity: 'error' });
    } else {
      setThreadStatus((result as any).status);
      setSnackbar({
        open: true,
        message: isHidden ? 'Đã hiện chủ đề.' : 'Đã ẩn chủ đề.',
        severity: 'success',
      });
    }
  };

  const handleDeleteThread = async () => {
    setConfirmDeleteOpen(false);
    const result = await deleteThread(thread._id);
    if ((result as any)?.error) {
      setSnackbar({ open: true, message: (result as any).error, severity: 'error' });
    } else {
      if (thread.category_id) {
        router.push(`/categories/${thread.category_id.slug}`);
      } else {
        router.push(`/`);
      }
      router.refresh();
    }
  };

  return (
    <Container sx={{ py: 3 }}>
      <Breadcrumbs color="primary" sx={{ mb: 5 }}>
        <Link href="/" style={{ textDecoration: 'none' }}>Trang chủ</Link>
        {thread.category_id && (
          <Link href={`/categories/${thread.category_id.slug}`} style={{ textDecoration: 'none' }}>{thread.category_id.name}</Link>
        )}
        <Typography color="text.primary">{thread.slug}</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
        <Typography color="secondary" variant="h4" sx={{ fontWeight: 'bold' }}>
          {thread.title}
        </Typography>
        {isModOrAdmin && (
          <Button
            variant="outlined"
            size="small"
            color={isLocked ? 'success' : 'warning'}
            onClick={handleToggleLock}
          >
            {isLocked ? 'Mở khóa' : 'Khóa chủ đề'}
          </Button>
        )}
        {isAdmin && (
          <>
            <Button
              variant="outlined"
              size="small"
              color={isHidden ? 'success' : 'secondary'}
              onClick={handleToggleHide}
            >
              {isHidden ? 'Hiện chủ đề' : 'Ẩn chủ đề'}
            </Button>
            <Button
              variant="outlined"
              size="small"
              color="error"
              onClick={() => setConfirmDeleteOpen(true)}
            >
              Xóa (Admin)
            </Button>
          </>
        )}
      </Box>
      <Typography color="secondary" variant="subtitle1" sx={{ mb: 3 }}>{thread.author_id.username}</Typography>

      <Box>
        {posts.map((post) => (
          <PostItem key={post._id} post={post} />
        ))}
      </Box>
      <Pagination currentPage={currentPage} totalPages={totalPages} />

      {isLocked ? (
        <Typography sx={{ mt: 5, textAlign: 'center', color: 'text.secondary', fontStyle: 'italic' }}>
          Bài đăng này đã bị khóa bởi quản trị viên.
        </Typography>
      ) : session ? (
        <Box sx={{ mt: 5, p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Trả lời chủ đề</Typography>
          <PostEditor onSubmit={handleCreatePost} />
        </Box>
      ) : (
        <Typography sx={{ mt: 5, textAlign: 'center', color: 'text.secondary' }}>
          Vui lòng <Link href="/login">đăng nhập</Link> để trả lời chủ đề này.
        </Typography>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <ConfirmDialog
        open={confirmDeleteOpen}
        title="Xóa chủ đề"
        message="Hành động này sẽ XÓA VĨNH VIỄN chủ đề, toàn bộ bài đăng trong chủ đề, và các lượt thích tương ứng. Không thể hoàn tác. Bạn có chắc chắn?"
        confirmLabel="Tiến hành Xóa"
        onConfirm={handleDeleteThread}
        onCancel={() => setConfirmDeleteOpen(false)}
      />
    </Container>
  );
}
