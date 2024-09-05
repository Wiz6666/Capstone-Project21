import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './ pages/HomePage';
import RegisterPage from './ pages/RegisterPage';
import LoginPage from './ pages/LoginPage';
import ForgetPasswordPage from './ pages/ForgetPasswordPage';
import ResetPasswordPage from './ pages/RestPasswordPage';
import ProfilePage from './ pages/ProfilePage';


function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgetPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
