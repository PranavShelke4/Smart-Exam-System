import { React, useEffect, useState } from "react";
import "../../Style/Admin/AllDataCards.css";

function AllDataCard() {
  const [tests, setTests] = useState([]);
  const [Allstudents, setAllStudents] = useState([]);
  const [AllAdmins, setAllAdmins] = useState([]);
  const [submittedStudentsCount, setSubmittedStudentsCount] = useState(0);

  // Get total count of students
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
        setAllStudents(data.students);
      } else {
        throw new Error("Failed to fetch student data");
      }
    } catch (err) {
      console.log("Error:", err);
    }
  };

  // Get count of students who submitted a test
  const fetchSubmittedStudentsCount = async (testId) => {
    try {
      const res = await fetch(`/submitted-students-count/${testId}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies
      });

      if (res.status === 200) {
        const data = await res.json();
        setSubmittedStudentsCount(data.submittedStudentsCount);
      } else {
        throw new Error("Failed to fetch submitted students count");
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Get total count of tests
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
        setTests(data);
      } else {
        throw new Error("Failed to fetch tests");
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Fetch total count of Admins
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
        setAllAdmins(data.admins);
      } else {
        throw new Error("Failed to fetch admin data");
      }
    } catch (err) {
      console.log("Error:", err);
    }
  };

  useEffect(() => {
    fetchTests();
    fetchAllStudents();
    fetchAllAdmins();
    if (tests.length > 0) {
      const testId = tests[0]._id;
      fetchSubmittedStudentsCount(testId);
    }
  }, [tests]);

  return (
    <>
      <div className="Data-Cards">
        <div className="datacard">
          <h5 className="card-title">Total Students</h5>
          <br />
          <p className="card-text">
            <h2>{Allstudents.length}</h2>
          </p>
        </div>
        <div className="datacard">
          <h5 className="card-title">Students Who Submitted Test</h5>
          <br />
          <p className="card-text">
            <h2>{submittedStudentsCount}</h2>
          </p>
        </div>
        <div className="datacard">
          <h5 className="card-title">Remaining Students</h5>
          <br />
          <p className="card-text">
            <h2>{Allstudents.length - submittedStudentsCount}</h2>
          </p>
        </div>
        <div className="datacard">
          <h5 className="card-title">Total Tests</h5>
          <br />
          <p className="card-text">
            <h2>{tests.length}</h2>
          </p>
        </div>
        <div className="datacard">
          <h5 className="card-title">Total Admins</h5>
          <br />
          <p className="card-text">
            <h2>{AllAdmins.length}</h2>
          </p>
        </div>
      </div>
    </>
  );
}

export default AllDataCard;
