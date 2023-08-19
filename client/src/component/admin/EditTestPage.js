import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function EditTestPage() {
  const { testId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [options, setOptions] = useState([]);
  const [currentOption, setCurrentOption] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");

  const handleAddQuestion = () => {
    setQuestions([...questions, { question: currentQuestion, options, correctAnswer }]);
    setCurrentQuestion("");
    setOptions([]);
    setCorrectAnswer("");
  };

  const handleAddOption = () => {
    setOptions([...options, currentOption]);
    setCurrentOption("");
  };

  const handleUpdateCorrectAnswer = (option) => {
    setCorrectAnswer(option);
  };

  const handleSaveChanges = async () => {
    try {
      const res = await fetch(`/update-test/${testId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questions: questions,
        }),
      });
  
      console.log("Response status:", res.status);
  
      if (res.status === 200) {
        // Handle success
        window.alert("Test updated successfully");
      } else {
        throw new Error("Failed to update test");
      }
    } catch (err) { 
      console.log("Error:", err);
      // Handle error
    }
  };
  

  return (
    <div className="container mt-5">
      <h2>Edit Test</h2>
      <div>
        <h4>Questions:</h4>
        <ul>
          {questions.map((q, index) => (
            <li key={index}>{q.question}</li>
          ))}
        </ul>
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
              disabled={options.length >= 3}
            >
              Add Option
            </Button>
          </Form.Group>
          <Form.Group>
            <Form.Label>Correct Answer:</Form.Label>
            <Form.Control
              type="text"
              value={correctAnswer}
              readOnly
            />
          </Form.Group>
          <Button variant="primary" onClick={handleAddQuestion}>
            Add Question
          </Button>
        </Form>
      </div>
      <div>
        <Button variant="success" onClick={handleSaveChanges}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}

export default EditTestPage;
