import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

function Dashbord() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const [tests, setTests] = useState([]);

  const callStudentDashbordPage = async () => {
    try {
      const res = await fetch("/student-dashbord", {
        method: "GET",
        headers: {
          Accept: "appllication/json",
          "Content-type": "application/json",
        },
        credentials: "include", // Add this line to include cookies
      });

      const data = await res.json();
      console.log(data);
      setUserData(data);

      if (!res.status === 200) {
        const error = new Error(res.error);
        throw error;
      }
    } catch (err) {
      console.log(err);
      navigate("/login");
    }
  };

  const fetchTests = async () => {
    try {
      const res = await fetch("/get-all-tests", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies
      });

      if (res.status === 200) {
        const data = await res.json();
        console.log("Fetched Tests Data:", data); // Add this line to check the data
        setTests(data);
      } else {
        throw new Error("Failed to fetch tests");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    callStudentDashbordPage();
    fetchTests();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2 className="mb-4">Dashboard</h2>
        <div className="row">
          {tests.map((test) => (
            <div key={test._id} className="col-md-4 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{test.subjectName}</h5>
                  <p className="card-text">Subject Code: {test.subjectCode}</p>
                  <p className="card-text">Total Questions: 30</p>
                  <p className="card-text">Test Time: 60 min</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate(`/start-test/${test._id}`)} // Use test._id here
                  >
                    Start Test
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Dashbord;
