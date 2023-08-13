import React from 'react'
import { Routes, Route } from "react-router-dom";
import App from '../App';

import AdminLogin from '../component/admin/Login';
import AdminSignup from '../component/admin/Signup';
import AdminDashbord from '../component/admin/Dashbord'

import StudentLogin from "../component/student/Login";
import StudentSignup from "../component/student/Signup";
import StudentDashbord from '../component/student/Dashbord';

function Routess() {
  return (
      <Routes>
        <Route path='/' element={<App />}/>
        <Route path='/admin-login' element={<AdminLogin />}/>
        <Route path='/admin-signup' element={<AdminSignup />}/>
        <Route path='/admin-dashbord' element={<AdminDashbord />}/>
        
        <Route path='/login' element={<StudentLogin />}/>
        <Route path='/signup' element={<StudentSignup />}/>
        <Route path='/student-dashbord' element={<StudentDashbord />}/>
    </Routes>
  )
}

export default Routess