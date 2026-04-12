'use client';

import React, { useState } from 'react';
import { Button, Box, CircularProgress, Snackbar, Alert } from '@mui/material';
import dynamic from 'next/dynamic';

const EditorContent = dynamic(() => import('./EditorContent'), { ssr: false });

interface PostEditorProps {
  initialContent?: string;
  onSubmit: (content: string) => Promise<void>;
  onCancel?: () => void;
  buttonLabel?: string;
}

export default function PostEditor({ initialContent = '', onSubmit, onCancel, buttonLabel = 'Đăng' }: PostEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editorInstance, setEditorInstance] = useState<any>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  const handleSubmit = async () => {
    if (!content.trim()) return;

    if (editorInstance) {
      const pendingActions = editorInstance.plugins.get('PendingActions');
      if (pendingActions && pendingActions.hasAny) {
        setSnackbar({ open: true, message: 'Vui lòng đợi hình ảnh tải lên hoàn tất trước khi xử lý!' });
        return;
      }
    }

    setIsSubmitting(true);
    try {
      await onSubmit(content);
      if (!onCancel) {
        setContent('');
      }
    } catch (error) {
      console.error(error);
      setSnackbar({ open: true, message: 'Có lỗi xảy ra khi xử lý' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2, mb: 2 }}>
      <EditorContent content={content} onChange={setContent} onReady={setEditorInstance} />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        {onCancel && (
          <Button variant="outlined" onClick={onCancel} disabled={isSubmitting}>
            Hủy
          </Button>
        )}
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isSubmitting || !content.trim()}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
        >
          {buttonLabel}
        </Button>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="warning" onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
