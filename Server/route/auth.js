const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const axios = require("axios");
const Authenticate = require("../middleware/authenticate");
const AuthenticateAdmin = require("../middleware/adminAuth");

process.env.GOOGLE_APPLICATION_CREDENTIALS =
  "./leafy-stock-403608-feb5e4c5e84b.json";

const { Storage } = require("@google-cloud/storage");

const { ImageAnnotatorClient } = require("@google-cloud/vision");
const client = new ImageAnnotatorClient();

require("../db/conn");
const User = require("../model/userSchema");
const Admin = require("../model/adminSchema");
const Test = require("../model/testModel");
const TestSubmission = require("../model/testSubmissionModel");

router.use(cors());

// Define the storage for your uploaded files using Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
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

//Student Registor API

router.post("/register", async (req, res) => {
  const { name, email, number, password, cpassword } = req.body;

  if (!name | !email | !number | !password | !cpassword) {
    return res.status(422).json({ error: "Plase Fill the all Fillde" });
  }

  try {
    const userExist = await User.findOne({ email: email });

    if (userExist) {
      return res.status(422).json({ error: "Email Already Exist" });
    } else if (password != cpassword) {
      return res.status(422).json({ error: "Password not match" });
    } else {
      const user = new User({ name, email, number, password, cpassword });

      await user.save();

      res.status(201).json({ message: "User Registered Successfuly" });
    }
  } catch (err) {
    console.log(err);
  }
});

//Student Login API

router.post("/signin", async (req, res) => {
  try {
    let tokan;
    const { email, password } = req.body;

    if (!email | !password) {
      return res.status(400).json({ error: "Plase Fill the all Fillde" });
    }

    const userLogin = await User.findOne({ email: email });

    if (userLogin) {
      const userPassword = await bcrypt.compare(password, userLogin.password);

      // JWT tokan
      tokan = await userLogin.generateAuthToken();
      console.log(tokan);

      // store tokan in cookies
      res.cookie("jwtokan", tokan, {
        expires: new Date(Date.now() + 25892000000),
        httpOnly: true,
      });

      if (!userPassword) {
        res.status(400).json({ error: "inviald Credentials" });
      } else {
        res.json({ error: "User Signin Successfuly" });
      }
    } else {
      res.status(400).json({ error: "inviald Credentials" });
    }
  } catch (err) {
    console.log(err);
  }
});


// Admin Login API
router.post("/admin-signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Please fill all fields" });
    }

    const adminLogin = await Admin.findOne({ email: email });

    if (adminLogin) {
      const adminPassword = await bcrypt.compare(password, adminLogin.password);

      if (!adminPassword) {
        return res.status(400).json({ error: "Invalid Credentials" });
      } else {
        // Generate JWT token
        const token = jwt.sign({ _id: adminLogin._id }, process.env.SECRET_KEY);

        // Set token in cookies
        res.cookie("adminToken", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        });

        return res.json({ message: "Admin Signin Successful" });
      }
    } else {
      return res.status(400).json({ error: "Invalid Credentials" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Server Error" });
  }
});

router.get("/student-dashbord", Authenticate, (req, res) => {
  res.send(req.rootUser);
});

router.get("/student-data", Authenticate, (req, res) => {
  res.send(req.rootUser);
});

router.get("/admin-dashbord", AuthenticateAdmin, (req, res) => {
  res.send(req.rootAdmin);
});


// Update questions, options, and correct answers for a test
router.post("/update-test/:testId", async (req, res) => {
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

// Logout API
router.get("/logout", async (req, res) => {
  try {
    res.clearCookie("jwtokan", { path: "/" });
    res.clearCookie("adminToken", { path: "/" });
    res.status(200).send("User Logout");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;
