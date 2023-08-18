import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Table from "react-bootstrap/Table";

function AllAdmin() {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllAdmins = async () => {
    try {
      const res = await fetch("/all-admins", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
        credentials: "include",
      });

      if (res.status === 200) {
        const data = await res.json();
        setAdmins(data.admins);
      } else if (res.status === 401) {
        navigate("/admin-login");
      } else {
        throw new Error("Failed to fetch admin data");
      }
    } catch (err) {
      console.log("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAdmins();
  }, []);

  const handleDelete = async (adminId) => {
    try {
      const res = await fetch(`/delete-admin/${adminId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.status === 200) {
        // Refresh the admin list
        fetchAllAdmins();
        window.alert("Admin Delete Successful");
      } else if (res.status === 400) {
        const data = await res.json();
        window.alert(data.message);
      } else {
        throw new Error("Failed to delete admin");
      }
    } catch (err) {
      console.log("Error:", err);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", minHeight: "400px" }}>
      <Sidebar />
      <main style={{ padding: 10 }}>
        <div className="container mt-4">
          <h1>All Admins</h1>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Sr No</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone Number</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin, index) => (
                  <tr key={admin._id}>
                    <td>{index + 1}</td>
                    <td>{admin.name}</td>
                    <td>{admin.email}</td>
                    <td>{admin.number}</td>
                    <td>
                      <button
                        onClick={() => handleDelete(admin._id)}
                        className="btn btn-danger"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      </main>
    </div>
  );
}

export default AllAdmin;
