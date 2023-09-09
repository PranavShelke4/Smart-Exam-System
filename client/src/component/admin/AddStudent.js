import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import "../../Style/Admin/AddStudent.css";

function AddStudent() {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({});

  const [user, setUser] = useState({
    name: "",
    email: "",
    number: "",
    password: "",
    cpassword: "",
  });

  let name, value;

  const callAdminDashboardPage = async () => {
    try {
      const res = await fetch("/admin-dashbord", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
        credentials: "include",
      });

      console.log("Response status:", res.status);

      if (res.status === 200) {
        const data = await res.json();
        console.log("Data:", data);
        setUserData(data);
      } else if (res.status === 401) {
        navigate("/admin-login");
      } else {
        throw new Error("Failed to fetch admin dashboard");
      }
    } catch (err) {
      console.log("Error:", err);
    }
  };

  useEffect(() => {
    callAdminDashboardPage();
  }, []);

  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;

    setUser({ ...user, [name]: value });
  };

  const postData = async (e) => {
    e.preventDefault();

    const { name, email, number, password, cpassword } = user;

    const resp = await fetch("/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        email: email,
        number: number,
        password: password,
        cpassword: cpassword,
      }),
    });

    const data = await resp.json();

    console.log(data);

    if (resp.status === 422 || !data) {
      window.alert("Invalid Registration");
      console.log("Invalid Registration");
    } else {
      window.alert("Registration Successful");
      console.log("Registration Successful");

      navigate("/all-student");
    }
  };

  return (
    <div className="add-student-container">
      <Sidebar />
      <main style={{ width: "100%" }}>
        <h3 className="table-heading">Add Student</h3>
        <form className="add-student-form" method="POST">
          <TextField
            label="Student Name"
            variant="outlined"
            className="TextField"
            name="name"
            value={user.name}
            onChange={handleInputs}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Student Email address"
            variant="outlined"
            className="TextField"
            name="email"
            value={user.email}
            onChange={handleInputs}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Phone No."
            variant="outlined"
            className="TextField"
            name="number"
            value={user.number}
            onChange={handleInputs}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Password"
            variant="outlined"
            className="TextField"
            type="password"
            name="password"
            value={user.password}
            onChange={handleInputs}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Confirm Password"
            variant="outlined"
            className="TextField"
            type="password"
            name="cpassword"
            value={user.cpassword}
            onChange={handleInputs}
            fullWidth
            margin="normal"
            required
          />
          <Button
            variant="contained"
            onClick={postData}
            fullWidth
            className="add-student-btn"
            type="submit"
          >
            Add Student
          </Button>
        </form>
      </main>
    </div>
  );
}

export default AddStudent;
