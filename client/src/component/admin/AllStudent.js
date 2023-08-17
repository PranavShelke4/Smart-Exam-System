import React, {useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

function AllStudent() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({});

    const callAdminDashbordPage = async () => {
        try {
          const res = await fetch("/admin-dashbord", {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-type": "application/json",
            },
            credentials: "include",
          });
    
          console.log("Response status:", res.status);
    
          if (res.status === 200) {
            const data = await res.json();
            setUserData(data);
          } else if (res.status === 401) {
            navigate("/admin-login");
          } else {
            throw new Error("Failed to fetch admin dashboard");
          }
        } catch (err) {
          console.log("Error:", err);
        }
      };
    
      useEffect(() => {
        callAdminDashbordPage();
      }, []);
    
  return (
    <div style={{ display: "flex", height: "100vh", minHeight: "400px" }}>
        <Sidebar />
        <main style={{ padding: 10 }}>hii</main>
    </div>
  )
}

export default AllStudent