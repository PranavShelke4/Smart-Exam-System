import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

function Dashbord() {

  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const [tests, setTests] = useState([]);
  const [testResult, settestResult] = useState([]);
  const [dynamicData, setDynamicData] = useState({});
  const [viewScoreClicked, setViewScoreClicked] = useState(false);
  const [whoClicked, setWhoClicked] = useState();

  let found = false;
  let fdata;

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
        setTests(data);
      } else {
        throw new Error("Failed to fetch tests");
      }
    } catch (err) {
      console.log(err);
    }
  };

  //fetch marks
  const fetchMarks = async () => {
    try {
      const res = await fetch("/test-result", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies
      });



      if (res.status === 200) {
        const data = await res.json();
        settestResult(data);
      } else {
        throw new Error("Failed to fetch tests");
      }
    } catch (err) {
      console.log(err);
    }
  };



  const handleViewScoreClick = (value) => {
    setViewScoreClicked(true);
    console.log("who clicked = ", value)
    setWhoClicked(value)
  };



  const addKeyValuePair = (key, value) => {
    setDynamicData(prevData => ({
      ...prevData,
      [key]: value,
    }));
  };

  useEffect(() => {
    callStudentDashbordPage();
    fetchTests();
    fetchMarks();

    testResult.forEach(singleTest => {
      if (userData._id === singleTest.studentId) {
        addKeyValuePair(singleTest.testId, singleTest.totalMarks);
      }
    });
  }, [testResult]);


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

                  {testResult.map(singleTest => {
                    if (userData._id === singleTest.studentId && singleTest.testId === test._id) {
                      found = true;
                      fdata = singleTest.testId;
                    }
                  })}

                  {found === true ? (
                    <div>

                      <button
                        className="btn btn-primary mb-2"
                        onClick={() => handleViewScoreClick(test._id)}
                      >
                        View Score
                      </button>

                      {(viewScoreClicked && test._id == fdata) && (
                        <p>Your score is {dynamicData[test._id]}</p>
                      )}
                    </div>

                  ) : (
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate(`/start-test/${test._id}`)}
                    >
                      Start Test
                    </button>
                  )}
                  {found = false}
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* {viewScoreClicked && ( <p>Your score is {dynamicData[whoClicked]}</p>)} */}

      </div>
    </>
  );
}

export default Dashbord;
