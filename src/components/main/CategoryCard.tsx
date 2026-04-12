'use client';

import NextLink from 'next/link'
import { Card, CardContent, Typography, CardActionArea } from '@mui/material';

export default function CategoryCard({ category }: { category: any }) {
  return (
    <Card sx={{ mb: 2, borderRadius: 2 }} variant="outlined">
      <CardActionArea component={NextLink} href={`/categories/${category.slug}`}>
        <CardContent>
          <Typography variant="h6" component="h2" color="primary" gutterBottom>
            {category.name}
          </Typography>
          <Typography variant="subtitle1" color="secondary">
            {category.description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
