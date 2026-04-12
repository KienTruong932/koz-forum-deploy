"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import MuiLink from "@mui/material/Link";
import NextLink from "next/link";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import { register } from "@/actions/auth.actions";
import { Gender } from "@/lib/enums";

export default function RegisterPage() {
  const router = useRouter();
  const [status, setStatus] = useState<{
    success?: boolean;
    message?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await register(formData);

    if (result?.error) {
      setStatus({ success: false, message: result.error });
      setLoading(false);
    } else {
      setStatus({
        success: true,
        message: "Đăng ký thành công! Đang chuyển hướng về đăng nhập...",
      });
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    }
  }

  return (
    <>
      <Container maxWidth="xs" sx={{ py: 8 }}>
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }} color="primary">
            Đăng ký tài khoản KOZ
          </Typography>
          <Typography variant="body2" color="secondary" sx={{ mt: 0.5 }}>
            Forum chất lượng dành cho anh em đam mê công nghệ
          </Typography>
        </Box>

        {status && (
          <Alert severity={status.success ? "success" : "error"} sx={{ mb: 2 }}>
            {status.message}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            required
            fullWidth
            size="small"
          />
          <TextField
            label="Tên người dùng"
            name="username"
            autoComplete="username"
            autoFocus
            required
            fullWidth
            size="small"
          />
          <TextField
            label="Mật khẩu"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            fullWidth
            size="small"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
          <TextField
            label="Nhập lại mật khẩu"
            name="passwordConfirm"
            type={showPassword ? "text" : "password"}
            required
            fullWidth
            size="small"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
          <TextField
            select
            label="Giới tính"
            name="gender"
            defaultValue={Gender.OTHER}
            fullWidth
            size="small"
            slotProps={{ select: { native: true } }}
          >
            <option value={Gender.MALE}>Nam</option>
            <option value={Gender.FEMALE}>Nữ</option>
            <option value={Gender.OTHER}>Khác</option>
          </TextField>
          <TextField
            label="Số điện thoại"
            name="phonenumber"
            autoComplete="tel"
            fullWidth
            size="small"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            startIcon={
              loading ? <CircularProgress size={16} color="inherit" /> : null
            }
          >
            {loading ? "Đang tạo tài khoản..." : "Đăng ký"}
          </Button>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography
          variant="body2"
          sx={{ textAlign: "center" }}
          color="secondary"
        >
          Đã có tài khoản?
          <MuiLink
            component={NextLink}
            href="/login"
            color="primary"
            sx={{ ml: 1 }}
          >
            Đăng nhập
          </MuiLink>
        </Typography>
      </Container>
    </>
  );
}
