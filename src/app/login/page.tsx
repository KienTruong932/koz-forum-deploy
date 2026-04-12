"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import MuiLink from "@mui/material/Link";
import NextLink from "next/link";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import GoogleIcon from "@mui/icons-material/Google";
import { login, loginWithGoogle } from "@/actions/auth.actions";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await login(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <Container maxWidth="xs" sx={{ py: 8 }}>
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <Typography
          variant="h5"
          component="h1"
          sx={{ fontWeight: 700 }}
          color="primary"
        >
          Đăng nhập KOZ
        </Typography>
        <Typography variant="body2" color="secondary" sx={{ mt: 0.5 }}>
          Forum chất lượng dành cho anh em đam mê công nghệ
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <TextField
          label="Tên đăng nhập"
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
          type="password"
          autoComplete="current-password"
          required
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
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </Button>
      </Box>

      <Box sx={{ mt: 2 }}>
        <form action={loginWithGoogle}>
          <Button
            type="submit"
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
          >
            Đăng nhập bằng Google
          </Button>
        </form>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Typography
        variant="body2"
        sx={{ textAlign: "center" }}
        color="secondary"
      >
        Chưa có tài khoản?{" "}
        <MuiLink component={NextLink} href="/register" color="primary">
          Đăng ký ngay
        </MuiLink>
      </Typography>
    </Container>
  );
}
