import React from "react";
import Navbar from "./Navbar";
import FaceDetection from "./student/FaseDetection";

function Home() {
  return (
    <div>
      <Navbar />
      <div className="text-center mt-5">
        <h1>Welcome to Smart Exam System</h1>
      </div>
      {/* <FaceDetection /> */}
    </div>
  );
}

export default Home;
