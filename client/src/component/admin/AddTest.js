import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
      <div style={{ display: "flex", height: "100vh", minHeight: "400px" }}>
        <Sidebar />
        <main style={{ padding: 10 }}>
          <h1>Add Test</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="subjectName">Subject Name</label>
              <input
                type="text"
                id="subjectName"
                name="subjectName"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label htmlFor="subjectCode">Subject Code</label>
              <input
                type="text"
                id="subjectCode"
                name="subjectCode"
                value={subjectCode}
                onChange={(e) => setSubjectCode(e.target.value)}
                className="form-control"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Add Test
            </button>
          </form>
        </main>
      </div>
    </>
  );
}

export default AddTest;
