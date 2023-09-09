import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import {
  TextField,
  Button,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Typography,
  Paper,
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Grid,
  Container,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import "../../Style/Admin/EditTestPage.css";

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
    <div className="containers">
      <Sidebar />
      <main className="main">
        <Container maxWidth="lg" className="main-container">
          <Paper elevation={3} style={{ padding: "20px" }}>
            <Typography variant="h5" align="center">
              Edit Test
            </Typography>
            <div>
              <Typography variant="h6">Preview and Edit Questions:</Typography>
              <List>
                {questions.map((q, index) => (
                  <ListItem key={index} alignItems="flex-start">
                    <ListItemText
                      primary={`Question: ${q.question}`}
                      secondary={
                        <div>
                          <span>Options: {q.options.join(", ")}</span>
                          <div style={{ marginTop: "10px" }}>
                            Correct Answer: <b>{q.correctAnswer}</b>
                          </div>
                        </div>
                      }
                    />
                    <Grid container justifyContent="flex-end">
                      <IconButton
                        color="primary"
                        onClick={() => handleEditQuestion(index)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="secondary"
                        onClick={() => handleDeleteQuestion(index)}
                      >
                        <DeleteForeverIcon />
                      </IconButton>
                    </Grid>
                  </ListItem>
                ))}
              </List>
            </div>
            <form>
              <TextField
                label="Question"
                variant="outlined"
                fullWidth
                value={currentQuestion}
                onChange={(e) => setCurrentQuestion(e.target.value)}
                style={{ marginBottom: "10px" }}
              />
              <div>
                <Typography variant="subtitle1">Options (Max 4):</Typography>
                {options.map((option, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <TextField
                      type="text"
                      value={option}
                      variant="outlined"
                      fullWidth
                      InputProps={{ readOnly: true }}
                    />
                    <IconButton
                      color="primary"
                      onClick={() => handleUpdateCorrectAnswer(option)}
                      style={{ marginLeft: "10px" }}
                    >
                      Set Correct
                    </IconButton>
                  </div>
                ))}
                <TextField
                  type="text"
                  value={currentOption}
                  variant="outlined"
                  fullWidth
                  onChange={(e) => setCurrentOption(e.target.value)}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddOption}
                  disabled={options.length >= 4}
                  style={{ marginTop: "10px" }}
                >
                  Add Option
                </Button>
              </div>
              <FormControl
                variant="outlined"
                fullWidth
                style={{ marginTop: "10px" }}
              >
                <InputLabel>Correct Answer</InputLabel>
                <Select
                  value={correctAnswer}
                  onChange={(e) => setCorrectAnswer(e.target.value)}
                  label="Correct Answer"
                >
                  {options.map((option, index) => (
                    <MenuItem key={index} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddQuestion}
                style={{ marginTop: "10px" }}
              >
                Add Question
              </Button>{" "}
              <Button
                variant="contained"
                color="success"
                onClick={handleSaveAllQuestions}
                style={{ marginTop: "10px" }}
              >
                Save All Questions
              </Button>{" "}
              <Button
                variant="contained"
                color="info"
                onClick={handleUpdateQuestion}
                disabled={editingQuestionIndex === null}
                style={{ marginTop: "10px" }}
              >
                Update
              </Button>{" "}
            </form>
          </Paper>
        </Container>
      </main>
    </div>
  );
}

export default EditTestPage;
