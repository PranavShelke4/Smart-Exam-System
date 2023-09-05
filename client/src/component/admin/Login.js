import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../Style/Login.css";
import imglogin2 from "../../assets/img/login2.png"

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginAdmin = async (e) => {
    e.preventDefault();

    const res = await fetch("/admin-signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    const data = await res.json();

    if (res.status === 400 || !data) {
      window.alert("Invalid Credentials");
      console.log("Invalid Credentials");
    } else {
      window.alert("Login Successful");
      console.log("Login Successful");

      navigate("/admin-dashbord");
    }
  };

  return (
    <div className="login-page">
      <div className="container login-box">
        <div className="text-center login-left-side">
          <h2>Login To Admin</h2>
          <img className="login-img" src={imglogin2} alt="login" />
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
                className="form-control login-input"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder="Enter email"
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
                className="form-control login-input"
                id="exampleInputPassword1"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="text-center">
              <button onClick={loginAdmin} type="submit" class="btn button-57">
                <span class="text">Login</span>
                <span>Login</span>
              </button>
            </div>
            <div className="demologin">
              <p>Demo Login Id & Password</p>
              <p>Id :- Pranavshelke4@gmail.com</p>
              <p>Pass :- 1234</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
