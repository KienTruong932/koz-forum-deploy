'use client';

import React, { useState } from "react";
import { Box, Typography, TextField, Button, CircularProgress, Alert } from "@mui/material";
import { changePassword } from "@/actions/user.actions";

export default function PasswordChangeForm({
  hasPassword,
}: {
  hasPassword: boolean;
}) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await changePassword(formData);

    if (result?.error) {
      setError(result.error);
    } else if (result?.success) {
      setSuccess(
        hasPassword ? "Đổi mật khẩu thành công!" : "Đặt mật khẩu thành công!",
      );
      (e.target as HTMLFormElement).reset();
    }

    setLoading(false);
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        mt: 4,
        p: 3,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
      }}
    >
      <Typography variant="h6" gutterBottom color="primary">
        {hasPassword ? "Đổi Mật Khẩu" : "Đặt Mật Khẩu"}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {hasPassword && (
          <TextField
            label="Mật khẩu cũ"
            name="oldPassword"
            type="password"
            autoComplete="current-password"
            required
            fullWidth
            size="small"
          />
        )}
        <TextField
          label="Mật khẩu mới"
          name="newPassword"
          type="password"
          autoComplete="new-password"
          required
          fullWidth
          size="small"
        />
        <TextField
          label="Xác nhận mật khẩu"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          fullWidth
          size="small"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ alignSelf: "flex-start" }}
          disabled={loading}
          startIcon={
            loading ? <CircularProgress size={16} color="inherit" /> : null
          }
        >
          {loading
            ? "Đang xử lý..."
            : hasPassword
              ? "Đổi mật khẩu"
              : "Đặt mật khẩu"}
        </Button>
      </Box>
    </Box>
  );
}
