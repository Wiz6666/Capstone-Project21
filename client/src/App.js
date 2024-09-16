import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CombinedPage from './ pages/HomePage';
import RegisterPage from './ pages/RegisterPage';
import LoginPage from './ pages/LoginPage';
import ForgetPasswordPage from './ pages/ForgetPasswordPage';
import ResetPasswordPage from './ pages/RestPasswordPage';
import ProfilePage from './ pages/ProfilePage';
import DashboardPage from './ pages/Dashboard';
import TaskList from './ pages/TaskPage';
import TaskDetails from './ pages/DetailPage';


function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<CombinedPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgetPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/project" element={<TaskList />} />
          <Route path="/tasks/:id" element={<TaskDetails />} />
          
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
