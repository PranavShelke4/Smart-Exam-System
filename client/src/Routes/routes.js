import React from 'react'
import { Routes, Route } from "react-router-dom";
import App from '../App';
import About from '../component/About';
import Contact from '../component/Contact';
import Login from '../component/Login';
import Signup from '../component/Signup';
import Logout from '../component/Logout';

function Routess() {
  return (
      <Routes>
        <Route path='/' element={<App />}/>
        <Route path='/about' element={<About />}/>
        <Route path='/contact' element={<Contact />}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/signup' element={<Signup />}/>
    </Routes>
  )
}

export default Routess