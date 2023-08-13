import React from "react";
import Navbar from "./Navbar";
import Logout from "./Logout";

function Home() {
  return (
    <div>
      <Navbar />
      <div className="text-center mt-5">
        <h1>Welcome to MERN Login & Signup App</h1>
        <Logout />
      </div>
    </div>
  );
}

export default Home;
