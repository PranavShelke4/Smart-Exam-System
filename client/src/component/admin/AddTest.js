import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Sidebar from "./Sidebar";

function AddTest() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const [subjectName, setSubjectName] = useState("");
  const [subjectCode, setSubjectCode] = useState("");

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/add-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subjectName,
          subjectCode,
        }),
      });

      if (res.status === 200) {
        // Test added successfully
        navigate("/all-tests"); // Redirect to all tests page
      } else {
        // Handle error
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    callAdminDashbordPage();
  }, []);

  return (
    <>
      <div className="add-student-container">
        <Sidebar />
        <main style={{ width: "100%" }}>
          <h3 className="table-heading">Add Test</h3>
          <form className="add-student-form" onSubmit={handleSubmit}>
            <TextField
              label="Subject Name"
              type="text"
              id="subjectName"
              name="subjectName"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              className="form-control"
              margin="normal"
              required
            />

            <TextField
              label="Subject Code"
              type="text"
              id="subjectCode"
              name="subjectCode"
              value={subjectCode}
              onChange={(e) => setSubjectCode(e.target.value)}
              className="form-control"
              margin="normal"
              required
            />

            <Button fullWidth style={{color: "white"}} className="add-student-btn" type="submit">
              Add Test
            </Button>
          </form>
        </main>
      </div>
    </>
  );
}

export default AddTest;
