"use client";
import { Box, Typography, Link as MuiLink } from "@mui/material";
import NextLink from "next/link";
export default function ThreadItem({ thread }: { thread: any }) {
  const authorName = thread.author_id.username;
  return (
    <Box sx={{ borderBottom: "1px solid", borderColor: "divider", py: 2 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        <MuiLink
          component={NextLink}
          href={`/threads/${thread.slug}`}
          color="primary"
          style={{ textDecoration: "none" }}
        >
          {" "}
          {thread.title}{" "}
        </MuiLink>
      </Typography>
      <Typography variant="subtitle2" color="secondary">
        Tạo bởi: <strong>{authorName}</strong> | Lượt xem: {thread.view_count}
      </Typography>
    </Box>
  );
}
