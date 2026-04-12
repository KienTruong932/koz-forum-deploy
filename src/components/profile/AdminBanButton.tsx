'use client';

import { useState } from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { toggleBanUser } from '@/actions/user.actions';
import { UserStatus } from '@/lib/enums';

export default function AdminBanButton({ username, currentStatus }: { username: string; currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [confirmOpen, setConfirmOpen] = useState(false);

  const isBanned = status === UserStatus.BANNED;

  const handleClick = async () => {
    setConfirmOpen(false);
    const result = await toggleBanUser(username);
    if (result?.error) {
      setSnackbar({ open: true, message: result.error, severity: 'error' });
    } else {
      setStatus(result.status);
      setSnackbar({
        open: true,
        message: isBanned ? 'Đã mở khóa tài khoản.' : 'Đã khóa tài khoản thành công.',
        severity: 'success',
      });
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color={isBanned ? 'success' : 'error'}
        size="small"
        onClick={() => setConfirmOpen(true)}
        sx={{ mt: 2, ml: 2 }}
      >
        {isBanned ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}
      </Button>

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
        open={confirmOpen}
        title={isBanned ? "Mở khóa tài khoản" : "Khóa tài khoản vĩnh viễn"}
        message={isBanned 
          ? "Bạn có chắc chắn muốn mở khóa cho người dùng này? Họ sẽ có thể đăng nhập trở lại." 
          : "Người dùng này sẽ bị đăng xuất và không thể đăng nhập lại vào hệ thống. Bạn có chắc chắn muốn khóa tài khoản này?"
        }
        confirmLabel={isBanned ? "Mở khóa" : "Khóa tài khoản"}
        onConfirm={handleClick}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
