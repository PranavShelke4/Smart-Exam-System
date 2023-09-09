import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
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
    <div className="allstudent">
      <Sidebar />
      <main style={{ width: "100%" }}>
        <h3 className="table-heading">All Tests</h3>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="allStudentList">
         <table className="table">
              <thead className="allStudentThead">
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
                      className="btn"
                      style={{backgroundColor: "#020a25", color: "white", margin: "0% 5%"}}
                    >
                      Edit
                    </Link>
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

export default AllTest;
