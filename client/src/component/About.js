/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

function About() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});

  const callAboutPage = async () => {
    try {
      const res = await fetch("/about", {
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
    callAboutPage(); // eslint-disable-next-line
  }, []);

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <div className="jumbotron">
          <h1 className="display-4">{userData.name}</h1>

          <h3>Web Developer</h3>
          <p>Work links</p>
          <p className="lead">
            <a href="#">Github</a>
            <br />
            <a href="#">Instagram</a>
            <br />
            <a href="#">FaceBook</a>
          </p>
          <hr className="my-4" />
          <p>
            It uses utility classes for typography and spacing to space content
            out within the larger container.
          </p>

          <p>User ID : {userData._id}</p>
          <p>Name : {userData.name}</p>
          <p>email : {userData.email}</p>
          <p>phone : {userData.number}</p>
          <p>Profession : Web developer</p>
          <p className="lead">
            <a className="btn btn-primary btn-lg" href="#" role="button">
              Learn more
            </a>
          </p>
        </div>
      </div>
    </>
  );
}

export default About;
