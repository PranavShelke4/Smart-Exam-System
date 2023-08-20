import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Sidebar from "./Sidebar";

function EditTestPage() {
  const { testId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [options, setOptions] = useState([]);
  const [currentOption, setCurrentOption] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [editingQuestionIndex, setEditingQuestionIndex] = useState(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await fetch(`/get-test/${testId}`);
      if (res.status === 200) {
        const data = await res.json();
        setQuestions(data.questions);
      } else {
        throw new Error("Failed to fetch questions");
      }
    } catch (err) {
      console.log("Error:", err);
    }
  };

  const handleEditQuestion = (questionIndex) => {
    const editedQuestion = questions[questionIndex];
    setCurrentQuestion(editedQuestion.question);
    setOptions(editedQuestion.options);
    setCorrectAnswer(editedQuestion.correctAnswer);
    setEditingQuestionIndex(questionIndex);
  };

  const handleUpdateQuestion = () => {
    if (editingQuestionIndex !== null) {
      const updatedQuestions = [...questions];
      updatedQuestions[editingQuestionIndex] = {
        question: currentQuestion,
        options,
        correctAnswer,
      };
      setQuestions(updatedQuestions);
      setCurrentQuestion("");
      setOptions([]);
      setCorrectAnswer("");
      setEditingQuestionIndex(null);
    }
  };

  const handleDeleteQuestion = (questionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(questionIndex, 1);
    setQuestions(updatedQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { question: currentQuestion, options, correctAnswer },
    ]);
    setCurrentQuestion("");
    setOptions([]);
    setCorrectAnswer("");
    setEditingQuestionIndex(null);
  };

  const handleAddOption = () => {
    setOptions([...options, currentOption]);
    setCurrentOption("");
  };

  const handleUpdateCorrectAnswer = (option) => {
    setCorrectAnswer(option);
  };

  const handleSaveAllQuestions = async () => {
    try {
      const res = await fetch(`/save-all-questions/${testId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questions: questions,
        }),
      });

      if (res.status === 200) {
        // Handle success
        window.alert("All questions saved successfully");
      } else {
        throw new Error("Failed to save questions");
      }
    } catch (err) {
      console.log("Error:", err);
      // Handle error
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", minHeight: "400px" }}>
      <Sidebar />
      <main style={{ padding: 10 }}>
        <div className="container mt-5">
          <h2>Edit Test</h2>
          <div>
            <div>
              <h4>Preview and Edit Questions:</h4>
              <ul>
                {questions.map((q, index) => (
                  <li key={index}>
                    <p>Question: {q.question}</p>
                    <p>Options: {q.options.join(", ")}</p>
                    <p>Correct Answer: {q.correctAnswer}</p>
                    <Button
                      variant="outline-primary"
                      onClick={() => handleEditQuestion(index)}
                    >
                      Edit
                    </Button>{" "}
                    <Button
                      variant="outline-danger"
                      onClick={() => handleDeleteQuestion(index)}
                    >
                      Delete
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
            <Form>
              <Form.Group>
                <Form.Label>Question:</Form.Label>
                <Form.Control
                  type="text"
                  value={currentQuestion}
                  onChange={(e) => setCurrentQuestion(e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Options (Max 4):</Form.Label>
                {options.map((option, index) => (
                  <div key={index}>
                    <Form.Control type="text" value={option} readOnly />
                    <Button
                      variant="outline-success"
                      onClick={() => handleUpdateCorrectAnswer(option)}
                    >
                      Set Correct
                    </Button>
                  </div>
                ))}
                <Form.Control
                  type="text"
                  value={currentOption}
                  onChange={(e) => setCurrentOption(e.target.value)}
                />
                <Button
                  variant="outline-primary"
                  onClick={handleAddOption}
                  disabled={options.length >= 4}
                >
                  Add Option
                </Button>
              </Form.Group>
              <Form.Group>
                <Form.Label>Correct Answer:</Form.Label>
                <Form.Control type="text" value={correctAnswer} readOnly />
              </Form.Group>
              <Button variant="primary" onClick={handleAddQuestion}>
                Add Question
              </Button>{" "}
              <Button variant="success" onClick={handleSaveAllQuestions}>
                Save All Questions
              </Button>{" "}
              <Button
                variant="info"
                onClick={handleUpdateQuestion}
                disabled={editingQuestionIndex === null}
              >
                Update
              </Button>{" "}
            </Form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default EditTestPage;
