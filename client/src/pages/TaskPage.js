import React, { useState, useEffect } from 'react';
import '../styles/TaskPage.css';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from 'react-bootstrap';
import debounce from 'lodash.debounce';

const TaskList = () => {
  const { projectId } = useParams(); // Get the project ID
  const [projectName, setProjectName] = useState(''); // New: Store project name
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    task_name: '',
    task_description: '',
    owner_id: '',
    start_date: '',
    due_date: '',
    task_status: '',
    priority: '',
    group_name: ''
  });
  const openFilterModal = () => setShowFilterModal(true);
  const closeFilterModal = () => setShowFilterModal(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [groups, setGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState('');
  const openGroupModal = () => setShowGroupModal(true);
  const closeGroupModal = () => setShowGroupModal(false);
  const [showSortWindow, setShowSortWindow] = useState(false);
  const [newTask, setNewTask] = useState({
    task_name: '',
    task_description: '',
    owner_id: '',
    start_date: '',
    due_date: '',
    task_status: '',
    priority: '',
    group_id: '',
    assignees: [],
    new_group_name: ''
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
    { name: 'Assignees', field: 'assignees' },
    { name: 'Status', field: 'task_status' },
    { name: 'Priority', field: 'priority' },
    { name: 'Group', field: 'group_name' }
  ]);

  // New: Get project name
  const fetchProjectName = async () => {
    if (!projectId) {
      console.error('No project ID provided.');
      return;
    }

    const { data, error } = await supabase
      .from('projects')
      .select('title') // Assuming the project name is stored in the 'title' field
      .eq('id', projectId)
      .single();

    if (error) {
      console.error('Error fetching project name:', error.message);
    } else {
      setProjectName(data.title);
    }
  };

  useEffect(() => {
    fetchProjectName(); // Get the project name when the component is mounted
  }, [projectId]);

  useEffect(() => {
    const fetchGroups = async () => {
      const { data, error } = await supabase
        .from('groups')
        .select('*'); // Fetch all groups

      if (error) {
        console.error('Error fetching groups:', error.message);
      } else {
        setGroups(data); // Update state with fetched groups
      }
    };

    fetchGroups(); // Call the fetch function on component mount
  }, []);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error.message);
      } else {
        setCurrentUser(data.user);
      }
    };

    fetchCurrentUser();
  }, []);

  const fetchUsers = async () => {
    const { data: usersData, error } = await supabase.from('Users').select('user_id, username');
    if (error) {
      console.error('Error fetching users:', error.message);
    } else {
      setUsers(usersData);
      console.log('Fetched users:', usersData);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchTasks = async (query = '') => {
    if (!projectId) {
      console.error('No project ID provided.');
      return;
    }

    const { data, error } = await supabase
      .from('tasks')
      .select('*, Users:owner_id (username), group:group_id (name)')
      .eq('project_id', projectId) // Get only the tasks for the current project
      .or(`task_name.ilike.%${query}%,task_description.ilike.%${query}%`)
      .order(sortColumn, { ascending: sortOrder === 'asc' });

    if (error) {
      console.error('Error fetching tasks:', error.message);
    } else {
      console.log('Fetched tasks:', data); // Log the data to see its structure
      if (Array.isArray(data)) {
        setTasks(data);
      } else {
        console.error('Data is not an array:', data);
      }
    }
  };

  const debouncedFetchTasks = debounce(fetchTasks, 500);

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  useEffect(() => {
    debouncedFetchTasks(searchQuery);
  }, [searchQuery, sortColumn, sortOrder, projectId]);

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
    const taskToEdit = tasks.find((task) => task.id === taskId);
    setEditedTask({
      ...taskToEdit,
      assignees: Array.isArray(taskToEdit.assignees) ? taskToEdit.assignees : [],  // Keep existing array or initialize to empty
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Check if we're editing the group field
    if (name === "group_id") {
      if (value === "create_new") {
        setNewTask((prevTask) => ({
          ...prevTask,
          group_id: value, // Set the group_id to 'create_new'
          new_group_name: '', // Reset new_group_name
        }));
      } 
      else if (editingTaskId) {
        console.log("Selected existing group");
        setEditedTask((prevTask) => ({
          ...prevTask,
          group_id: value,  // Set the group_id to the selected value
        }));
      }
      else {
        setNewTask((prevTask) => ({
          ...prevTask,
          group_id: value,  // Set the group_id to the selected value
        }));
      }
    } 
    else if (name === "assignees") {
      const selectedAssignees = Array.from(e.target.selectedOptions, option => option.value);
      if (editingTaskId){
        console.log('Selected assignees:', selectedAssignees);
        setEditedTask((prevTask) => ({
          ...prevTask,
          assignees: selectedAssignees, // Store the selected assignees
        }));
      }
      else {
        setNewTask((prevTask) => ({
          ...prevTask,
          assignees: selectedAssignees, // Store the selected assignees
        }));
      }
    } else {
      // Handle other input fields (single values)
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
    }
  };          

  useEffect(() => {
    console.log('Edited task state updated:', editedTask);
  }, [editedTask]);

  const handleCreateGroup = async () => {
    if (!currentUser) {
      console.error('User is not authenticated.');
      return;
    }

    // Log to verify currentUser
    console.log('Current User ID:', currentUser.id);

    const { data: userData, error: userError } = await supabase
      .from('Users')
      .select('role') // Fetch the user's role
      .eq('user_id', currentUser.id) // Replace with your logic to get the current username
      .single();

    if (userError) {
      console.error('Error fetching user role:', userError.message);
      return;
    }

    const userRole = userData?.role;

    // Check if the user is an admin
    if (userRole !== 'Admin') {
      alert('You do not have permission to create a new group.');
      return; // Stop execution if not admin
    }

    // Proceed with group creation
    const { data: groupData, error: groupError } = await supabase
      .from('groups')
      .insert([{ name: newGroupName }])
      .select('id, name') // Select both id and name for the new group
      .single();

    if (groupError) {
      console.error('Error creating new group:', groupError.message);
      return;
    }

    // Update the groups state to include the newly created group
    setGroups((prevGroups) => [
      ...prevGroups,
      { id: groupData.id, name: newGroupName }, // Add the new group to the state
    ]);

    // Reset the new group name input field
    setNewGroupName('');
  };        

  // Remove an existing group
  const handleRemoveGroup = async (groupId) => {
    if (!currentUser) {
      console.error('User is not authenticated.');
      return;
    }

    // Log to verify currentUser
    console.log('Current User ID:', currentUser.id);

    const { data: userData, error: userError } = await supabase
      .from('Users')
      .select('role') // Fetch the user's role
      .eq('user_id', currentUser.id) // Replace with your logic to get the current username
      .single();

    if (userError) {
      console.error('Error fetching user role:', userError.message);
      return;
    }

    const userRole = userData?.role;

    // Check if the user is an admin
    if (userRole !== 'Admin') {
      alert('You do not have permission to remove a group.');
      return; // Stop execution if not admin
    }

    try {
      const { error } = await supabase
        .from('groups')
        .delete()
        .eq('id', groupId);

      if (error) {
        console.error('Error removing group:', error.message);
        return;
      }

      setGroups(prevGroups => prevGroups.filter(group => group.id !== groupId));
    } catch (err) {
      console.error('Error while removing group:', err.message);
    }
  };
    
  const handleNewTaskSubmit = async (e) => {
    e.preventDefault();

    const { task_name, task_description, owner_id, assignees, start_date, due_date, task_status, priority, group_name } = newTask;

    try {
      let groupId = null; // Variable to hold the group_id

      // Check if the group exists or needs to be created
      if (group_name && !['Executive', 'Community and Culture', 'Marketing and Communications', 'Finance', 'Operations', 'Partnerships', 'Technology'].includes(group_name)) {
        // If it's a custom group, insert it into the 'groups' table
        const { data: groupData, error: groupError } = await supabase
          .from('groups')
          .insert([{ name: group_name }]) // Insert the custom group
          .select('id') // Fetch the group_id after insertion
          .single();

        if (groupError) {
          console.error('Error creating new group:', groupError.message);
          return;
        }

        groupId = groupData?.id; // Set the group_id from the newly created group
      } else if (group_name) {
        // If it's a predefined group, fetch its group_id from the 'groups' table
        const { data: existingGroup, error: fetchGroupError } = await supabase
          .from('groups')
          .select('id')
          .eq('name', group_name)
          .single();

        if (fetchGroupError) {
          console.error('Error fetching existing group:', fetchGroupError.message);
          return;
        }

        groupId = existingGroup?.id; // Set the group_id from the fetched group
      }

      // **Use owner_id directly instead of querying username**
      const actualOwnerId = owner_id;

      if (!actualOwnerId) {
        console.error('No owner ID provided.');
        return;
      }
      
      // When inserting a new task, make sure to set project_id to the ID of the current project.
      const { data, error } = await supabase
        .from('tasks')
        .insert([
          { 
            task_name, 
            task_description, 
            owner_id: actualOwnerId, 
            assignees, 
            start_date, 
            due_date, 
            task_status, 
            priority, 
            group_id: groupId, 
            project_id: projectId // Set project_id
          },
        ]);

      if (error) {
        console.error('Error adding new task:', error.message);
      } else {
        if (Array.isArray(data)) {
          console.log('New task added:', data);
          setTasks(prevTasks => [...prevTasks, ...data]);
        } else {
          console.error('Expected data to be an array, but got:', data);
        }

        await fetchTasks();
        closeModal();
      }
    } catch (err) {
      console.error('Error while adding new task:', err.message);
    }
  };            

  const handleDeleteTask = async () => {
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
        console.error('Error deleting task:', error.message);
        return;
      }
      setTasks((prevTasks) => prevTasks.filter((task) => !selectedTaskIds.includes(task.id)));
      setSelectedTaskIds([]); // Reset the selected task after deletion
    } catch (err) {
      console.error('Error:', err.message);
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

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handleBlur = async (taskId, fieldName) => {
    try {
      // Create a shallow copy of editedTask
      const validEditedTask = { ...editedTask };

      console.log('Assignees after update:', validEditedTask);

      // Clean unnecessary fields like Users and groups
      delete validEditedTask.Users;
      delete validEditedTask.groups;

      // Additional validation for specific fields if necessary
      if (fieldName === 'owner_id' && !editedTask.owner_id) {
        console.error('Invalid owner_id:', editedTask.owner_id);
        return;
      }

      if (fieldName === 'group_id' && !editedTask.group_id) {
        console.error('Invalid group_id:', editedTask.group_id);
        return;
      }

      // Check for assignees validity
      if (fieldName === 'assignees') {
        // Assuming assignees should not be null or empty
        if (!Array.isArray(validEditedTask.assignees) || editedTask.assignees.length === 0) {
          console.error('Invalid assignees:', editedTask.assignees);
          return;
        }
      }

      // Perform the update for the task
      const { error } = await supabase
        .from('tasks')
        .update(validEditedTask) // Update all fields at once
        .eq('id', taskId);

      if (error) {
        console.error('Error updating task:', error.message);
        return;
      }

      // Optimistically update the local state with the new changes
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, ...validEditedTask } : task
        )
      );

      await fetchTasks();

      // Exit the editing mode
      setEditingTaskId(null);
      setEditingField(null);
    } catch (err) {
      console.error('Error updating task:', err.message);
    }
  };    

  const applyFilters = async () => {
    try {
      if (!projectId) {
        console.error('No project ID provided for filtering.');
        return;
      }

      let query = supabase.from('tasks').select('*, Users:owner_id (username), group:group_id (name)').eq('project_id', projectId);

      // Apply task_name filter
      if (filters.task_name) {
        query = query.ilike('task_name', `%${filters.task_name}%`);
      }

      // Apply task_description filter
      if (filters.task_description) {
        query = query.ilike('task_description', `%${filters.task_description}%`);
      }

      // Apply owner_id filter
      if (filters.owner_id) {
        query = query.eq('owner_id', filters.owner_id);
      }

      // Apply start_date filter
      if (filters.start_date) {
        query = query.gte('start_date', filters.start_date);
      }

      // Apply due_date filter
      if (filters.due_date) {
        query = query.lte('due_date', filters.due_date);
      }

      // Apply task_status filter
      if (filters.task_status) {
        query = query.eq('task_status', filters.task_status);
      }

      // Apply priority filter
      if (filters.priority) {
        query = query.eq('priority', filters.priority);
      }

      // Apply group_name filter
      if (filters.group_name) {
        const { data: groupData, error: groupError } = await supabase
          .from('groups')
          .select('id')
          .eq('name', filters.group_name)
          .single();

        if (groupError) {
          console.error('Error fetching group ID for filtering:', groupError.message);
          return;
        }

        if (groupData) {
          query = query.eq('group_id', groupData.id);
        }
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching filtered tasks:', error.message);
      } else {
        console.log('Filtered tasks:', data);
        setTasks(data); // Update the tasks state with the filtered results
      }
    } catch (error) {
      console.error('Error applying filters:', error.message);
    }
  };

  return (
    <div className="task-list-page">
      <div className="task-list">
        <div className="task-list-header">
          {/* Modify the title of the current project name */}
          <h1>{projectName ? `${projectName} Tasks` : 'PROJECT TASKS'}</h1>
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
          <Button 
            variant="danger" 
            className="delete-task-button" 
            onClick={handleDeleteTask} 
            disabled={selectedTaskIds.length === 0}
          >
            DELETE TASKS
          </Button>
          <div className="task-list-actions">
            <button className="filter-button" onClick={openFilterModal}>🔍 Filter</button>
            <button className="sort-button" onClick={() => setShowSortWindow(!showSortWindow)}>🔄 Sort</button>
            <button className="group-button">🔍 Group by</button>
          </div>
          <Modal show={showFilterModal} onHide={closeFilterModal}>
            <Modal.Header closeButton>
              <Modal.Title>Filter Tasks</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group>
                <Form.Label>Task Status</Form.Label>
                <Form.Select name="task_status" value={filters.task_status} onChange={handleFilterChange}>
                  <option value="">All</option>
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Completed">Completed</option>
                </Form.Select>
              </Form.Group>
              <br />

              <Form.Group>
                <Form.Label>Priority</Form.Label>
                <Form.Select name="priority" value={filters.priority} onChange={handleFilterChange}>
                  <option value="">All</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </Form.Select>
              </Form.Group>
              <br />

              <Form.Group>
                <Form.Label>Group</Form.Label>
                <Form.Select
                  name="group_name"
                  value={filters.group_name}
                  onChange={handleFilterChange}
                >
                  <option value="">All</option>
                  {groups.map((group) => (
                    <option key={group.id} value={group.name}>
                      {group.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={closeFilterModal}>
                Close
              </Button>
              <Button variant="primary" onClick={() => { closeFilterModal(); applyFilters(); }}>
                Apply Filters
              </Button>
            </Modal.Footer>
          </Modal>
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
              <th>Assignees</th>
              <th>Start date</th>
              <th>Due date</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Group</th>
            </tr>
          </thead>
          <tbody>
            {(Array.isArray(tasks) ? tasks : []).map((task) => (
              <tr key={task.id}>
                <td>
                  <input 
                    type="checkbox" 
                    onChange={() => handleTaskSelection(task.id)} 
                    checked={selectedTaskIds.includes(task.id)}
                    aria-label={`Select task ${task.task_name}`}
                  />
                </td>
                <td>{task.id}</td>
                <td onClick={() => handleFieldClick(task.id, 'task_name')}>
                  {editingTaskId === task.id && editingField === 'task_name' ? (
                    <input
                      type="text"
                      name="task_name"
                      value={editedTask.task_name || ''}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur(task.id, 'task_name')}
                      autoFocus
                    />
                  ) : (
                    <Link to={`/tasks/${task.id}`} className="custom-link">{task.task_name}</Link>
                  )}
                </td>

                <td onClick={() => handleFieldClick(task.id, 'task_description')}>
                  {editingTaskId === task.id && editingField === 'task_description' ? (
                    <input
                      type="text"
                      name="task_description"
                      value={editedTask.task_description || ''}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur(task.id, 'task_description')}
                      autoFocus
                    />
                  ) : (
                    task.task_description
                  )}
                </td>
                <td onClick={() => handleFieldClick(task.id, 'owner_id')}>
                  {editingTaskId === task.id && editingField === 'owner_id' ? (
                    <select
                      name="owner_id"
                      value={editedTask.owner_id || ''}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur(task.id, 'owner_id')}
                      autoFocus
                    >
                      <option value="">Select Owner</option>
                      {users.map((user) => (
                        <option key={user.user_id} value={user.user_id}>
                          {user.username}
                        </option>
                      ))}
                    </select>
                  ) : (
                    task.Users?.username || 'No Username'
                  )}
                </td>
                <td onClick={() => handleFieldClick(task.id, 'assignees')}>
                  {editingTaskId === task.id && editingField === 'assignees' ? (
                    <select
                      name="assignees"
                      multiple
                      value={editedTask?.assignees || newTask?.assignees || []}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur(task.id, 'assignees')}
                      autoFocus
                    >
                      {users.map((user) => (
                        <option key={user.user_id} value={user.user_id}>
                          {user.username}
                        </option>
                      ))}
                    </select>
                  ) : (
                    task.assignees && task.assignees.length > 0 ? (
                      // Display all assignees as links to their profiles, separated by commas
                      task.assignees.map((assigneeId, index) => {
                        const assignee = users.find(user => user.user_id === assigneeId);
                        return assignee ? (
                          <React.Fragment key={assigneeId}>
                            <Link to={`/profile/${assigneeId}`} className="custom-link">
                              {assignee.username}
                            </Link>
                            {index < task.assignees.length - 1 && ', '}
                          </React.Fragment>
                        ) : null;
                      })
                    ) : (
                      'No Assignees'
                    )
                  )}
                </td>
                <td onClick={() => handleFieldClick(task.id, 'start_date')}>
                  {editingTaskId === task.id && editingField === 'start_date' ? (
                    <input
                      type="datetime-local"
                      name="start_date"
                      value={editedTask.start_date || ''}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur(task.id, 'start_date')}
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
                      onBlur={() => handleBlur(task.id, 'due_date')}
                      autoFocus
                    />
                  ) : (
                    task.due_date
                  )}
                </td>
                <td onClick={() => handleFieldClick(task.id, 'task_status')}>
                  {editingTaskId === task.id && editingField === 'task_status' ? (
                    <select
                      name="task_status"
                      value={editedTask.task_status || ''}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur(task.id, 'task_status')}
                      autoFocus
                    >
                      <option value="">Select Status</option>
                      <option value="Not Started">Not Started</option>
                      <option value="In Progress">In Progress</option>
                      <option value="On Hold">On Hold</option>
                      <option value="Completed">Completed</option>
                    </select>
                  ) : (
                    task.task_status
                  )}
                </td>
                <td onClick={() => handleFieldClick(task.id, 'priority')}>
                  {editingTaskId === task.id && editingField === 'priority' ? (
                    <select
                      name="priority"
                      value={editedTask.priority || ''}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur(task.id, 'priority')}
                      autoFocus
                    >
                      <option value="">Select Priority</option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  ) : (
                    task.priority
                  )}
                </td>
                <td onClick={() => handleFieldClick(task.id, 'group_id')}>
                  {editingTaskId === task.id && editingField === 'group_id' ? (
                    <select
                      name="group_id"
                      value={editedTask.group_id || ''}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur(task.id, 'group_id')}
                      autoFocus
                    >
                      <option value="">Select Group</option>
                      {groups.map((group) => (
                        <option key={group.id} value={group.id}>
                          {group.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    task.group?.name || 'No Group'
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
                <Form.Label>Task Owner</Form.Label>
                <Form.Select
                  name="owner_id"
                  value={newTask.owner_id}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Owner</option>
                  {users.map((user) => (
                    <option key={user.user_id} value={user.user_id}>
                      {user.username}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group><br />

              <Form.Group>
                <Form.Label>Task Assignees</Form.Label>
                <Form.Select
                  name="assignees"
                  value={newTask.assignees} // Bind the assignees state
                  onChange={handleInputChange}
                  multiple // Allow multiple selections
                >
                  {users.map((user) => (
                    <option key={user.user_id} value={user.user_id}>
                      {user.username}
                    </option>
                  ))}
                </Form.Select>
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
                <Form.Label>Task Status</Form.Label>
                <Form.Select
                  name="task_status"
                  value={newTask.task_status}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Status</option>
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Completed">Completed</option>
                </Form.Select>
              </Form.Group><br />

              <Form.Group>
                <Form.Label>Priority</Form.Label>
                <Form.Select
                  name="priority"
                  value={newTask.priority}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Priority</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </Form.Select>
              </Form.Group><br />

              <Form.Group>
                <Form.Label>Group</Form.Label>
                <Form.Select
                  name="group_name"
                  value={newTask.group_name}
                  onChange={handleInputChange}
                >
                  <option value="">Select Group</option>
                  {groups.map((group) => (
                    <option key={group.id} value={group.name}>
                      {group.name}
                    </option>
                  ))}
                </Form.Select>          

                {/* Button to open the modal for managing groups */}
                <Button variant="link" onClick={openGroupModal}> 
                  Manage Groups
                </Button>
              </Form.Group>

              <Modal show={showGroupModal} onHide={closeGroupModal} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                  <Modal.Title>Manage Groups</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {/* Create new group section */}
                  <h5>Create New Group</h5>
                  <Form.Control
                    type="text"
                    placeholder="Enter new group name"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                  />
                  <Button variant="primary" onClick={handleCreateGroup} className="mt-2">
                    Create Group
                  </Button>                       

                  <hr />                      

                  {/* Current groups section */}
                  <h5>Current Groups</h5>
                  {groups.map((group) => (
                    <div key={group.id} className="d-flex justify-content-between mt-2">
                      <span>{group.name}</span>
                      <Button variant="danger" onClick={() => handleRemoveGroup(group.id)}>
                        Remove
                      </Button>
                    </div>
                  ))}
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={closeGroupModal}>
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>
              
              <Button variant="primary" type="submit">
                Add Task
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default TaskList;
