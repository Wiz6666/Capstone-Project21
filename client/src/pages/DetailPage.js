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
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
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
        <p><strong>ASSIGNEE:</strong> <img src="path_to_assignee_image" alt="assignee" className="assignee-image" /> {task.assignee}</p>
        <p><strong>TIME LINE:</strong> {task.start_date} - {task.due_date}</p>
        <p><strong>TASK STATUS:</strong> {task.task_status}</p>
        <p><strong>TASK PRIORITY:</strong> {task.priority}</p>
        <p><strong>TASK DESCRIPTION:</strong> {task.task_description}</p>
      </div>
    </div>
  );
};

export default TaskDetails;
