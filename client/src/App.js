import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';   
import Dashboard from './pages/Dashboard'; 
import Navbar from './components/Navbar';  
import Footer from './components/Footer';  
import RegisterPage from './ pages/RegisterPage';
import LoginPage from './ pages/LoginPage';
import ForgetPasswordPage from './ pages/ForgetPasswordPage';
import ResetPasswordPage from './ pages/RestPasswordPage';
import ProfilePage from './ pages/ProfilePage';


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
