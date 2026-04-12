"use client";

import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useColorScheme } from "@mui/material/styles";

export default function ColorModeToggle() {
  const { mode, setMode } = useColorScheme();
  if (!mode) return null;
  return (
    <Tooltip title={mode === "dark" ? "Chế độ sáng" : "Chế độ tối"}>
      <IconButton
        size="large"
        color="inherit"
        onClick={() => setMode(mode === "dark" ? "light" : "dark")}
      >
        {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>
    </Tooltip>
  );
}
