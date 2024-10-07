import React, { useState, useEffect } from 'react';
import '../styles/DashboardPage.css';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList } from 'recharts';

// Color palette for charts
const COLORS = ['#0088FE', '#FF8042', '#FFBB28'];

const DashboardPage = () => {
  // State to hold the dashboard data fetched from the API
  const [dashboardData, setDashboardData] = useState({
    totalTasks: 0,            // Total number of tasks
    toDoTasks: 0,             // Number of tasks in "To Do" status
    inProgressTasks: 0,       // Number of tasks in "In Progress" status
    completedTasks: 0,        // Number of completed tasks
    highPriority: 0,          // Number of high-priority tasks
    mediumPriority: 0,        // Number of medium-priority tasks
    lowPriority: 0,           // Number of low-priority tasks
    taskCompletionRate: 0,    // Percentage of tasks completed
    startDates: [],           // Array of task start dates
    dueDates: [],             // Array of task due dates
    taskname_duration: [],    // Array of task names and their durations
    durations: [],            // Array of task durations
    groupTaskCounts: [],      // Array of task counts by group
  });

  // Define the base URL for API requests using environment variables
  const baseUrl = `${window.location.protocol}//${window.location.hostname}:${process.env.REACT_APP_API_PORT}`;

  // Fetch dashboard data from the API when the component is mounted
  useEffect(() => {
    fetch(`${baseUrl}/dashboard-data?timestamp=${new Date().getTime()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',                 // Enable CORS for cross-origin requests
      credentials: 'same-origin',   // Include credentials (cookies) if necessary
    })
      .then(response => {
        console.log('Response Status:', response.status);
        console.log('Response Headers:', response.headers.get('content-type'));
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (data) {
          console.log('Received data:', data);
          // Update state with the fetched data
          setDashboardData({
            totalTasks: data.totalTasks || 0,
            toDoTasks: data.toDoTasks || 0,
            inProgressTasks: data.inProgressTasks || 0,
            completedTasks: data.completedTasks || 0,
            taskCompletionRate: data.taskCompletionRate || 0,
            highPriority: data.highPriority || 0,
            mediumPriority: data.mediumPriority || 0,
            lowPriority: data.lowPriority || 0,
            groupTaskCounts: data.groupTaskCounts || [],
            taskname_duration: data.taskname_duration || [],
            durations: data.durations || [],
            startDates: data.startDates || [],
            dueDates: data.dueDates || [],
          });
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, [baseUrl]); // The effect depends on the baseUrl, so it runs when baseUrl changes

  // Define the data for the Pie chart to show task priorities
  const dataPriorityPie = [
    { name: 'High Priority', value: dashboardData.highPriority },
    { name: 'Medium Priority', value: dashboardData.mediumPriority },
    { name: 'Low Priority', value: dashboardData.lowPriority },
  ];

  // Define the data for the Bar chart showing tasks by status
  const dataStatusBar = [
    { name: 'To Do', tasks: dashboardData.toDoTasks },
    { name: 'In Progress', tasks: dashboardData.inProgressTasks },
    { name: 'Completed', tasks: dashboardData.completedTasks },
  ];

  // Define the data for the Pie chart to show tasks by group
  const dataGroupPie = dashboardData.groupTaskCounts.map(group => ({
    name: group.groupName,
    value: group.taskCount,
  }));

  // Define the data for the Bar chart showing task durations
  const dataDurationsBar = dashboardData.taskname_duration.map((taskName, index) => ({
    name: taskName,
    duration: dashboardData.durations[index],
  }));

  return (
    <div className="dashboard-container">
      {/* First page of the dashboard */}
      <div className="dashboard-content">
        <h1>PMS DASHBOARD - CORE DATA</h1>
        <div className="task-cards">
          <div className="task-card">
            <h2>COMPLETED PROJECT</h2>
            <p>{dashboardData.completedTasks}</p>
          </div>
          <div className="task-card">
            <h2>IN PROGRESS PROJECT</h2>
            <p>{dashboardData.inProgressTasks}</p>
          </div>
          <div className="task-card">
            <h2>TO DO PROJECT</h2>
            <p>{dashboardData.toDoTasks}</p>
          </div>
          <div className="task-card">
            <h2>PROJECT COMPLETION RATE</h2>
            <p>{dashboardData.taskCompletionRate}</p>
          </div>
        </div>

        <div className="charts">
          <div className="chart">
            <h2>ALL PROJECT BY PRIORITY</h2>
            {/* Pie chart showing distribution of task priorities */}
            <PieChart width={250} height={250}>
              <Pie
                data={dataPriorityPie}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {dataPriorityPie.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend layout="horizontal" align="center" verticalAlign="bottom" />
              <Tooltip />
            </PieChart>
          </div>

          <div className="chart">
            <h2>PROJECT COMPLETION BY STATUS</h2>
            {/* Bar chart showing tasks grouped by status */}
            <BarChart
              width={350}
              height={250}
              data={dataStatusBar}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="tasks" fill="#82ca9d">
                <LabelList dataKey="tasks" position="right" />
              </Bar>
            </BarChart>
          </div>
        </div>
      </div>

      {/* Second page of the dashboard */}
      <div className="dashboard-content">
        <h1>PMS DASHBOARD - GROUP DATA</h1>

        <div className="charts">
          <div className="chart">
            <h2>PROJECT BY GROUP</h2>
            {/* Pie chart showing project distribution by group */}
            <PieChart width={250} height={250}>
              <Pie
                data={dataGroupPie}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {dataGroupPie.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend layout="horizontal" align="center" verticalAlign="bottom" />
              <Tooltip />
            </PieChart>
          </div>

          <div className="chart">
            <h2>PROJECT DURATIONS</h2>
            {/* Bar chart showing task durations */}
            <BarChart
              layout="vertical"
              width={250}
              height={250}
              data={dataDurationsBar}
              margin={{
                top: 5, right: 30, left: 20, bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" />
              <Tooltip />
              <Legend />
              <Bar dataKey="duration" fill="#82ca9d">
                <LabelList dataKey="duration" position="right" />
              </Bar>
            </BarChart>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
