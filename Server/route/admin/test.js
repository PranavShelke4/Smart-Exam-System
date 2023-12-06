const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const cors = require("cors");
const AuthenticateAdmin = require("../../middleware/adminAuth");

require("../../db/conn");
const Test = require("../../model/testModel");

router.use(cors());

// Get All Test
router.get("/all-test", AuthenticateAdmin, async (req, res) => {
  try {
    const allTests = await Test.find();
    res.status(200).json({ tests: allTests });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server Error" });
  }
});

//Delete The Test
router.delete("/delete-test/:id", AuthenticateAdmin, async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) {
      return res.status(404).json({ message: "test not found" });
    }

    await test.remove();
    res.status(200).json({ message: "test deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

//Add Test
router.post("/add-test", AuthenticateAdmin, async (req, res) => {
  const { subjectName, subjectCode } = req.body;

  if (!subjectName || !subjectCode) {
    return res
      .status(400)
      .json({ error: "Please provide subject details and questions" });
  }

  try {
    const newTest = new Test({
      subjectName,
      subjectCode,
    });

    await newTest.save();

    res.status(200).json({ message: "Test added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Fetch questions for a specific test
router.get("/get-test/:testId", async (req, res) => {
  const testId = req.params.testId;

  try {
    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    res.status(200).json({ questions: test.questions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Save all questions for a test
router.post("/save-all-questions/:testId", async (req, res) => {
  try {
    const testId = req.params.testId;
    const { questions } = req.body;

    const updatedTest = await Test.findByIdAndUpdate(
      testId,
      {
        questions: questions,
      },
      { new: true }
    );

    res.status(200).json({ test: updatedTest });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;
