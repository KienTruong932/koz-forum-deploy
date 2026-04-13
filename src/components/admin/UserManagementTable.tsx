'use client';

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Box,
  TextField,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Typography,
  InputAdornment,
  Link as MuiLink,
} from "@mui/material";
import NextLink from "next/link";
import Pagination from "@/components/main/Pagination";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import {
  updateUserRoleAdmin,
  updateUserStatusAdmin,
} from "@/actions/user.actions";
import { Role, UserStatus } from "@/lib/enums";
import SearchIcon from "@mui/icons-material/Search";

export default function UserManagementTable({
  users,
  totalPages,
  currentPage,
  query,
}: {
  users: any[];
  totalPages: number;
  currentPage: number;
  query: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchInput, setSearchInput] = useState(query);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const [confirmState, setConfirmState] = useState<{
    open: boolean;
    title: string;
    message: string;
    action: () => Promise<void>;
  }>({
    open: false,
    title: "",
    message: "",
    action: async () => { },
  });

  const handleSearch = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchInput) {
      params.set("q", searchInput);
    } else {
      params.delete("q");
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleRoleChange = (
    userId: string,
    newRole: string,
    currentRole: string,
  ) => {
    if (currentRole === Role.ADMIN) {
      setSnackbar({
        open: true,
        message: "Bạn không thể thay đổi vai trò của một Quản trị viên",
        severity: "error",
      });
      return;
    }
    setConfirmState({
      open: true,
      title: "Xác nhận thay đổi vai trò",
      message: `Bạn đang cấp vai trò ${newRole} cho người dùng này. Bạn có chắc chắn không?`,
      action: async () => {
        setConfirmState((prev) => ({ ...prev, open: false }));
        const result = await updateUserRoleAdmin(userId, newRole);
        if (result?.error) {
          setSnackbar({ open: true, message: result.error, severity: "error" });
        } else {
          setSnackbar({
            open: true,
            message: "Cập nhật thành công",
            severity: "success",
          });
        }
      },
    });
  };

  const handleStatusChange = (
    userId: string,
    newStatus: string,
    currentRole: string,
  ) => {
    if (currentRole === Role.ADMIN && newStatus !== UserStatus.ACTIVE) {
      setSnackbar({
        open: true,
        message:
          "Bạn không thể thay đổi trạng thái của một Quản trị viên thành hạn chế hoặc vi phạm",
        severity: "error",
      });
      return;
    }
    setConfirmState({
      open: true,
      title: "Xác nhận thay đổi trạng thái",
      message: `Bạn đang đổi trạng thái tài khoản thành ${newStatus}. Bạn có chắc chắn không?`,
      action: async () => {
        setConfirmState((prev) => ({ ...prev, open: false }));
        const result = await updateUserStatusAdmin(userId, newStatus);
        if (result?.error) {
          setSnackbar({ open: true, message: result.error, severity: "error" });
        } else {
          setSnackbar({
            open: true,
            message: "Cập nhật thành công",
            severity: "success",
          });
        }
      },
    });
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" color="primary" sx={{ fontWeight: "bold" }}>
          Quản lý người dùng
        </Typography>
        <Box
          component="form"
          onSubmit={handleSearch}
          sx={{ display: "flex", gap: 1 }}
        >
          <TextField
            size="small"
            placeholder="Tìm theo email, username..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              },
            }}
          />
          <Button variant="contained" type="submit">
            Tìm kiếm
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên người dùng</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Tên hiển thị</TableCell>
              <TableCell>Vai trò</TableCell>
              <TableCell>Trạng thái</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  Chưa có người dùng nào trong hệ thống.
                </TableCell>
              </TableRow>
            ) : (
              users.map((u) => (
                <TableRow key={u._id.toString()}>
                  <TableCell>
                    <MuiLink href={`/profile/${u.username}`} underline="hover">
                      @{u.username}
                    </MuiLink>
                  </TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.display_name}</TableCell>
                  <TableCell>
                    <Select
                      size="small"
                      value={u.role || Role.MEMBER}
                      onChange={(e) =>
                        handleRoleChange(
                          u._id,
                          e.target.value,
                          u.role || Role.MEMBER,
                        )
                      }
                      disabled={u.role === Role.ADMIN}
                      sx={{ minWidth: 120 }}
                    >
                      <MenuItem value={Role.MEMBER}>Member</MenuItem>
                      <MenuItem value={Role.MODERATOR}>Moderator</MenuItem>
                      <MenuItem value={Role.ADMIN} disabled>
                        Admin
                      </MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select
                      size="small"
                      color={
                        u.status === UserStatus.BANNED
                          ? "error"
                          : u.status === UserStatus.RESTRICTED
                            ? "warning"
                            : "success"
                      }
                      value={u.status || UserStatus.ACTIVE}
                      onChange={(e) =>
                        handleStatusChange(
                          u._id,
                          e.target.value,
                          u.role || Role.MEMBER,
                        )
                      }
                      disabled={u.role === Role.ADMIN}
                      sx={{ minWidth: 130 }}
                    >
                      <MenuItem value={UserStatus.ACTIVE}>Hoạt động</MenuItem>
                      <MenuItem value={UserStatus.RESTRICTED}>Hạn chế</MenuItem>
                      <MenuItem value={UserStatus.BANNED}>Bị khóa</MenuItem>
                    </Select>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <ConfirmDialog
        open={confirmState.open}
        title={confirmState.title}
        message={confirmState.message}
        confirmLabel="Đồng ý"
        onConfirm={confirmState.action}
        onCancel={() => setConfirmState((prev) => ({ ...prev, open: false }))}
      />
    </Box>
  );
}
