import React from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Link } from "react-router-dom";

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
      <Sidebar>
        <h3 className="text-center pt-3 pb-3">Smart Exam</h3>
        <Menu
          transitionDuration={800}
          renderExpandIcon={({ open }) => <span>{open ? "-" : "+"}</span>}
        >
          <MenuItem component={<Link to="/admin-dashbord" />}>
            Dashbord
          </MenuItem>
          <SubMenu label="Student">
            <MenuItem component={<Link to="/all-student" />}> All Students</MenuItem>
            <MenuItem component={<Link to="/add-student" />}> Add Student</MenuItem>
          </SubMenu>
          <SubMenu label="Test">
            <MenuItem component={<Link to="/all-tests" />}> All Test</MenuItem>
            <MenuItem component={<Link to="/add-test" />}> Add New Test</MenuItem>
          </SubMenu>
          <SubMenu label="Admin">
            <MenuItem component={<Link to="/all-admin" />}> All Admins</MenuItem>
            <MenuItem component={<Link to="/add-admin" />}> Add Admin</MenuItem>
          </SubMenu>
          <MenuItem component={<Link to="/admin-profile" />}>
            Profile
          </MenuItem>
          <MenuItem>
            <button onClick={handleLogout} className="nav-link btn btn-link">
              Logout
            </button>
          </MenuItem>
        </Menu>
      </Sidebar>
    </>
  );
}

export default Sidebarr;
