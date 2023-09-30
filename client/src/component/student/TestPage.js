import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function TestPage() {
  const [userData, setUserData] = useState({});
  const { testId } = useParams(); 
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [totalMarks, setTotalMarks] = useState(0);

  // Track the number of times the student exits fullscreen mode
  const [exitFullscreenCount, setExitFullscreenCount] = useState(0);

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
      // Student exited fullscreen mode
      setExitFullscreenCount((prevCount) => prevCount + 1);

      // Show a popup alert
      window.confirm("You exited fullscreen mode. Click OK to re-enter fullscreen mode.");

      if (exitFullscreenCount >= 0) {
        handleLogout();
      }
    }
  };

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
        testId: testId, // Ensure testId is correctly provided
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
      } else {
        throw new Error("Failed to submit test");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchQuestions();
    callStudentDashboardPage();

    // Add a fullscreen change event listener
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    // Automatically enter fullscreen mode when the component loads
    enterFullscreen();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Test Page</h2>
      <h1>Student Test Page</h1>
      <p>Test ID: {testId}</p>

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
    </div>
  );
}

export default TestPage;
