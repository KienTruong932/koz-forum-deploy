'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { createSection, updateSection } from '@/actions/section.actions';
import { useRouter } from 'next/navigation';

export default function SectionAdminClient({ sections }: { sections: any[] }) {
  const router = useRouter();
  const [newName, setNewName] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleCreate = async () => {
    if (!newName.trim()) return;
    await createSection(newName.trim());
    setNewName('');
    router.refresh();
  };

  const handleEdit = (s: any) => {
    setEditId(s._id);
    setEditName(s.name);
  };

  const handleSave = async () => {
    if (!editName.trim() || !editId) return;
    await updateSection(editId, editName.trim());
    setEditId(null);
    router.refresh();
  };

  return (
    <Box>
      {/* Add new */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <TextField
          label="Tên khu vực mới"
          size="small"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleCreate(); }}
          sx={{ flexGrow: 1 }}
        />
        <Button variant="contained" onClick={handleCreate}>Thêm</Button>
      </Box>

      {/* List */}
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell><Typography sx={{ fontWeight: "bold" }}>Tên khu vực</Typography></TableCell>
            <TableCell align="right"><Typography sx={{ fontWeight: "bold" }}>Hành động</Typography></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sections.map(s => (
            <TableRow key={s._id}>
              <TableCell>
                {editId === s._id ? (
                  <TextField
                    size="small"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleSave(); }}
                    autoFocus
                  />
                ) : (
                  <Typography>{s.name}</Typography>
                )}
              </TableCell>
              <TableCell align="right">
                {editId === s._id ? (
                  <>
                    <IconButton size="small" color="success" onClick={handleSave}><CheckIcon fontSize="small" /></IconButton>
                    <IconButton size="small" onClick={() => setEditId(null)}><CloseIcon fontSize="small" /></IconButton>
                  </>
                ) : (
                  <IconButton size="small" onClick={() => handleEdit(s)}><EditIcon fontSize="small" /></IconButton>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
