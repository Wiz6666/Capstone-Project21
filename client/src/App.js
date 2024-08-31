import React from 'react';
import Navbar from './Navbar';
import Dashboard from './Dashboard';
import './DashboardPage.css';
import Footer from './Footer';
function App() {
  return (
    <div className="App">
      <Navbar />
      <Dashboard />
      <Footer />
    </div>
  );
}

export default App;
