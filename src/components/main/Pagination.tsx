'use client';

import { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [inputPage, setInputPage] = useState(String(currentPage));


  function goToPage(page: number) {
    const p = Math.max(1, Math.min(page, totalPages));
    setInputPage(String(p));
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(p));
    router.push(`${pathname}?${params.toString()}`);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputPage(e.target.value);
  }

  function handleInputSubmit(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      const page = parseInt(inputPage, 10);
      if (!isNaN(page)) goToPage(page);
    }
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, my: 3 }}>
      <Button
        variant="outlined"
        size="small"
        disabled={currentPage <= 1}
        onClick={() => { setInputPage(String(currentPage - 1)); goToPage(currentPage - 1); }}
      >
        Prev
      </Button>

      <TextField
        size="small"
        value={inputPage}
        onChange={handleInputChange}
        onKeyDown={handleInputSubmit}
        onBlur={() => {
          const page = parseInt(inputPage, 10);
          if (!isNaN(page)) goToPage(page);
          else setInputPage(String(currentPage));
        }}
        sx={{ width: 64 }}
        slotProps={{
          input: { style: { textAlign: 'center' } },
          formHelperText: { style: { textAlign: 'center', margin: 0 } },
        }}
        helperText={`/ ${totalPages}`}
      />

      <Button
        variant="outlined"
        size="small"
        disabled={currentPage >= totalPages}
        onClick={() => { setInputPage(String(currentPage + 1)); goToPage(currentPage + 1); }}
      >
        Next
      </Button>
    </Box>
  );
}
