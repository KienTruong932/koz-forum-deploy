"use client";

import {
  Link as MuiLink,
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Chip,
} from "@mui/material";
import NextLink from "next/link";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import FiberNewIcon from "@mui/icons-material/FiberNew";
import VisibilityIcon from "@mui/icons-material/Visibility";

function ThreadMiniItem({
  thread,
  showViews = false,
}: {
  thread: any;
  showViews?: boolean;
}) {
  return (
    <Box
      sx={{
        py: 1.2,
        borderBottom: "1px solid",
        borderColor: "divider",
        "&:last-child": { borderBottom: "none" },
      }}
    >
      <MuiLink
        component={NextLink}
        href={`/threads/${thread.slug}`}
        color="secondary"
        underline="none"
      >
        {thread.title}
      </MuiLink>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
        {thread.category_id?.name && (
          <MuiLink
            component={NextLink}
            href={`/categories/${thread.category_id.slug}`}
            underline="none"
          >
            <Chip
              color="primary"
              label={thread.category_id.name}
              size="small"
              sx={{ fontSize: "0.65rem", height: 18, cursor: "pointer" }}
            />
          </MuiLink>
        )}

        {showViews && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.3 }}>
            <VisibilityIcon sx={{ fontSize: 12, color: "secondary.main" }} />
            <Typography variant="caption" color="secondary">
              {thread.view_count || 0}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default function HomeSidebar({
  hotThreads,
  recentThreads,
}: {
  hotThreads: any[];
  recentThreads: any[];
}) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Card variant="outlined" sx={{ borderRadius: 2 }}>
        <CardContent sx={{ pb: "12px !important" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
            <WhatshotIcon color="error" fontSize="small" />
            <Typography
              color="primary"
              variant="subtitle1"
              sx={{ fontWeight: 700 }}
            >
              Bài viết nổi bật
            </Typography>
          </Box>
          <Divider sx={{ mb: 1 }} />
          {hotThreads.length === 0 ? (
            <Typography variant="body2" color="secondary">
              Chưa có bài viết.
            </Typography>
          ) : (
            hotThreads.map((thread) => (
              <ThreadMiniItem key={thread._id} thread={thread} showViews />
            ))
          )}
        </CardContent>
      </Card>

      <Card variant="outlined" sx={{ borderRadius: 2 }}>
        <CardContent sx={{ pb: "12px !important" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
            <FiberNewIcon color="primary" fontSize="small" />
            <Typography
              color="primary"
              variant="subtitle1"
              sx={{ fontWeight: 700 }}
            >
              Bài viết mới
            </Typography>
          </Box>
          <Divider sx={{ mb: 1 }} />
          {recentThreads.length === 0 ? (
            <Typography variant="body2" color="secondary">
              Chưa có bài viết.
            </Typography>
          ) : (
            recentThreads.map((thread) => (
              <ThreadMiniItem key={thread._id} thread={thread} />
            ))
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
