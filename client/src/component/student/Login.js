import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../Style/Login.css";
import imglogin from "../../assets/img/login.png"

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
        <div className="text-center login-left-side">
          <h2>Login To Student</h2>
          <img className="login-img" src={imglogin} alt="login"/>
        </div>
        <div className="login-right-side">
          <div className="exit-to-home">
            <Link to={"/"}>
              <h2>X</h2>
            </Link>
          </div>
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
                placeholder="demo id :- pranavshelke4@gmail.com"
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
                placeholder="demo pass :- 1234"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="text-center">
              <button onClick={loginUser} type="submit" class="btn button-57">
                <span class="text">Login</span>
                <span>All The Best For Exam !</span>
              </button>
            </div>
          </form>

          <div className="text-center">
            <Link to={"/admin-login"}>
              <button type="submit" class="btn button-6">
                Admin Login
              </button>
            </Link>
            <p className="warning">*If you're not able to log in, please contact your admin.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
