
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';  // Import useParams for getting URL parameters and Link for navigation
import { createClient } from '@supabase/supabase-js'; // Import Supabase client for database interaction
import '../styles/DetailPage.css'; // Import styles for the detail page

// Supabase configuration
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL; // Fetch Supabase URL from environment variables
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY; // Fetch Supabase key from environment variables
const supabase = createClient(supabaseUrl, supabaseKey); // Create a Supabase client instance

// TaskDetails component to show details of a specific task
const TaskDetails = () => {
  const { id } = useParams(); // Extract the 'id' from the URL parameters
  const [task, setTask] = useState(null); // State to store task details
  const [loading, setLoading] = useState(true); // State to manage loading indicator
  const [error, setError] = useState(null); // State to handle and display any errors

  // Fetch task details when component mounts or 'id' changes
  useEffect(() => {
    const fetchTask = async () => {
      try {
        // Query the 'tasks' table, join with 'Users' table using 'owner_id' to get user info
        const { data, error } = await supabase
          .from('tasks')
          .select('*, Users:owner_id (user_id, username, avatar_url)')
          .eq('id', id) // Filter by the 'id' parameter from the URL
          .single(); // Fetch a single record

        if (error) {
          throw error; // If there is an error, throw it to be caught
        }

        setTask(data); // If successful, store the task data in state
      } catch (error) {
        setError('Error fetching task details.'); // Set error message if fetching fails
      } finally {
        setLoading(false); // Set loading to false after fetching is done
      }
    };

    fetchTask(); // Call the function to fetch task details
  }, [id]); // The effect runs when 'id' changes

  if (loading) return <div>Loading...</div>; // Show loading message while fetching data
  if (error) return <div>{error}</div>; // Show error message if there is an error

  if (!task) return <div>No task found.</div>; // Show message if no task is found

  return (
    <div className="task-details">
      <h1 className="title">TASK DETAILS</h1> {/* Title for the task details page */}
      <div className="task-info">
        <p><strong>TASK TITLE:</strong> {task.task_name}</p> {/* Task title */}
        <p><strong>OWNER:</strong> <Link to={`/profile/${task.Users.user_id}`}> {/* Link to the owner's profile */}
          <img src={task.Users.avatar_url} alt="User Avatar" className="avatar" /> {/* Owner's avatar */}
          {task.Users.username} {/* Owner's username */}
        </Link></p>
        <p><strong>TIME LINE:</strong> {task.start_date} - {task.due_date}</p> {/* Task timeline (start and due dates) */}
        <p><strong>TASK STATUS:</strong> {task.task_status}</p> {/* Task status */}
        <p><strong>TASK PRIORITY:</strong> {task.priority}</p> {/* Task priority */}
        <p><strong>TASK DESCRIPTION:</strong> {task.task_description}</p> {/* Task description */}
      </div>
    </div>
  );
};

export default TaskDetails; // Export the component for use in other parts of the app
