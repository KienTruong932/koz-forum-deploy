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
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { createCategory, updateCategory, deleteCategory } from '@/actions/category.actions';
import { useRouter } from 'next/navigation';

export default function CategoryAdminClient({ categories, sections }: { categories: any[]; sections: any[] }) {
  const router = useRouter();

  const [form, setForm] = useState({ name: '', description: '', section_id: '' });
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', description: '', section_id: '' });

  const handleCreate = async () => {
    if (!form.name.trim()) return;
    await createCategory({ name: form.name.trim(), description: form.description.trim(), section_id: form.section_id || null });
    setForm({ name: '', description: '', section_id: '' });
    router.refresh();
  };

  const handleEdit = (c: any) => {
    setEditId(c._id);
    setEditForm({ name: c.name, description: c.description || '', section_id: c.section_id || '' });
  };

  const handleSave = async () => {
    if (!editForm.name.trim() || !editId) return;
    await updateCategory(editId, { name: editForm.name.trim(), description: editForm.description.trim(), section_id: editForm.section_id || null });
    setEditId(null);
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa danh mục này?')) return;
    await deleteCategory(id);
    router.refresh();
  };

  const SectionSelect = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
    <FormControl size="small" sx={{ minWidth: 140 }}>
      <InputLabel>Khu vực</InputLabel>
      <Select label="Khu vực" value={value} onChange={e => onChange(e.target.value as string)}>
        <MenuItem value=""><em>Không có</em></MenuItem>
        {sections.map(s => <MenuItem key={s._id} value={s._id}>{s.name}</MenuItem>)}
      </Select>
    </FormControl>
  );

  return (
    <Box>
      {/* Add form */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        <TextField label="Tên danh mục" size="small" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
        <TextField label="Mô tả" size="small" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} sx={{ flexGrow: 1 }} />
        <SectionSelect value={form.section_id} onChange={v => setForm(f => ({ ...f, section_id: v }))} />
        <Button variant="contained" onClick={handleCreate}>Thêm</Button>
      </Box>

      {/* Table */}
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell><Typography sx={{ fontWeight: "bold" }}>Tên</Typography></TableCell>
            <TableCell><Typography sx={{ fontWeight: "bold" }}>Mô tả</Typography></TableCell>
            <TableCell><Typography sx={{ fontWeight: "bold" }}>Khu vực</Typography></TableCell>
            <TableCell align="right"><Typography sx={{ fontWeight: "bold" }}>Hành động</Typography></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {categories.map(c => (
            <TableRow key={c._id}>
              {editId === c._id ? (
                <>
                  <TableCell>
                    <TextField size="small" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} autoFocus />
                  </TableCell>
                  <TableCell>
                    <TextField size="small" value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} />
                  </TableCell>
                  <TableCell>
                    <SectionSelect value={editForm.section_id} onChange={v => setEditForm(f => ({ ...f, section_id: v }))} />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" color="success" onClick={handleSave}><CheckIcon fontSize="small" /></IconButton>
                    <IconButton size="small" onClick={() => setEditId(null)}><CloseIcon fontSize="small" /></IconButton>
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell>{c.name}</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>{c.description || '—'}</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                    {sections.find(s => s._id === c.section_id)?.name || <em>Không có</em>}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handleEdit(c)}><EditIcon fontSize="small" /></IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(c._id)}><DeleteIcon fontSize="small" /></IconButton>
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
