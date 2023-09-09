import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

function Signup() {
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

  const callAdminDashbordPage = async () => {
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
    callAdminDashbordPage();
  }, []);

  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;

    setUser({ ...user, [name]: value });
  };

  const postData = async (e) => {
    e.preventDefault();

    const { name, email, number, password, cpassword } = user;

    const resp = await fetch("/admin-signup", {
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
      window.alert("Admin Registration Successful");
      console.log("Registration Successful");

      navigate("/all-admin");
    }
  };

  return (
    <div className="add-student-container">
      <Sidebar />
      <main style={{ width: "100%" }}>
        <h3 className="table-heading">Add Admin</h3>
        <form className="add-student-form" method="POST">
          <TextField
          label="Admin Name"
            type="text"
            name="name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={user.name}
            onChange={handleInputs}
            
          />

          <TextField
            type="email"
            name="email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={user.email}
            onChange={handleInputs}
            label="Admin Email address"
          />

          <TextField
            type="number"
            name="number"
            variant="outlined"
            fullWidth
            margin="normal"
            value={user.number}
            onChange={handleInputs}
            label="Phone No."
          />

          <TextField
            type="password"
            name="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={user.password}
            onChange={handleInputs}
            label="Password"
          />

          <TextField
            type="password"
            name="cpassword"
            variant="outlined"
            fullWidth
            margin="normal"
            value={user.cpassword}
            onChange={handleInputs}
            label="Confirm Password"
          />

          <Button
            type="submit"
            onClick={postData}
            variant="contained"
            fullWidth
            margin="normal"
            className="add-student-btn"

          >
            Add Admin
          </Button>
        </form>
      </main>
    </div>
  );
}

export default Signup;
