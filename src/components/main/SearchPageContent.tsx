'use client';

import { Container, Typography, Box, Card, CardContent, Link as MuiLink, Avatar } from '@mui/material';
import NextLink from 'next/link';

export default function SearchPageContent({
  initialResults,
  query,
}: {
  initialResults: any[];
  query: string;
}) {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        Kết quả tìm kiếm
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        Tìm thấy {initialResults.length} kết quả cho từ khóa "{query}"
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {initialResults.length === 0 ? (
          <Typography>Không có kết quả nào phù hợp.</Typography>
        ) : (
          initialResults.map((result, index) => {
            const post = result;
            const thread = post.thread_id;
            const author = post.author_id;
            const category = thread?.category_id;

            return (
              <Card key={post?._id?.toString() || index} variant="outlined" sx={{ borderRadius: 2 }}>
                <CardContent>
                  <MuiLink
                    component={NextLink}
                    href={`/threads/${thread?.slug}`}
                    variant="h6"
                    sx={{ fontWeight: 'bold', mb: 1, display: 'block', color: 'primary.main', textDecoration: 'none' }}
                  >
                    {thread?.title || 'Luồng bị xóa'}
                  </MuiLink>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar src={author?.avatar} sx={{ width: 24, height: 24 }} />
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {author?.username || 'Người dùng ẩn danh'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        • {new Date(post.created_at).toLocaleDateString('vi-VN')}
                      </Typography>
                    </Box>
                    {category && (
                      <MuiLink
                        component={NextLink}
                        href={`/categories/${category.slug}`}
                        variant="caption"
                        sx={{
                          bgcolor: 'action.hover',
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          textDecoration: 'none',
                          color: 'text.primary',
                        }}
                      >
                        {category.name}
                      </MuiLink>
                    )}
                  </Box>
                </CardContent>
              </Card>
            );
          })
        )}
      </Box>
    </Container>
  );
}
