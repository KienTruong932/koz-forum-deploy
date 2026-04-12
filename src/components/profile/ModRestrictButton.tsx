'use client';

import { useState } from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { toggleRestrictUser } from '@/actions/user.actions';
import { UserStatus } from '@/lib/enums';

export default function ModRestrictButton({ username, currentStatus }: { username: string; currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [confirmOpen, setConfirmOpen] = useState(false);

  const isRestricted = status === UserStatus.RESTRICTED;

  const handleClick = async () => {
    setConfirmOpen(false);
    const result = await toggleRestrictUser(username);
    if (result?.error) {
      setSnackbar({ open: true, message: result.error, severity: 'error' });
    } else {
      setStatus(result.status);
      setSnackbar({
        open: true,
        message: isRestricted ? 'Đã bỏ hạn chế tài khoản.' : 'Đã hạn chế tài khoản.',
        severity: 'success',
      });
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        color={isRestricted ? 'success' : 'warning'}
        size="small"
        onClick={() => setConfirmOpen(true)}
        sx={{ mt: 2 }}
      >
        {isRestricted ? 'Bỏ hạn chế' : 'Hạn chế tài khoản'}
      </Button>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <ConfirmDialog
        open={confirmOpen}
        title={isRestricted ? "Bỏ hạn chế tài khoản" : "Hạn chế tài khoản"}
        message={isRestricted 
          ? "Bạn có chắc chắn muốn cho phép người dùng này hoạt động bình thường trở lại?" 
          : "Người dùng bị hạn chế sẽ không thể tạo chủ đề hoặc bài viết mới. Bạn có chắc chắn?"
        }
        confirmLabel={isRestricted ? "Bỏ hạn chế" : "Hạn chế"}
        onConfirm={handleClick}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
