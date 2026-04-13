'use client';

import NextLink from "next/link";
import { AppBar, Toolbar, Button, Box, TextField, InputAdornment, Link as MuiLink, Menu, MenuItem } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ColorModeToggle from "@/components/common/ColorModeToggle";
import UserMenu from "./UserMenu";
import { useRouter, usePathname } from "next/navigation";
import { useState, FormEvent } from "react";

export default function Header({ user, sections = [] }: { user: any; sections?: any[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [sectionAnchor, setSectionAnchor] = useState<null | HTMLElement>(null);

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSectionClick = (sectionId: string) => {
    setSectionAnchor(null);
    if (pathname === "/") {
      const el = document.getElementById(`section-${sectionId}`);
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      router.push(`/#section-${sectionId}`);
    }
  };

  return (
    <AppBar
      position="sticky"
      color="primary"
      elevation={1}
      sx={{ borderBottom: "1px solid", borderColor: "divider" }}
    >
      <Toolbar>
        <MuiLink
          variant="h5"
          component={NextLink}
          href="/"
          color="kozLogo"
          sx={{ mr: 4, fontWeight: "bold", textDecoration: "none" }}
        >
          KOZ
        </MuiLink>

        <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, gap: 0.5, alignItems: "center" }}>
          <Button size="large" component={NextLink} href="/" sx={{ color: "kozLogo" }}>
            Trang chủ
          </Button>

          <Button
            size="large"
            sx={{ color: "kozLogo" }}
            endIcon={<KeyboardArrowDownIcon />}
            onClick={(e) => setSectionAnchor(e.currentTarget)}
          >
            Khu vực
          </Button>
          <Menu
            anchorEl={sectionAnchor}
            open={Boolean(sectionAnchor)}
            onClose={() => setSectionAnchor(null)}
          >
            {sections.length === 0 && (
              <MenuItem disabled>Chưa có khu vực nào</MenuItem>
            )}
            {sections.map((s: any) => (
              <MenuItem key={s._id} onClick={() => handleSectionClick(s._id)}>
                {s.name}
              </MenuItem>
            ))}
          </Menu>

          <Button size="large" component={NextLink} href="/about" sx={{ color: "kozLogo" }}>
            Giới thiệu
          </Button>
          <Button size="large" component={NextLink} href="/faq" sx={{ color: "kozLogo" }}>
            Hỏi đáp
          </Button>
          <Button size="large" component={NextLink} href="/leaderboard" sx={{ color: "kozLogo" }}>
            Bảng xếp hạng
          </Button>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box component="form" onSubmit={handleSearch}>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: 5,
                    bgcolor: "action.hover",
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "kozLogo",
                    },
                  },
                },
              }}
              sx={{ width: "220px", display: { xs: "none", sm: "block" } }}
            />
          </Box>

          {user ? (
            <UserMenu user={user} />
          ) : (
            <Button
              component={NextLink}
              href="/login"
              variant="outlined"
              size="small"
              sx={{ color: "kozLogo", borderColor: "kozLogo" }}
            >
              Đăng nhập
            </Button>
          )}

          <ColorModeToggle />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
