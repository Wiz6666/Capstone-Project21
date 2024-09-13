import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TaskList from './pages/TaskPage';
import TaskDetails from './pages/DetailPage';
import SearchPage from './pages/SearchPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/tasks" element={<TaskList />} />
        <Route path="/tasks/:id" element={<TaskDetails />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </Router>
  );
}

export default App;
