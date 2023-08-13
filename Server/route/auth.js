const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Authenticate = require("../middleware/authenticate");

require("../db/conn");
const User = require("../model/userSchema");

router.get("/", (req, res) => {
  res.send("This is Home page by router");
});

//******************* Using Promises ***************** */

// router.post("/signup", (req, res) => {

//     const { name, email, number, password, cpassword } = req.body;

//     if(!name | !email | !number | !password | !cpassword ){
//        return res.status(442).json({ error: "Plase Fill the all Fillde" });
//     }

//     User.findOne({ email:email })
//       .then((userExist) => {
//         if(userExist){
//           return res.status(442).json({ error: "Email Already Exist" });
//         }

//         // Which data we want to store in data base. Here we want to specify
//         const user = new User({ name, email, number, password, cpassword });

//         user.save().then( () => {
//           return res.status(201).json({ message: "User Registered Successfuly" });
//         }).catch((err) => res.status(500).json({ error: "User Registion Failed"}));

//       }).catch((err) => { console.log(err); });

//   });

//******************* Using async await ***************** */

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

// Login API

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

router.get("/about", Authenticate, (req, res) => {
  console.log("This is About page");
  res.send(req.rootUser);
});

//logout
router.get("/logout", (req, res) => {
  console.log("Hello my logout Page");
  res.clearCookie("jwtokan", { path: "/" });
  res.status(200).send("User Logout");
});

module.exports = router;
