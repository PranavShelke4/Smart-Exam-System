const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cookieParser = require('cookie-parser');
const path = require('path');

dotenv.config({ path: './config.env' });
require('./db/conn');

//read json file
app.use(express.json());

// cookie-parser middleware
app.use(cookieParser()); 

// Serve static files (uploads) using Express
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rout Link
app.use(require('./route/auth'));

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});

