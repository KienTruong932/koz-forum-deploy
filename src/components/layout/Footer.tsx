'use client';

import React from 'react';
import { Box, Container, Typography, IconButton } from '@mui/material';
import Grid from '@mui/material/Grid';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';

export default function Footer() {
  return (
    <Box component="footer" sx={{ py: 4, borderTop: '1px solid', borderColor: 'divider' }}>
      <Container maxWidth="lg">
        <Grid container spacing={12}>
          <Grid >
            <Typography variant="h6" color="primary" gutterBottom sx={{ fontWeight: 'bold' }}>
              KOZ
            </Typography>
            <Typography variant="body2" color="secondary" gutterBottom>
              <strong>Tác giả:</strong> Trương Trung Kiên
            </Typography>
            <Typography variant="body2" color="secondary">
              Diễn đàn kết nối, thảo luận và chia sẻ kiến thức chất lượng hàng đầu.
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="subtitle2" color="secondary" gutterBottom sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
              Liên hệ
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneIcon fontSize="small" color="action" />
                <Typography variant="body2" color="secondary">
                  <strong>SĐT:</strong> 0123 456 789
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <LocationOnIcon fontSize="small" color="action" sx={{ mt: 0.3 }} />
                <Typography variant="body2" color="secondary">
                  <strong>Địa chỉ:</strong> 123 Đường Công Nghệ, Quận 1, TP. HCM
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="subtitle2" color="secondary" gutterBottom sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
              Mạng xã hội
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton aria-label="Facebook" color="primary" size="small">
                <FacebookIcon />
              </IconButton>
              <IconButton aria-label="Twitter" color="secondary" size="small">
                <TwitterIcon />
              </IconButton>
              <IconButton aria-label="YouTube" color="error" size="small">
                <YouTubeIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 6, pt: 3, borderTop: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
          <Typography variant="body2" color="secondary">
            © {new Date().getFullYear()} KOZ Forum. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
