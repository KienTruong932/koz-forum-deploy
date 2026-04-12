'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { logout } from '@/actions/auth.actions';
import { Role } from '@/lib/enums';

export default function UserMenu({ user }: { user: any }) {
  const router = useRouter();
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);

  async function handleLogout() {
    setAnchor(null);
    await logout();
    router.push('/login');
    router.refresh();
  }
  async function handleProfile() {
    setAnchor(null);
    router.push(`/profile/${user.username}`);
    router.refresh();
  }
  
  async function handleAdmin() {
    setAnchor(null);
    router.push(`/admin/users`);
    router.refresh();
  }

  return (
    <>
      <Tooltip title={user.name}>
        <Box
          onClick={(e) => setAnchor(e.currentTarget)}
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }}
        >
          <IconButton size="large" color="inherit" aria-label="user account">
            <AccountCircle />
          </IconButton>
          <Typography variant="body2" sx={{ fontWeight: 500, display: { xs: 'none', sm: 'block' } }}>
            {user.name}
          </Typography>
        </Box>
      </Tooltip>

      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
      >
        <MenuItem sx={{color: 'secondary.main'}} onClick={handleProfile}>Hồ sơ người dùng</MenuItem>
        {user.role === Role.ADMIN && (
          <MenuItem sx={{color: 'secondary.main'}} onClick={handleAdmin}>Quản lý người dùng</MenuItem>
        )}
        {user.role === Role.ADMIN && (
          <MenuItem sx={{color: 'secondary.main'}} onClick={() => { setAnchor(null); router.push('/admin/sections'); router.refresh(); }}>Quản lý khu vực</MenuItem>
        )}
        {user.role === Role.ADMIN && (
          <MenuItem sx={{color: 'secondary.main'}} onClick={() => { setAnchor(null); router.push('/admin/categories'); router.refresh(); }}>Quản lý danh mục</MenuItem>
        )}
        <Divider />
        <MenuItem sx={{color: 'secondary.main'}} onClick={handleLogout}>Đăng xuất</MenuItem>
      </Menu>
    </>
  );
}
