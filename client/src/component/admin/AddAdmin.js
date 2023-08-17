import React, {useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

function Signup() {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({});

  const [user, setUser] = useState({
    name: "",
    email: "",
    number: "",
    password: "",
    cpassword: "",
  });

  let name, value;

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

  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;

    setUser({ ...user, [name]: value });
  };

  const postData = async (e) => {
    e.preventDefault();

    const { name, email, number, password, cpassword } = user;

    const resp = await fetch("/admin-signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        email: email,
        number: number,
        password: password,
        cpassword: cpassword,
      }),
    });

    const data = await resp.json();

    console.log(data);

    if (resp.status === 422 || !data) {
      window.alert("Invalid Registration");
      console.log("Invalid Registration");
    } else {
      window.alert("Registration Successfull");
      console.log("Registration Successfull");

      navigate("/all-admin");
    }
  };

  return (
    <>
      <div style={{ display: "flex", height: "100vh", minHeight: "400px" }}>
        <Sidebar />
        <main style={{ padding: 10 }}>
          <h1 className="text-center mt-4">Add Admin</h1>

          <div className="container">
            <form method="POST">
              <div className="form-group">
                <label htmlFor="exampleInputName">Admin Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  id="exampleInputName"
                  value={user.name}
                  onChange={handleInputs}
                  placeholder="Admin Name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="exampleInputEmail1">Admin Email address</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  value={user.email}
                  onChange={handleInputs}
                  placeholder="Enter email"
                />
              </div>
              <div className="form-group">
                <label htmlFor="exampleInputPhone">Phone No.</label>
                <input
                  type="number"
                  name="number"
                  className="form-control"
                  id="exampleInputPhone"
                  value={user.number}
                  onChange={handleInputs}
                  placeholder="phone"
                />
              </div>
              <div className="form-group">
                <label htmlFor="exampleInputPassword">Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  id="exampleInputPassword"
                  value={user.password}
                  onChange={handleInputs}
                  placeholder="Password"
                />
              </div>
              <div className="form-group">
                <label htmlFor="exampleInputCPassword">Confirm Password</label>
                <input
                  type="password"
                  name="cpassword"
                  className="form-control"
                  id="exampleInputCPassword"
                  value={user.cpassword}
                  onChange={handleInputs}
                  placeholder="Password"
                />
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  onClick={postData}
                  className="btn btn-primary  m-4"
                >
                  Add Admin 
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </>
  );
}

export default Signup;
