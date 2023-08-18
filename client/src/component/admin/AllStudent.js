import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Table from "react-bootstrap/Table";

function AllStudent() {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllStudents = async () => {
    try {
      const res = await fetch("/all-students", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
        credentials: "include",
      });

      if (res.status === 200) {
        const data = await res.json();
        setStudents(data.students);
      } else {
        throw new Error("Failed to fetch student data");
      }
    } catch (err) {
      console.log("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllStudents();
  }, []);

  const handleDelete = async (studentId) => {
    try {
      const res = await fetch(`/delete-student/${studentId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.status === 200) {
        // Refresh the student list
        fetchAllStudents();
        window.alert("Student Delete Successful");
      } else {
        throw new Error("Failed to delete student");
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
          <h1>All Students</h1>
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
                {students.map((student, index) => (
                  <tr key={student._id}>
                    <td>{index + 1}</td>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td>{student.number}</td>
                    <td>
                      <button
                        onClick={() => handleDelete(student._id)}
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

export default AllStudent;
