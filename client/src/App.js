// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient'; // Import Supabase client for authentication
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ForgetPasswordPage from './pages/ForgetPasswordPage';
import ResetPasswordPage from './pages/RestPasswordPage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/Dashboard';
import TaskList from './pages/TaskPage';
import TaskDetails from './pages/DetailPage';
import ProjectBoard from './pages/ProjectPage'; 

function App() {
  const [session, setSession] = useState(null); // State to manage user session
  const [loading, setLoading] = useState(true); // State to manage loading while checking session

  useEffect(() => {
    // On app load, fetch the current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session); // Set the session if available
      setLoading(false); // After checking the session, set loading to false
    });

    // Set up a listener for authentication state changes (e.g., login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session); // Update session on authentication state change
      setLoading(false); // Ensure loading state is set to false
    });

    // Cleanup the subscription to avoid memory leaks
    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator or message while checking session
  }

  return (
    <Router>
      <div className="App">
        {/* Navbar receives the session prop to determine login status */}
        <Navbar session={session} />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgetPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/project" element={<ProjectBoard />} />
          {/* Added routing for project task page */}
          <Route path="/project/:projectId/tasks" element={<TaskList />} />
          <Route path="/tasks/:id" element={<TaskDetails />} />

          {/* Protected routes - only accessible if the user is authenticated */}
          <Route 
            path="/profile" 
            element={session ? <ProfilePage /> : <Navigate to="/login" />} 
            // If session exists, show ProfilePage, otherwise redirect to login
          />
          <Route 
            path="/profile/:userId" 
            element={session ? <ProfilePage /> : <Navigate to="/login" />} 
            // If session exists, show ProfilePage with userId, otherwise redirect to login
          />
          <Route 
            path="/dashboard" 
            element={session ? <DashboardPage /> : <Navigate to="/login" />} 
            // If session exists, show DashboardPage, otherwise redirect to login
          />
        </Routes>
        {/* Footer component visible on all pages */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
