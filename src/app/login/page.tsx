"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import Snackbar from "@mui/material/Snackbar";
import Paper from "@mui/material/Paper";
import { login, loginWithGoogle } from "@/actions/auth.actions";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam === "Banned") {
      setSnackbarOpen(true);
    }
  }, [searchParams]);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await login(formData);

    if (result?.error === "Banned") {
      setSnackbarOpen(true);
      setLoading(false);
    } else if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  }

  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="xs" sx={{ py: 8 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          display: "flex",
          flexDirection: "column",
          borderRadius: 4,
          background: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(30, 30, 35, 0.8)"
              : "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(10px)",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Typography
            variant="h5"
            component="h1"
            sx={{ fontWeight: 800, letterSpacing: "-0.5px" }}
            color="primary"
          >
            Đăng nhập KOZ
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Forum chất lượng dành cho anh em đam mê công nghệ
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
        >
          <TextField
            label="Tên đăng nhập"
            name="username"
            autoComplete="username"
            autoFocus
            required
            fullWidth
            variant="outlined"
            size="medium"
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />
          <TextField
            label="Mật khẩu"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            fullWidth
            variant="outlined"
            size="medium"
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
            startIcon={
              loading ? <CircularProgress size={20} color="inherit" /> : null
            }
          >
            {loading ? "Đang xử lý..." : "Đăng nhập"}
          </Button>
        </Box>

        <Box sx={{ mt: 3 }}>
          <form action={loginWithGoogle}>
            <Button
              type="submit"
              fullWidth
              variant="outlined"
              size="large"
              sx={{
                borderRadius: 2,
                py: 1.2,
                textTransform: "none",
                borderColor: "divider",
                color: "text.primary",
                "&:hover": { borderColor: "primary.main", bgcolor: "action.hover" },
              }}
              startIcon={<GoogleIcon sx={{ color: "#4285F4" }} />}
            >
              Đăng nhập bằng Google
            </Button>
          </form>
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
          Chưa có tài khoản?{" "}
          <MuiLink
            component={NextLink}
            href="/register"
            color="primary"
            sx={{ fontWeight: 700, textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
          >
            Đăng ký ngay
          </MuiLink>
        </Typography>
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          variant="filled"
          sx={{ width: "100%", borderRadius: 2, fontWeight: 600 }}
        >
          Tài khoản của bạn đã bị khóa, vui lòng liên hệ admin để mở khóa
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress />
        </Box>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
