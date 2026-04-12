'use client';

import { Box, Avatar, Typography, Button, IconButton, Snackbar, Alert } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import PostEditor from './PostEditor';
import { updatePost, deletePost } from '@/actions/post.actions';
import { toggleLike } from '@/actions/like.actions';
import { Role } from '@/lib/enums';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import 'ckeditor5/ckeditor5.css';

export default function PostItem({ post }: { post: any }) {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [isLiked, setIsLiked] = useState(post.userHasLiked || false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [isLiking, setIsLiking] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [confirmOpen, setConfirmOpen] = useState(false);

  const isModerator = session?.user?.role === Role.MODERATOR;

  const authorName = post.author_id?.username || 'Unknown User';
  const avatar = post.author_id?.avatar;
  const dateStr = post.created_at ? new Date(post.created_at).toLocaleString('vi-VN') : '';

  const isAuthor = session?.user?.id && post.author_id?._id && session.user.id === post.author_id._id.toString();

  const handleUpdate = async (content: string) => {
    await updatePost(post._id, { content });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    setConfirmOpen(false);
    await deletePost(post._id);
  };

  const handleLike = async () => {
    if (!session?.user?.id) {
       alert('Vui lòng đăng nhập để like bài viết!');
       return;
    }
    if (isLiking) return;
    setIsLiking(true);
    
    const currentlyLiked = isLiked;
    setIsLiked(!currentlyLiked);
    setLikesCount((prev: number) => currentlyLiked ? prev - 1 : prev + 1);
    
    try {
      await toggleLike(post._id);
    } catch (err) {
       setIsLiked(currentlyLiked);
       setLikesCount((prev: number) => currentlyLiked ? prev + 1 : prev - 1);
    } finally {
       setIsLiking(false);
    }
  };

  return (
    <>
      <Box sx={{ gap: 5, display: 'flex', border: '1px solid', borderColor: 'divider', p: 3, m: 3, borderRadius: 2 }}>
        <Box sx={{width: 120, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar src={avatar} alt={authorName} sx={{ width: 64, height: 64, mb: 1.5 }} />
          <Typography variant="subtitle1" color="secondary" sx={{ fontWeight: 'bold' }}>{authorName}</Typography>
          <Typography variant="subtitle2" color="secondary">{authorName}</Typography>
        </Box>

        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="caption" color="primary" sx={{ mb: 2, pb: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
            Đăng lúc: {dateStr}
          </Typography>
          
          {isEditing ? (
            <Box sx={{ mt: 2, mb: 2 }}>
              <PostEditor
                initialContent={post.content}
                onSubmit={handleUpdate}
                onCancel={() => setIsEditing(false)}
                buttonLabel="Cập nhật"
              />
            </Box>
          ) : (
            <Box 
              className="ck-content"
              sx={{ flexGrow: 1, lineHeight: 1.6, '& img': { maxWidth: '100%', height: 'auto' } }}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          )}

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {isAuthor && !isEditing && (
                <>
                  <Button size="small" variant="outlined" onClick={() => setIsEditing(true)}>Sửa</Button>
                  <Button size="small" variant="outlined" color="error" onClick={() => setConfirmOpen(true)}>Xóa</Button>
                </>
              )}
              {isModerator && !isAuthor && !isEditing && (
                <Button size="small" variant="outlined" color="error" onClick={() => setConfirmOpen(true)}>Xóa (Mod)</Button>
              )}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <IconButton onClick={handleLike} disabled={isLiking} size="small" color={isLiked ? 'primary' : 'inherit'}>
                <ThumbUpIcon fontSize="small" />
              </IconButton>
              <Typography variant="subtitle2" color="primary">
                {likesCount} lượt thích
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <ConfirmDialog
        open={confirmOpen}
        title="Xóa bài viết"
        message="Bạn có chắc chắn muốn xóa bài viết này không? Hành động này không thể hoàn tác."
        confirmLabel="Xóa"
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
