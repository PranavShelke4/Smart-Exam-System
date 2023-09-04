import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../Style/Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = async (e) => {
    e.preventDefault();

    const res = await fetch("/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    const data = res.json();

    console.log(data);

    if (res.status === 400 || !data) {
      window.alert("Invalid Credentials");
      console.log("Invalid Credentials");
    } else {
      window.alert("Student Login Successfull");
      console.log("Login Successfull");
      navigate("/student-dashbord");
    }
  };

  return (
    <div className="login-page">
      <div className="container login-box">
        <div className="login-left-side">
          <h1 className="text-center mt-4">Log in</h1>
        </div>
        <div className="login-right-side">
          <form method="POST">
            <div className="form-group">
              <label className="login-label" htmlFor="exampleInputEmail1">
                Email address
              </label>
              <input
                type="email"
                class="form-control login-input"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="login-label" htmlFor="exampleInputPassword1">
                Password
              </label>
              <input
                type="password"
                class="form-control login-input"
                id="exampleInputPassword1"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="text-center">
              <Link to={"/admin-login"}>
                <button type="submit" class="btn m-4">
                  Admin Login
                </button>
              </Link>

              <button
                onClick={loginUser}
                type="submit"
                class="btn m-4 login-btn"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
