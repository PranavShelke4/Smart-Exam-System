import React from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Link } from "react-router-dom";
import "../../Style/Admin/Sidebar.css";

import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import ReceiptRoundedIcon from "@mui/icons-material/ReceiptRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import TimelineRoundedIcon from "@mui/icons-material/TimelineRounded";
import BubbleChartRoundedIcon from "@mui/icons-material/BubbleChartRounded";
import WalletRoundedIcon from "@mui/icons-material/WalletRounded";
import MonetizationOnRoundedIcon from "@mui/icons-material/MonetizationOnRounded";
import SettingsApplicationsRoundedIcon from "@mui/icons-material/SettingsApplicationsRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

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
      <Sidebar className="app">
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
          >
            Dashboard
          </MenuItem>
          <MenuItem icon={<ReceiptRoundedIcon />}> Invoices </MenuItem>
          <SubMenu label="Student" icon={<BarChartRoundedIcon />}>
            <MenuItem
              component={<Link to="/all-student" />}
              icon={<TimelineRoundedIcon />}
            >
              All Students
            </MenuItem>
            <MenuItem
              component={<Link to="/add-student" />}
              icon={<BubbleChartRoundedIcon />}
            >
              Add Student
            </MenuItem>
          </SubMenu>
          <SubMenu label="Test" icon={<WalletRoundedIcon />}>
            <MenuItem component={<Link to="/all-tests" />}> All Test</MenuItem>
            <MenuItem component={<Link to="/add-test" />}>
              Add New Test
            </MenuItem>
          </SubMenu>
          <SubMenu label="Admin" icon={<SettingsApplicationsRoundedIcon />}>
            <MenuItem component={<Link to="/all-admin" />}>
              All Admins
            </MenuItem>
            <MenuItem component={<Link to="/add-admin" />}> Add Admin</MenuItem>
          </SubMenu>
          <MenuItem
            component={<Link to="transactions" className="link" />}
            icon={<MonetizationOnRoundedIcon />}
          >
            Transactions
          </MenuItem>
          <SubMenu label="Settings" icon={<SettingsApplicationsRoundedIcon />}>
            <MenuItem icon={<AccountCircleRoundedIcon />}> Account </MenuItem>
            <MenuItem icon={<ShieldRoundedIcon />}> Privacy </MenuItem>
            <MenuItem icon={<NotificationsRoundedIcon />}>
              Notifications
            </MenuItem>
          </SubMenu>
          <MenuItem icon={<LogoutRoundedIcon />} onClick={handleLogout}>
            Logout
          </MenuItem>
        </Menu>
      </Sidebar>
    </>
  );
}

export default Sidebarr;
