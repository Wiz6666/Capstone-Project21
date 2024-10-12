import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ProjectPage.css';
import { supabase } from '../supabaseClient';

const ProjectBoard = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editedProjectTitle, setEditedProjectTitle] = useState('');
  const [originalProjectTitle, setOriginalProjectTitle] = useState(''); // Used to store the original project title
  const [errorMessage, setErrorMessage] = useState(''); // Used to display error messages
  const navigate = useNavigate();

  // Get projects and their associated tasks
  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*, tasks_project_id_fkey(*)'); // Use the correct relationship name

    if (error) {
      console.error('Error fetching projects:', JSON.stringify(error, null, 2)); // Improved error logging
      setErrorMessage('Failed to retrieve item, please try again later.');
    } else {
      setProjects(data);
      setErrorMessage('');
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Add Item
  const addProject = async () => {
    const { data, error } = await supabase
      .from('projects')
      .insert([{ title: 'New Project' }]) 
      .select('*, tasks_project_id_fkey(*)') // Use the correct relationship name
      .single();

    if (error) {
      console.error('Error adding project:', JSON.stringify(error, null, 2)); // Improved error logging
      setErrorMessage('Failed to add item, please try again later.');
    } else {
      setProjects([...projects, data]);
      setErrorMessage('');
    }
  };

  // Deleting a Project
  const deleteProjects = async () => {
    if (window.confirm('Are you sure you want to delete the selected items?')) {
      const { error } = await supabase
        .from('projects')
        .delete()
        .in('id', selectedProjects);

      if (error) {
        console.error('Error deleting projects:', JSON.stringify(error, null, 2)); // Improved error logging
        setErrorMessage('Failed to delete item, please try again later.');
      } else {
        setProjects(projects.filter(project => !selectedProjects.includes(project.id)));
        setSelectedProjects([]);
        setErrorMessage('');
      }
    }
  };

  // Select Project
  const toggleProjectSelection = (projectId) => {
    if (selectedProjects.includes(projectId)) {
      setSelectedProjects(selectedProjects.filter(id => id !== projectId));
    } else {
      setSelectedProjects([...selectedProjects, projectId]);
    }
  };

  // Start editing the project title
  const startEditingProject = (projectId, event) => {
    event.stopPropagation(); // Prevent card click events from being triggered
    setEditingProjectId(projectId);
    const project = projects.find(p => p.id === projectId);
    setEditedProjectTitle(project.title);
    setOriginalProjectTitle(project.title); // Save original title
  };

  // Cancel editing the project title and restore it to the original title
  const cancelEditingProject = () => {
    setEditedProjectTitle(originalProjectTitle); // Revert to original title
    setEditingProjectId(null); // Exit editing mode
  };

  // Save the edited project title
  const saveEditedProject = async (projectId) => {
    if (!editedProjectTitle.trim()) {
      // If the item title is empty, cancel the save and revert to the original title
      cancelEditingProject();
      return;
    }

    const { error } = await supabase
      .from('projects')
      .update({ title: editedProjectTitle })
      .eq('id', projectId);

    if (error) {
      console.error('Error updating project:', JSON.stringify(error, null, 2)); // Improved error logging
      setErrorMessage('Failed to update project, please try again later.');
    } else {
      setProjects(projects.map(project => 
        project.id === projectId ? { ...project, title: editedProjectTitle } : project
      ));
      setEditingProjectId(null);
      setEditedProjectTitle('');
      setErrorMessage('');
    }
  };

  // Process project card clicks and navigate to the project's task page
  const handleCardClick = (projectId) => {
    navigate(`/project/${projectId}/tasks`);
  };

  // Set task text color based on priority
  const getTaskPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'red';
      case 'Medium':
        return 'yellow';
      case 'Low':
      default:
        return 'white';
    }
  };

  // Processing Search
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="project-board">
      {/* Header */}
      <header className="header">
        <h1 className="project-board-title">PROJECT BOARD</h1>
        <button className="new-project-btn" onClick={addProject}>NEW PROJECT +</button>
        <button
          className="delete-project-btn"
          onClick={deleteProjects}
          disabled={selectedProjects.length === 0}
        >
          DELETE
        </button>
        <input
          type="search"
          placeholder="Search for project..."
          className="search-bar"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </header>

      {/* Error message */}
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      {/* Projects Container */}
      <div className="projects-container">
        {filteredProjects.length > 0 ? (
          filteredProjects.map(project => (
            <div
              className={`project-card ${selectedProjects.includes(project.id) ? 'selected' : ''}`}
              key={project.id}
              onClick={(e) => {
                // If you click on a project name, you will be redirected to the task page.
                if (!e.target.classList.contains('editable-title') && !e.target.closest('.project-title')) {
                  handleCardClick(project.id);
                }
              }}
            >
              {/* Project selection and title */}
              <div className="project-title">
                <input
                  type="checkbox"
                  checked={selectedProjects.includes(project.id)}
                  onChange={() => toggleProjectSelection(project.id)}
                  className="project-checkbox"
                  aria-label={`Select Project ${project.title}`}
                  onClick={(e) => e.stopPropagation()} // Prevent card click events from being triggered
                />
                {editingProjectId === project.id ? (
                  <input
                    type="text"
                    value={editedProjectTitle}
                    onChange={(e) => setEditedProjectTitle(e.target.value)}
                    onBlur={() => saveEditedProject(project.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        saveEditedProject(project.id);
                      } else if (e.key === 'Escape') {
                        cancelEditingProject(); // Cancel editing when the Escape key is pressed
                      }
                    }}
                    autoFocus
                    className="edit-project-input"
                  />
                ) : (
                  <h2
                    onClick={(e) => startEditingProject(project.id, e)}
                    className="editable-title project-name" // Add class to project name
                    title={project.title} // Show full title on hover
                  >
                    {project.title} {/* Render the full title directly */}
                  </h2>
                )}
              </div>

              {/* Task List */}
              <ul className="task-list">
                {project.tasks_project_id_fkey && project.tasks_project_id_fkey.length > 0 ? (
                  project.tasks_project_id_fkey.map(task => (
                    task.task_name !== 'No tasks yet' ? (  // If task_name is not "No tasks yet", the box is displayed
                      <li key={task.id} className="task-container">
                        <label
                          className="task-label"
                          style={{ color: getTaskPriorityColor(task.priority) }} // Set color based on priority
                        >
                          {task.task_name}
                        </label>
                      </li>
                    ) : null // If there is no valid task, no box is displayed
                  ))
                ) : (
                  null // If there are no tasks, the Project box is empty.
                )}
              </ul>
            </div>
          ))
        ) : (
          <p className="no-projects-message">There are currently no projects. Click "NEW PROJECT +" to add a project.</p>
        )}
      </div>
    </div>
  );
};

export default ProjectBoard;
