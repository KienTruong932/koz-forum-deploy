'use client';
import { Box, Typography, Link } from '@mui/material';
export default function ThreadItem({ thread }: { thread: any }) {
  const authorName = thread.author_id.username
  return (
    <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', py: 2 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        <Link href={`/threads/${thread.slug}`} color="primary" style={{textDecoration: 'none' }}> {thread.title} </Link>
      </Typography>
      <Typography variant="subtitle2" color="secondary">
        Tạo bởi: <strong>{authorName}</strong> | Lượt xem: {thread.view_count}
      </Typography>
    </Box>
  );
}
