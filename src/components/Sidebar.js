import React, { useState } from "react";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/system";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import { FiMenu, FiHome, FiList, FiSettings, FiCalendar, FiLogOut } from "react-icons/fi";
import TaskDashboard from './TaskDashboard.js';
import Calendar from './Calendar.js'



const drawerWidth = 240;

const DarkThemeContainer = styled(Box)(({ theme }) => ({
  backgroundColor: "#121212",
  color: "#ffffff",
  minHeight: "100vh",
}));

const SidebarContent = ({ onClose }) => {
  const navigate = useNavigate();

  const menuItems = [
    { text: "Dashboard", icon: <FiHome />, path: "/" },
    { text: "Tasks", icon: <FiList />, path: "/tasks" },
    { text: "Calendar", icon: <FiCalendar />, path: "/calendar" },
    { text: "Settings", icon: <FiSettings />, path: "/settings" },
    { text: "Logout", icon: <FiLogOut />, path: "/logout" },
  ];

  return (
    <Box>
      <Typography
        variant="h5"
        sx={{ p: 2, borderBottom: "1px solid #444", fontWeight: "bold", textAlign: "center" }}
      >
        Task Manager
      </Typography>
      <List>
        {menuItems.map((item, index) => (
          <ListItem
            button
            key={index}
            onClick={() => {
              navigate(item.path);
              if (onClose) onClose(); // Close drawer on mobile
            }}
          >
            <ListItemIcon sx={{ color: "#ffffff" }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};


const Settings = () => <Typography variant="h4">Settings Content</Typography>;
const Logout = () => <Typography variant="h4">Logout Page</Typography>;

const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:600px)");

  const toggleDrawer = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Router>
      <DarkThemeContainer>
        <IconButton
          sx={{ position: "absolute", top: 16, left: 16, color: "#ffffff" }}
          onClick={toggleDrawer}
        >
          <FiMenu />
        </IconButton>
        <Drawer
        
          variant={isMobile ? "temporary" : "permanent"}
          open={isMobile ? mobileOpen : true}
          onClose={toggleDrawer}
          sx={{
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              backgroundColor: "#222",
              color: "#fff",
            },
          }}
        >
          <SidebarContent onClose={toggleDrawer} />
        </Drawer>
        <Box
          sx={{
            marginLeft: isMobile ? 0 : `${drawerWidth}px`,
            p: 3,
            transition: "margin-left 0.3s ease",
          }}
        >
          <Routes>
            <Route path="/" element={<TaskDashboard />} />
            <Route path="/tasks" element={<TaskDashboard />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/logout" element={<Logout />} />
          </Routes>
        </Box>
      </DarkThemeContainer>
    </Router>
  );
};

export default Sidebar;



