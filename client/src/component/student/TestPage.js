import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FaceDetection from "./FaseDetection";
import "../../Style/Student/ExamPage.css";

function TestPage() {
  const [userData, setUserData] = useState({});
  const { testId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [totalMarks, setTotalMarks] = useState(0);
  const [exitFullscreenCount, setExitFullscreenCount] = useState(0);
  const [showWarning, setShowWarning] = useState(false);

  const callStudentDashboardPage = async () => {
    try {
      const res = await fetch("/student-dashbord", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (res.status === 200) {
        const data = await res.json();
        setUserData(data);
      } else {
        navigate("/login");
      }
    } catch (err) {
      console.log(err);
      navigate("/login");
    }
  };

  const fetchQuestions = async () => {
    try {
      const res = await fetch(`/get-test/${testId}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (res.status === 200) {
        const data = await res.json();
        setQuestions(data.questions);
        setSelectedAnswers({});
      } else {
        throw new Error("Failed to fetch questions");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleAnswerSelect = (questionId, selectedOption) => {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: selectedOption,
    }));
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/logout", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
        credentials: "include",
      });

      if (res.status === 200) {
        window.location.href = "/login";
        window.location.reload();
      } else {
        const error = new Error("Failed to logout");
        throw error;
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleFullscreenChange = () => {
    if (!document.fullscreenElement) {
      setExitFullscreenCount((prevCount) => prevCount + 1);
      setShowWarning(true);
    }
    if(exitFullscreenCount >= 5){
      // handleLogout();
      // handleSubmit();
    }
  };

  useEffect(() => {
    if (exitFullscreenCount >= 5) {
      handleLogout();
    }
  }, [exitFullscreenCount]);
  

  const enterFullscreen = () => {
    const element = document.documentElement;

    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  };

  const handleSubmit = async () => {
    try {
      let marks = 0;

      for (const question of questions) {
        const selectedAnswer = selectedAnswers[question._id];
        if (selectedAnswer === question.correctAnswer) {
          marks += 1;
        }
      }

      setTotalMarks(marks);

      const requestBody = {
        testId: testId, 
        studentId: userData._id,
        studentName: userData.name,
        totalMarks: marks,
      };

      const res = await fetch("/submit-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (res.status === 200) {
        console.log("Test submitted successfully");
        alert("Test submitted successfully");
        navigate("/student-dashbord");
      } else {
        throw new Error("Failed to submit test");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleReenterFullscreen = () => {
    enterFullscreen();
    setShowWarning(false);
  };

  useEffect(() => {
    fetchQuestions();
    callStudentDashboardPage();
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    enterFullscreen();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Test Page</h2>
      <h1>Student Test Page</h1>
      <p>Test ID: {testId}</p>
      <FaceDetection />

      {questions.map((question) => (
        <div key={question._id} className="mb-4">
          <h5>{question.question}</h5>
          <ul>
            {question.options.map((option) => (
              <li key={option}>
                <label>
                  <input
                    type="radio"
                    value={option}
                    checked={selectedAnswers[question._id] === option}
                    onChange={() => handleAnswerSelect(question._id, option)}
                  />
                  {option}
                </label>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <button className="btn btn-primary" onClick={handleSubmit}>
        Submit Test
      </button>

      <p>Total Marks: {totalMarks}</p>

      {/* Warning div for exiting fullscreen */}
      {showWarning && (
        <div className="fullscreen-warning">
          <p>Warning: You've exited fullscreen mode {exitFullscreenCount} time</p>
          <p>If You Exit More thene 5 time your exam will be submit automaticly</p>
          <button className="btn btn-primary" onClick={handleReenterFullscreen}>
            Re-enter Fullscreen
          </button>
        </div>
      )}
    </div>
  );
}

export default TestPage;
