import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/TaskPage.css';
import { createClient } from '@supabase/supabase-js';
import 'bootstrap/dist/css/bootstrap.min.css';


const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const SearchPage = () => {
  const query = useQuery();
  const searchQuery = query.get('query') || '';
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*');

      if (error) {
        console.error('Error fetching tasks:', error);
      } else {
        setTasks(data);
      }
    };

    fetchTasks();
  }, []);

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = tasks.filter(task =>
      (task.task_name && task.task_name.toLowerCase().includes(lowercasedQuery)) ||
      (task.task_description && task.task_description.toLowerCase().includes(lowercasedQuery))
    );
    setFilteredTasks(filtered);
  }, [searchQuery, tasks]);

  return (
    <div className="search-page">
      <h1>Search Results</h1>
      <table className="task-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Task</th>
            <th>Description</th>
            <th>Owner</th>
            <th>Start Date</th>
            <th>Due Date</th>
            <th>Priority</th>
            <th>Group</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.map(task => (
            <tr key={task.id}>
              <td>{task.id}</td>
              <td>{task.task_description}</td>
              <td>{task.task_ownerid}</td>
              <td>{task.start_date}</td>
              <td>{task.due_date}</td>
              <td>{task.priority}</td>
              <td>{task.group_name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SearchPage;
