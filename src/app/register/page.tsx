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
import Paper from "@mui/material/Paper";
import { register } from "@/actions/auth.actions";
import { Gender } from "@/lib/enums";

export default function RegisterPage() {
  const [status, setStatus] = useState<{ success?: boolean; message?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const formData = new FormData(e.currentTarget);
    const result = await register(formData);

    if (result?.error) {
      setStatus({ success: false, message: result.error });
      setLoading(false);
    } else {
      setStatus({
        success: true,
        message: "Đăng ký thành công! Đang chuyển hướng...",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    }
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          display: "flex",
          flexDirection: "column",
          borderRadius: 4,
          backdropFilter: "blur(10px)",
          border: "1px solid",
          borderColor: "divider",
          background: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(30, 30, 35, 0.8)"
              : "rgba(255, 255, 255, 0.9)",
        }}
      >
        {/* Header đồng bộ Login */}
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 800, letterSpacing: "-0.5px" }}
            color="primary"
          >
            Đăng ký tài khoản KOZ
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Forum chất lượng dành cho anh em đam mê công nghệ
          </Typography>
        </Box>

        {status && (
          <Alert severity={status.success ? "success" : "error"} sx={{ mb: 2, borderRadius: 2 }}>
            {status.message}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
        >
          {/* 1. Email */}
          <TextField
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            required
            fullWidth
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />

          {/* 2. Username */}
          <TextField
            label="Tên người dùng"
            name="username"
            autoComplete="username"
            autoFocus
            required
            fullWidth
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />

          {/* 3. Password */}
          <TextField
            label="Mật khẩu"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            fullWidth
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          {/* 4. Password Confirm */}
          <TextField
            label="Nhập lại mật khẩu"
            name="passwordConfirm"
            type={showPassword ? "text" : "password"}
            required
            fullWidth
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          {/* 5. Giới tính */}
          <TextField
            select
            label="Giới tính"
            name="gender"
            defaultValue={Gender.OTHER}
            fullWidth
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            slotProps={{
              select: { native: true },
            }}
          >
            <option value={Gender.MALE}>Nam</option>
            <option value={Gender.FEMALE}>Nữ</option>
            <option value={Gender.OTHER}>Khác</option>
          </TextField>

          {/* 6. Số điện thoại */}
          <TextField
            label="Số điện thoại"
            name="phonenumber"
            autoComplete="tel"
            fullWidth
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            disabled={loading}
            sx={{
              borderRadius: 2,
              py: 1.5,
              fontWeight: 700,
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              textTransform: "none",
            }}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {loading ? "Đang tạo tài khoản..." : "Đăng ký"}
          </Button>
        </Box>

        <Divider sx={{ my: 4 }}>
          <Typography variant="caption" color="text.secondary" sx={{ px: 1 }}>
            HOẶC
          </Typography>
        </Divider>

        <Typography
          variant="body2"
          sx={{ textAlign: "center", fontWeight: 500 }}
          color="text.secondary"
        >
          Đã có tài khoản?{" "}
          <MuiLink
            component={NextLink}
            href="/login"
            color="primary"
            sx={{
              fontWeight: 700,
              textDecoration: "none",
              "&:hover": { textDecoration: "underline" }
            }}
          >
            Đăng nhập
          </MuiLink>
        </Typography>
      </Paper>
    </Container>
  );
}