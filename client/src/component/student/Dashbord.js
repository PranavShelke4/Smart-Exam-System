import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

function Dashbord() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({});
  
    const callStudentDashbordPage = async () => {
      try {
        const res = await fetch("/student-dashbord", {
          method: "GET",
          headers: {
            Accept: "appllication/json",
            "Content-type": "application/json",
          },
          credentials: "include", // Add this line to include cookies
        });
  
        const data = await res.json();
        console.log(data);
        setUserData(data);
  
        if (!res.status === 200) {
          const error = new Error(res.error);
          throw error;
        }
      } catch (err) {
        console.log(err);
        navigate("/login");
      }
    };
  
    useEffect(() => {
      callStudentDashbordPage(); // eslint-disable-next-line
    }, []);
  return (
    <>
      <Navbar />
      <div>Dashbord</div>
    </>
  );
}

export default Dashbord;
