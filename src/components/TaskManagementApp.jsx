import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Input, Button } from './ui/input';

const COLUMNS = ['pending', 'in-progress', 'completed'];

const TaskItem = ({ task, index, moveTask, deleteTask }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'TASK',
    item: { id: task.id, index, status: task.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <li
      ref={drag}
      className={`bg-gray-100 p-3 rounded shadow-sm hover:shadow-md transition duration-200 mb-2 ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex justify-between items-center">
        <span>{task.name}</span>
        <button
          onClick={() => deleteTask(task.id, task.status)}
          className="text-red-500 hover:text-red-700"
        >
          ×
        </button>
      </div>
    </li>
  );
};

const Column = ({ column, tasks, moveTask, deleteTask }) => {
  const [, drop] = useDrop({
    accept: 'TASK',
    drop: (item) => moveTask(item.id, item.status, column),
  });

  return (
    <div ref={drop} className="bg-white rounded-lg shadow-md p-4 flex-1 min-w-[250px]">
      <h2 className="text-lg font-semibold mb-4 text-center capitalize">
        {column.replace('-', ' ')}
      </h2>
      <ul className="min-h-[100px]">
        {tasks.map((task, index) => (
          <TaskItem
            key={task.id}
            task={task}
            index={index}
            moveTask={moveTask}
            deleteTask={deleteTask}
          />
        ))}
      </ul>
    </div>
  );
};

const TaskManagementApp = ({ user, supabaseClient }) => {
  const [tasks, setTasks] = useState(COLUMNS.reduce((acc, column) => ({ ...acc, [column]: [] }), {}));
  const [newTaskName, setNewTaskName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && user.id) {
      fetchTasks();
    } else {
      setError("User information is missing. Please try logging in again.");
      setLoading(false);
    }
  }, [user]);

  const fetchTasks = async () => {
    if (!user || !user.id) {
      setError("User ID is missing. Cannot fetch tasks.");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabaseClient
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('id', { ascending: true });

      if (error) throw error;

      const groupedTasks = COLUMNS.reduce((acc, column) => {
        acc[column] = data.filter(task => task.status === column);
        return acc;
      }, {});
      setTasks(groupedTasks);
    } catch (error) {
      setError(`Failed to fetch tasks: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async () => {
    if (!newTaskName.trim() || !user || !user.id) return;

    try {
      const { data, error } = await supabaseClient
        .from('tasks')
        .insert({ name: newTaskName, status: 'pending', user_id: user.id })
        .select();

      if (error) throw error;

      setTasks(prev => ({
        ...prev,
        'pending': [...prev['pending'], data[0]]
      }));
      setNewTaskName('');
    } catch (error) {
      setError(`Failed to add task: ${error.message}`);
    }
  };

  const deleteTask = async (id, status) => {
    try {
      const { error } = await supabaseClient
        .from('tasks')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setTasks(prev => ({
        ...prev,
        [status]: prev[status].filter(task => task.id !== id)
      }));
    } catch (error) {
      setError(`Failed to delete task: ${error.message}`);
    }
  };

  const moveTask = async (taskId, sourceStatus, targetStatus) => {
    if (sourceStatus === targetStatus) return;

    const sourceTasks = [...tasks[sourceStatus]];
    const targetTasks = [...tasks[targetStatus]];
    const taskToMove = sourceTasks.find(task => task.id === taskId);

    if (!taskToMove) return;

    sourceTasks.splice(sourceTasks.indexOf(taskToMove), 1);
    targetTasks.push({ ...taskToMove, status: targetStatus });

    setTasks(prev => ({
      ...prev,
      [sourceStatus]: sourceTasks,
      [targetStatus]: targetTasks
    }));

    try {
      const { error } = await supabaseClient
        .from('tasks')
        .update({ status: targetStatus })
        .eq('id', taskId)
        .eq('user_id', user.id);

      if (error) throw error;
    } catch (error) {
      setError(`Failed to update task status: ${error.message}`);
      fetchTasks(); // Revert to the server state if update fails
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabaseClient.auth.signOut();
      if (error) throw error;
      // Redirect to login page or update app state
      window.location.reload(); // This will refresh the page and return to the login screen
    } catch (error) {
      setError(`Failed to log out: ${error.message}`);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading tasks...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-200 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Kanban Task Manager</h1>
            <Button 
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white transition duration-300 px-4 py-2 rounded-md"
            >
              Log Out
            </Button>
          </div>
          
          <div className="mb-8">
            <Input
              type="text"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              placeholder="Enter new task"
              className="w-full mb-2 rounded-md"
            />
            <Button 
              onClick={addTask} 
              className="w-full bg-blue-500 hover:bg-blue-600 text-white transition duration-300 rounded-md"
            >
              Add Task
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {COLUMNS.map((column) => (
              <Column
                key={column}
                column={column}
                tasks={tasks[column] || []}
                moveTask={moveTask}
                deleteTask={deleteTask}
              />
            ))}
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default TaskManagementApp;