import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";

function AllTest() {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllTests = async () => {
    try {
      const res = await fetch("/all-test", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
        credentials: "include",
      });

      if (res.status === 200) {
        const data = await res.json();
        setTests(data.tests);
      } else if (res.status === 401) {
        navigate("/admin-login");
      } else {
        throw new Error("Failed to fetch test data");
      }
    } catch (err) {
      console.log("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTests();
  }, []);

  const handleDelete = async (testId) => {
    try {
      const res = await fetch(`/delete-test/${testId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.status === 200) {
        // Refresh the student list
        fetchAllTests();
        window.alert("Test Delete Successful");
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
          <h1>All Tests</h1>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Sr No</th>
                  <th>Subject Name</th>
                  <th>Subject Code</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {tests.map((test, index) => (
                  <tr key={test._id}>
                    <td>{index + 1}</td>
                    <td>{test.subjectName}</td>
                    <td>{test.subjectCode}</td>
                    <td>
                      <button
                        onClick={() => handleDelete(test._id)}
                        className="btn btn-danger"
                      >
                        Delete
                      </button>
                      <Link
                        to={`/edit-test/${test._id}`}
                        className="btn btn-primary"
                      >
                        Edit
                      </Link>
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

export default AllTest;
