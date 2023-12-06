const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const cors = require("cors");
const AuthenticateAdmin = require("../../middleware/adminAuth");

require("../../db/conn");
const User = require("../../model/userSchema");

router.use(cors());

// Get All Student
router.get("/all-students", AuthenticateAdmin, async (req, res) => {
  try {
    const students = await User.find();
    res.status(200).json({ students });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

//Delete The Student
router.delete("/delete-student/:id", AuthenticateAdmin, async (req, res) => {
  try {
    const student = await User.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    await student.remove();
    res.status(200).json({ message: "Student deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
