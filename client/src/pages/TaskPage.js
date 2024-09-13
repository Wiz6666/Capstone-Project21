import React, { useState, useEffect } from 'react';
import '../styles/TaskPage.css';
import { Link } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from 'react-bootstrap';

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false); // State for modal visibility
    const [newTask, setNewTask] = useState({
        task_name: '',
        task_description: '',
        owner_id: '',
        start_date: '',
        due_date: '',
        priority: '',
        group_name: ''
    });
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editedTask, setEditedTask] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
      const fetchTasks = async () => {
        const { data, error } = await supabase
            .from('tasks')
            .select('*');
    
        if (error) {
            console.error('Error fetching tasks:', error);
        } else {
            console.log('Fetched data:', data); // Log the data to see its structure
            if (Array.isArray(data)) {
                setTasks(data);
            } else {
                console.error('Data is not an array:', data);
            }
        }
      };

        fetchTasks();
    }, []);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault(); // Prevent the default form submission
        if (searchQuery) {
            navigate(`/search?query=${encodeURIComponent(searchQuery)}`); // Navigate to the search page
        }
    };

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const handleEditClick = (task) => {
        setEditingTaskId(task.id);
        setEditedTask(task);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (editingTaskId) {
            setEditedTask((prevTask) => ({
                ...prevTask,
                [name]: value,
            }));
        } else {
            setNewTask((prevTask) => ({
                ...prevTask,
                [name]: value,
            }));
        }
    };

    const handleNewTaskSubmit = async (e) => {
        e.preventDefault();

        const { task_name, task_description, owner_id, start_date, due_date, priority, group_name } = newTask;

        // Insert new task into Supabase database
        const { data, error } = await supabase
            .from('tasks')
            .insert([
                { task_name, task_description, owner_id, start_date, due_date, priority, group_name },
            ]);

        if (error) {
            console.error('Error adding new task:', error);
        } else {
            // Add the new task to the tasks list in the UI
            setTasks(prevTasks => [...prevTasks, ...data]);
            closeModal();
        }
    };

    const handleSaveClick = async () => {
        try {
            const { error } = await supabase.from('tasks').update(editedTask).eq('id', editedTask.id);
            if (error) {
                console.error('Error updating task:', error);
                return;
            }
            setTasks(prevTasks => prevTasks.map(task => (task.id === editedTask.id ? editedTask : task)));
            setEditingTaskId(null);
        } catch (err) {
            console.error('Error:', err);
        }
    };

    const handleDeleteTask = async (id) => {
        try {
            const { error } = await supabase.from('tasks').delete().eq('id', id);
            if (error) {
                console.error('Error deleting task:', error);
                return;
            }
            setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
        } catch (err) {
            console.error('Error:', err);
        }
    };

    const handleCancelClick = () => {
        setEditingTaskId(null);
    };

    return (
        <div className="task-list">
            <div className="task-list-header">
                <h1>TASK LIST</h1>
                <form onSubmit={handleSearchSubmit} className="search-form">
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="search-input"
                    />
                </form>
                <button className="new-task-button" onClick={openModal}>NEW TASK +</button>
                <div className="task-list-actions">
                    <button type="submit" className="search-button">🔍 Search</button>
                    <button className="filter-button">🔍 Filter</button>
                    <button className="sort-button">🔍 Sort</button>
                    <button className="group-button">🔍 Group by</button>
                </div>
            </div>
            <table className="task-table">
                <thead>
                    <tr>
                        <th>Select</th>
                        <th>No</th>
                        <th>Task</th>
                        <th>Description</th>
                        <th>Owner</th>
                        <th>Start date</th>
                        <th>Due date</th>
                        <th>Priority</th>
                        <th>Group</th>
                    </tr>
                </thead>
                <tbody>
                    {(Array.isArray(tasks) ? tasks : []).map((task) => (
                        <tr key={task.id}>
                            <td><input type="radio" name="task-select" /></td>
                            <td>{task.id}</td>
                            <td>
                                {editingTaskId === task.id ? (
                                    <input
                                        type="text"
                                        name="task_name"
                                        value={editedTask.task_name}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    <Link to={`/tasks/${task.id}`}>{task.task_name}</Link>
                                )}
                            </td>
                            <td>
                                {editingTaskId === task.id ? (
                                    <input
                                        type="text"
                                        name="task_description"
                                        value={editedTask.task_description}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    task.task_description
                                )}
                            </td>
                            <td>
                                {editingTaskId === task.id ? (
                                    <input
                                        type="number"
                                        name="owner_id"
                                        value={editedTask.owner_id}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    task.owner_id
                                )}
                            </td>
                            <td>
                                {editingTaskId === task.id ? (
                                    <input
                                        type="date"
                                        name="start_date"
                                        value={editedTask.start_date}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    task.start_date
                                )}
                            </td>
                            <td>
                                {editingTaskId === task.id ? (
                                    <input
                                        type="date"
                                        name="due_date"
                                        value={editedTask.due_date}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    task.due_date
                                )}
                            </td>
                            <td>
                                {editingTaskId === task.id ? (
                                    <select
                                        name="priority"
                                        value={editedTask.priority}
                                        onChange={handleInputChange}
                                    >
                                        <option value="High">High</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Low">Low</option>
                                    </select>
                                ) : (
                                    task.priority
                                )}
                            </td>
                            <td>
                                {editingTaskId === task.id ? (
                                    <input
                                        type="text"
                                        name="group_name"
                                        value={editedTask.group_name}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    task.group_name
                                )}
                            </td>
                            <td>
                                {editingTaskId === task.id ? (
                                    <>
                                        <button onClick={handleSaveClick} className="btn-save">Save</button>
                                        <button onClick={handleCancelClick} className="btn-cancel">Cancel</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => handleEditClick(task)} className="btn-edit">Edit</button>
                                        <button onClick={() => handleDeleteTask(task.id)} className="btn-delete">Delete</button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal for adding new task */}
            <Modal show={showModal} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Create New Task</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleNewTaskSubmit}>
                        <Form.Group>
                            <Form.Label>Task Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="task_name"
                                value={newTask.task_name}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group><br />

                        <Form.Group>
                            <Form.Label>Task Description</Form.Label>
                            <Form.Control
                                type="text"
                                name="task_description"
                                value={newTask.task_description}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group><br />

                        <Form.Group>
                            <Form.Label>Task Owner ID</Form.Label>
                            <Form.Control
                                type="text"
                                name="owner_id"
                                value={newTask.owner_id}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group><br />

                        <Form.Group>
                            <Form.Label>Start Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="start_date"
                                value={newTask.start_date}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group><br />

                        <Form.Group>
                            <Form.Label>Due Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="due_date"
                                value={newTask.due_date}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group><br />

                        <Form.Group>
                            <Form.Label>Priority</Form.Label>
                            <Form.Control
                                type="text"
                                name="priority"
                                value={newTask.priority}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group><br />

                        <Form.Group>
                            <Form.Label>Group</Form.Label>
                            <Form.Control
                                type="text"
                                name="group_name"
                                value={newTask.group_name}
                                onChange={handleInputChange}
                            />
                        </Form.Group><br />
                        <Button variant="primary" type="submit">
                            Add Task
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default TaskList;
