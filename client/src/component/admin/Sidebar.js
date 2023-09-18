import React from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Link } from "react-router-dom";
import "../../Style/Admin/Sidebar.css";

import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import WalletRoundedIcon from "@mui/icons-material/WalletRounded";
import SettingsApplicationsRoundedIcon from "@mui/icons-material/SettingsApplicationsRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import QuizIcon from '@mui/icons-material/Quiz';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

function Sidebarr() {
  const handleLogout = async () => {
    try {
      const res = await fetch("/logout", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
        credentials: "include",
      });

      if (res.status === 200) {
        window.location.href = "/admin-login";
      } else {
        const error = new Error("Failed to logout");
        throw error;
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Sidebar
        className="mainavbar"
        backgroundColor="#020a25"
        rootStyles={{
          color: "white",
          backgroundColor: "#020a25",
          height: "100%"
        }}
      >
        <Menu>
          <MenuItem
            component={<Link to="/admin-dashbord" className="link" />}
            className="menu1"
          >
            <h2>Smart Exam</h2>
          </MenuItem>
          <MenuItem
            component={<Link to="/admin-dashbord" className="link" />}
            icon={<GridViewRoundedIcon />}
            className="menu"
          >
            Dashboard
          </MenuItem>
          <SubMenu
            className="menu"
            label="Student"
            icon={<SupervisedUserCircleIcon />}
          >
            <MenuItem
              className="submenu"
              component={<Link to="/all-student" />}
              icon={<PeopleAltIcon />}
            >
              All Students
            </MenuItem>
            <MenuItem
              className="submenu"
              component={<Link to="/add-student" />}
              icon={<GroupAddIcon />}
            >
              Add Student
            </MenuItem>
          </SubMenu>
          <SubMenu className="menu" label="Test" icon={<WalletRoundedIcon />}>
            <MenuItem className="submenu" icon={<QuizIcon />} component={<Link to="/all-tests" />}>
              All Test
            </MenuItem>
            <MenuItem className="submenu" icon={<NoteAddIcon />} component={<Link to="/add-test" />}>
              Add New Test
            </MenuItem>
          </SubMenu>
          <SubMenu
            className="menu"
            label="Admin"
            icon={<AdminPanelSettingsIcon />}
          >
            <MenuItem className="submenu" icon={<AccountBoxIcon />} component={<Link to="/all-admin" />}>
              All Admins
            </MenuItem>
            <MenuItem className="submenu" icon={<PersonAddIcon />} component={<Link to="/add-admin" />}>
              Add Admin
            </MenuItem>
          </SubMenu>
          <SubMenu
            className="menu"
            label="Settings"
            icon={<SettingsApplicationsRoundedIcon />}
          >
            <MenuItem component={<Link to="/admin-profile" />} className="submenu" icon={<AccountCircleRoundedIcon />}>
              Account
            </MenuItem>
            <MenuItem className="submenu" icon={<ShieldRoundedIcon />}>
              Privacy
            </MenuItem>
          </SubMenu>
          <MenuItem
            className="menu"
            icon={<LogoutRoundedIcon />}
            onClick={handleLogout}
          >
            Logout
          </MenuItem>
        </Menu>
      </Sidebar>
    </>
  );
}

export default Sidebarr;
