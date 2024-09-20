import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import '../styles/DetailPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const TaskDetails = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const { data, error } = await supabase
          .from('tasks')
          .select('*, Users:owner_id (username, avatar_url)')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        else {
          console.log('Fetched task data:', data);
        }

        setTask(data);
      } catch (error) {
        setError('Error fetching task details.');
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  if (!task) return <div>No task found.</div>;

  return (
    <div className="task-details">
      <h1>TASK DETAILS</h1>
      <div className="task-info">
        <p><strong>TASK TITLE:</strong> {task.task_name}</p>
        <p><strong>ASSIGNEE:</strong> <img src={task.Users.avatar_url} alt="User Avatar" className="avatar" style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px'}}/> {task.Users.username}</p>
        <p><strong>TIME LINE:</strong> {task.start_date} - {task.due_date}</p>
        <p><strong>TASK STATUS:</strong> {task.task_status}</p>
        <p><strong>TASK PRIORITY:</strong> {task.priority}</p>
        <p><strong>TASK DESCRIPTION:</strong> {task.task_description}</p>
      </div>
    </div>
  );
};

export default TaskDetails;
