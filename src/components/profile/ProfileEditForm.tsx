"use client";

import React, { useState, useRef } from "react";
import { Box, TextField, Button, Avatar, CircularProgress, Alert } from "@mui/material";
import { updateProfile } from "@/actions/user.actions";
import { uploadImageAction } from "@/actions/cloudinary.actions";
import { Gender } from "@/lib/enums";

export default function ProfileEditForm({ user }: { user: any }) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user.avatar || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    const uploadResult = await uploadImageAction(formData);
    if (uploadResult?.error) {
      setError(uploadResult.error);
    } else if (uploadResult?.url) {
      setAvatarUrl(uploadResult.url);
      setSuccess("Tải ảnh thành công. Hãy bấm Cập nhật hồ sơ để lưu.");
    }

    setUploading(false);
  }

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      display_name: formData.get("displayName"),
      bio: formData.get("bio"),
      gender: formData.get("gender"),
      phonenumber: formData.get("phonenumber"),
      avatar: avatarUrl,
    };

    const result = await updateProfile(data);

    if (result?.error) {
      setError(result.error);
    } else if (result?.success) {
      setSuccess("Cập nhật hồ sơ thành công!");
    }

    setLoading(false);
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
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

      <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 2 }}>
        <Avatar src={avatarUrl} sx={{ width: 80, height: 80 }} />
        <Button
          variant="outlined"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? "Đang tải..." : "Đổi Avatar"}
        </Button>
        <input
          type="file"
          hidden
          ref={fileInputRef}
          accept="image/*"
          onChange={handleAvatarUpload}
        />
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Tên hiển thị"
          name="displayName"
          defaultValue={user.display_name}
          fullWidth
          size="small"
        />
        <TextField
          select
          label="Giới tính"
          name="gender"
          defaultValue={user.gender}
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
          defaultValue={user.phonenumber}
          fullWidth
          size="small"
        />
        <TextField
          label="Giới thiệu bản thân"
          name="bio"
          defaultValue={user.bio || ""}
          multiline
          rows={3}
          fullWidth
          size="small"
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          startIcon={
            loading ? <CircularProgress size={16} color="inherit" /> : null
          }
        >
          {loading ? "Đang cập nhật..." : "Cập nhật hồ sơ"}
        </Button>
      </Box>
    </Box>
  );
}
