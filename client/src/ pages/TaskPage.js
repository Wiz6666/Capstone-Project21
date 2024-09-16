import React, { useState, useEffect } from 'react';
import '../styles/TaskPage.css';
import { Link } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from 'react-bootstrap';
import debounce from 'lodash.debounce';

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false); // State for modal visibility
    const [showSortWindow, setShowSortWindow] = useState(false);
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
    const [editingField, setEditingField] = useState(null);
    const [selectedTaskIds, setSelectedTaskIds] = useState([]);
    const [sortColumn, setSortColumn] = useState('start_date');
    const [sortOrder, setSortOrder] = useState('asc');
    const [availableFields] = useState([
        { name: 'Task Name', field: 'task_name' },
        { name: 'Start Date', field: 'start_date' },
        { name: 'Due Date', field: 'due_date' },
        { name: 'Description', field: 'task_description' },
        { name: 'Owner', field: 'owner_id' },
        { name: 'Priority', field: 'priority' },
        { name: 'Group', field: 'group_name' }
    ]);

    const fetchTasks = async (query = '') => {
        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .or(`task_name.ilike.%${query}%,task_description.ilike.%${query}%`)
            .order(sortColumn, { ascending: sortOrder === 'asc' });
    
        if (error) {
            console.error('Error fetching tasks:', error);
        } else {
            console.log('Fetched data:', data); // Log the data to see its structure
            if (Array.isArray(data)) {
                setTasks([]);
                setTasks(prevTasks => [...prevTasks, ...data]);
            } else {
                console.error('Data is not an array:', data);
            }
        }
    };

    const debouncedFetchTasks = debounce(fetchTasks, 500);

    useEffect(() => {
        fetchTasks();
    }, []);

    useEffect(() => {
        debouncedFetchTasks(searchQuery);
    }, [searchQuery, sortColumn, sortOrder]);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault(); // Prevent the default form submission
    };

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const handleFieldClick = (taskId, field) => {
        setEditingTaskId(taskId);    // Track the task being edited
        setEditingField(field);      // Track the field being edited
        setEditedTask(tasks.find((task) => task.id === taskId)); // Set the initial task data
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
        } 
        else {
            if (Array.isArray(data)) {
                setTasks(prevTasks => [...prevTasks, ...data]);
            } else {
                console.error('Expected data to be an array, but got:', data);
            }
            fetchTasks();
            closeModal();
        }
    };

    const handleDeleteTask = async (id) => {
        if (selectedTaskIds.length === 0) {
            alert('Please select at least one task to delete.');
            return;
        }
        try {
            const { error } = await supabase
                .from('tasks')
                .delete()
                .in('id', selectedTaskIds);

            if (error) {
                console.error('Error deleting task:', error);
                return;
            }
            setTasks((prevTasks) => prevTasks.filter((task) => !selectedTaskIds.includes(task.id)));
            setSelectedTaskIds([]); // Reset the selected task after deletion
        } catch (err) {
            console.error('Error:', err);
        }
    };

    const handleTaskSelection = (id) => {
        setSelectedTaskIds((prevSelected) => {
            if (prevSelected.includes(id)) {
                // If the task is already selected, deselect it
                return prevSelected.filter((taskId) => taskId !== id);
            } else {
                // Add the task ID to the list of selected tasks
                return [...prevSelected, id];
            }
        });
    };

    const handleBlur = async (taskId) => {
        try {
            const { error } = await supabase.from('tasks').update(editedTask).eq('id', taskId);
            if (error) {
                console.error('Error updating task:', error);
                return;
            }
            setTasks((prevTasks) =>
                prevTasks.map((task) => (task.id === taskId ? { ...task, ...editedTask } : task))
            );
            setEditingTaskId(null);    // Exit editing mode
            setEditingField(null);
        } catch (err) {
            console.error('Error:', err);
        }
    };

    const handleSortApply = () => {
        setShowSortWindow(false); // Hide the sorting window
        fetchTasks(searchQuery); // Refetch tasks with updated sorting
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
                <Button variant="danger" className="delete-task-button" onClick={handleDeleteTask}>DELETE TASK</Button>
                <div className="task-list-actions">
                    <button type="submit" className="search-button">🔍 Search</button>
                    <button className="filter-button">🔍 Filter</button>
                    <button className="sort-button" onClick={() => setShowSortWindow(!showSortWindow)}>🔄 Sort</button>
                    <button className="group-button">🔍 Group by</button>
                </div>
                {showSortWindow && (
                    <div className="sort-window">
                        <h4>Sort Tasks</h4>
                        <label>
                            Field:
                            <select
                                value={sortColumn}
                                onChange={(e) => setSortColumn(e.target.value)}
                                style={{ marginLeft: '5px' }}
                            >
                                {availableFields.map((field) => (
                                    <option key={field.field} value={field.field}>
                                        {field.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label style={{ marginLeft: '15px' }}>
                            Order:
                            <select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                style={{ marginLeft: '5px' }}
                            >
                                <option value="asc">Ascending</option>
                                <option value="desc">Descending</option>
                            </select>
                        </label>
                    </div>
                )}
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
                        <th>Start date</th>
                        <th>Priority</th>
                        <th>Group</th>
                    </tr>
                </thead>
                <tbody>
                    {(Array.isArray(tasks) ? tasks : []).map((task) => (
                        <tr key={task.id}>
                            <td><input type="checkbox" onChange={() => handleTaskSelection(task.id)} checked={selectedTaskIds.includes(task.id)}/></td>
                            <td>{task.id}</td>
                            <td onClick={() => handleFieldClick(task.id, 'task_name')}>
                                {editingTaskId === task.id && editingField === 'task_name' ? (
                                    <input
                                        type="text"
                                        name="task_name"
                                        value={editedTask.task_name || ''}
                                        onChange={handleInputChange}
                                        onBlur={() => handleBlur(task.id)}
                                        autoFocus
                                    />
                                ) : (
                                    <Link to={`/tasks/${task.id}`}>{task.task_name}</Link>
                                )}
                            </td>
                            <td onClick={() => handleFieldClick(task.id, 'task_description')}>
                                {editingTaskId === task.id && editingField === 'task_description' ? (
                                    <input
                                        type="text"
                                        name="task_description"
                                        value={editedTask.task_description || ''}
                                        onChange={handleInputChange}
                                        onBlur={() => handleBlur(task.id)}
                                        autoFocus
                                    />
                                ) : (
                                    task.task_description
                                )}
                            </td>
                            <td onClick={() => handleFieldClick(task.id, 'owner_id')}>
                                {editingTaskId === task.id && editingField === 'owner_id' ? (
                                    <input
                                        type="text"
                                        name="owner_id"
                                        value={editedTask.owner_id || ''}
                                        onChange={handleInputChange}
                                        onBlur={() => handleBlur(task.id)}
                                        autoFocus
                                    />
                                ) : (
                                    task.owner_id
                                )}
                            </td>
                            <td onClick={() => handleFieldClick(task.id, 'start_date')}>
                                {editingTaskId === task.id && editingField === 'start_date' ? (
                                    <input
                                        type="datetime-local"
                                        name="start_date"
                                        value={editedTask.start_date || ''}
                                        onChange={handleInputChange}
                                        onBlur={() => handleBlur(task.id)}
                                        autoFocus
                                    />
                                ) : (
                                    task.start_date
                                )}
                            </td>
                            <td onClick={() => handleFieldClick(task.id, 'due_date')}>
                                {editingTaskId === task.id && editingField === 'due_date' ? (
                                    <input
                                        type="datetime-local"
                                        name="due_date"
                                        value={editedTask.due_date || ''}
                                        onChange={handleInputChange}
                                        onBlur={() => handleBlur(task.id)}
                                        autoFocus
                                    />
                                ) : (
                                    task.due_date
                                )}
                            </td>
                            <td onClick={() => handleFieldClick(task.id, 'priority')}>
                                {editingTaskId === task.id && editingField === 'priority' ? (
                                    <input
                                        type="text"
                                        name="priority"
                                        value={editedTask.priority || ''}
                                        onChange={handleInputChange}
                                        onBlur={() => handleBlur(task.id)}
                                        autoFocus
                                    />
                                ) : (
                                    task.priority
                                )}
                            </td>
                            <td onClick={() => handleFieldClick(task.id, 'group_name')}>
                                {editingTaskId === task.id && editingField === 'group_name' ? (
                                    <input
                                        type="text"
                                        name="group_name"
                                        value={editedTask.group_name || ''}
                                        onChange={handleInputChange}
                                        onBlur={() => handleBlur(task.id)}
                                        autoFocus
                                    />
                                ) : (
                                    task.group_name
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
                                type="datetime-local"
                                name="start_date"
                                value={newTask.start_date}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group><br />

                        <Form.Group>
                            <Form.Label>Due Date</Form.Label>
                            <Form.Control
                                type="datetime-local"
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
