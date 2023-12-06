const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const cors = require("cors");
const AuthenticateAdmin = require("../../middleware/adminAuth");

require("../../db/conn");
const Admin = require("../../model/adminSchema");
const Test = require("../../model/testModel");
const TestSubmission = require("../../model/testSubmissionModel");

router.use(cors());

// Get count of students who submitted a test
router.get(
  "/submitted-students-count/:testId",
  AuthenticateAdmin,
  async (req, res) => {
    try {
      const testId = req.params.testId;

      const submittedStudentsCount = await TestSubmission.countDocuments({
        testId,
      });

      res.status(200).json({ submittedStudentsCount });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Get All Admin
router.get("/all-admins", AuthenticateAdmin, async (req, res) => {
  try {
    const allAdmins = await Admin.find();
    res.status(200).json({ admins: allAdmins });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server Error" });
  }
});

// Fetch all tests with subject name, subject code, and test id
router.get("/get-all-tests", async (req, res) => {
  try {
    const tests = await Test.find({}, "_id subjectName subjectCode"); // Include _id for test id
    res.status(200).json(tests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch tests" });
  }
});

// Fetch all tests Mark
router.get("/test-result", async (req, res) => {
  try {
    const test_result = await TestSubmission.find(
      {},
      "_id testId studentId studentName totalMarks"
    ); // Include _id for test id
    res.status(200).json(test_result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch tests result" });
  }
});

// Fetch test details by testId
router.get("/get-test-details/:testId", async (req, res) => {
  const testId = req.params.testId;

  try {
    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    res.status(200).json({
      subjectName: test.subjectName,
      subjectCode: test.subjectCode,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete TestSubmission by ID
router.delete(
  "/delete-test-submission/:id",
  AuthenticateAdmin,
  async (req, res) => {
    try {
      const testSubmissionId = req.params.id;

      // Find the test submission
      const testSubmission = await TestSubmission.findById(testSubmissionId);
      if (!testSubmission) {
        return res.status(404).json({ message: "Test submission not found" });
      }

      // Delete the test submission
      await testSubmission.remove();

      res.status(200).json({ message: "Test submission deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
