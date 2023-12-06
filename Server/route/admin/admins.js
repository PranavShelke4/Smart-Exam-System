const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const cors = require("cors");
const AuthenticateAdmin = require("../../middleware/adminAuth");

require("../../db/conn");
const Admin = require("../../model/adminSchema");

router.use(cors());

// DELETE Admin by ID
router.delete("/delete-admin/:id", AuthenticateAdmin, async (req, res) => {
  try {
    const adminToDelete = await Admin.findById(req.params.id);

    if (!adminToDelete) {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (adminToDelete._id.equals(req.adminID)) {
      return res
        .status(400)
        .json({ message: "Cannot delete currently logged-in admin" });
    }

    await adminToDelete.remove();
    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Admin Signup API
router.post("/admin-signup", async (req, res) => {
  const { name, email, number, password, cpassword } = req.body;

  if (!name || !email || !number || !password || !cpassword) {
    return res.status(422).json({ error: "Please fill all fields" });
  }

  try {
    const adminExist = await Admin.findOne({ email: email });

    if (adminExist) {
      return res.status(422).json({ error: "Email Already Exists" });
    } else if (password !== cpassword) {
      return res.status(422).json({ error: "Passwords do not match" });
    } else {
      const admin = new Admin({ name, email, number, password });

      // Hash the password before saving
      const salt = await bcrypt.genSalt(10);
      admin.password = await bcrypt.hash(password, salt);

      await admin.save();

      res.status(201).json({ message: "Admin Registered Successfully" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;
