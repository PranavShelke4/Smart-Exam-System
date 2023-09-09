import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import "../../Style/Admin/AllStudent.css";

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
    <div className="allstudent">
      <Sidebar />
      <main style={{ width: "100%" }}>
        <h3 className="table-heading">All Students</h3>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="allStudentList">
            <table className="table">
              <thead className="allStudentThead">
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
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

export default AllStudent;
