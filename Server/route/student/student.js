const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const axios = require("axios");
const Authenticate = require("../../middleware/authenticate");
const AuthenticateAdmin = require("../../middleware/adminAuth");

process.env.GOOGLE_APPLICATION_CREDENTIALS =
  "./leafy-stock-403608-feb5e4c5e84b.json";

const { Storage } = require("@google-cloud/storage");

const { ImageAnnotatorClient } = require("@google-cloud/vision");
const client = new ImageAnnotatorClient();

require("../../db/conn");
const User = require("../../model/userSchema");
const Admin = require("../../model/adminSchema");
const Test = require("../../model/testModel");
const TestSubmission = require("../../model/testSubmissionModel");

router.use(cors());

// Define the storage for your uploaded files using Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
    req.file.filename
  }`;

  res.status(200).json({ message: "File uploaded successfully", imageUrl });
});

// Face Detection API
router.post("/face-detection", async (req, res) => {
  const imageUrl = req.body.imageUrl;
  console.log("Image URL:", imageUrl);

  if (!imageUrl) {
    return res.status(400).json({ error: "Image URL is required." });
  }

  try {
    const imageResponse = await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });
    const image = imageResponse.data;

    const results = await client.faceDetection(image);

    if (results[0] && results[0].faceAnnotations) {
      const faces = results[0].faceAnnotations;
      res.json({ faces });
    } else {
      res.status(200).json({ faces: [] }); // No faces detected
    }
  } catch (error) {
    console.error("Face detection error:", error);
    res.status(500).json({ error: "Face detection failed." });
  }
});

//Object Localization API
/*
router.post('/object-localization', async (req, res) => {
  const imageUrl = req.body.imageUrl;
  console.log('Image URL for object localization:', imageUrl);

  if (!imageUrl) {
    return res.status(400).json({ error: 'Image URL is required.' });
  }

  try {
    const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const image = imageResponse.data;

    // Use the Object Localizer API to locate objects in the image
    const [result] = await client.objectLocalization(image);

    if (result && result.localizedObjectAnnotations) {
      const objects = result.localizedObjectAnnotations;
      res.json({ objects });
    } else {
      res.status(200).json({ objects: [] }); // No objects detected
    }
  } catch (error) {
    console.error('Object localization error:', error);
    res.status(500).json({ error: 'Object localization failed.' });
  }
});
*/

// Submit Test
router.post("/submit-test", async (req, res) => {
  try {
    const { testId, studentId, studentName, totalMarks } = req.body;

    if (!testId || !studentId || !studentName || totalMarks === undefined) {
      return res.status(400).json({ error: "Incomplete data provided" });
    }

    const testSubmission = new TestSubmission({
      testId,
      studentId,
      studentName,
      totalMarks,
    });

    await testSubmission.save();

    res.status(200).json({ message: "Test submitted successfully" });
  } catch (error) {
    console.error("Error while saving data:", error);
    res.status(500).json({ error: "Failed to submit test" });
  }
});

module.exports = router;
