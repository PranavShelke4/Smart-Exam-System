const mongoose = require("mongoose");

const testSubmissionSchema = new mongoose.Schema({
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  studentName: {
    type: String,
    required: true,
  },
  subjectId: {
    type: String,
    required: true,
  },
  totalMarks: {
    type: Number,
    required: true,
  },
});

const TestSubmission = mongoose.model("TestSubmission", testSubmissionSchema);

module.exports = TestSubmission;
