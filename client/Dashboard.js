import React, { useState, useEffect } from 'react';
import './DashboardPage.css';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#FF8042', '#FFBB28'];

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState({
    totalTasks: 0,
    toDoTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
    highPriority: 0,  //new
    mediumPriority: 0, //new
    lowPriority: 0,    //new
    taskCompletionRate: 0, // new
    startDates: [],        // new
    dueDates: [],          // new
    statuses: [],          // new
    durations: [],         // new
    groupTaskCounts: [],   // new

  });

  // Use useEffect to get request
  useEffect(() => {
    fetch('http://localhost:5001/dashboard-data', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',  // use  CORS mode
    })
      .then(response => {
        console.log('Response from backend:', response);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        return response.json();  // ensure response to convert to JSON
      })
      .then(data => {
        console.log('Received data from backend:', data);


        // update state
        setDashboardData({
          totalTasks: data.totalTasks || 0,
          toDoTasks: data.toDoTasks || 0,
          inProgressTasks: data.inProgressTasks || 0,
          completedTasks: data.completedTasks || 0,
          highPriority: data.highPriority || 0,
          mediumPriority: data.mediumPriority || 0,
          lowPriority: data.lowPriority || 0,
          taskCompletionRate: data.taskCompletionRate || 0,
          startDates: data.startDates || [],
          dueDates: data.dueDates || [],
          statuses: data.statuses || [],
          durations: data.durations || [],
          groupTaskCounts: data.groupTaskCounts || [],
        });
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);


  // Data for first page charts
  const dataPie = [
    { name: 'Completed', value: dashboardData.completedTasks },
    { name: 'In Progress', value: dashboardData.inProgressTasks },
    { name: 'To Do', value: dashboardData.toDoTasks },
  ];

  const dataBar = [
    { name: 'To Do', tasks: dashboardData.toDoTasks },
    { name: 'In Progress', tasks: dashboardData.inProgressTasks },
    { name: 'Completed', tasks: dashboardData.completedTasks },
  ];

  // Data for second page charts
  const dataPriorityPie = [
    { name: 'Low Priority', value: dashboardData.lowPriority },
    { name: 'Medium Priority', value: dashboardData.mediumPriority },
    { name: 'High Priority', value: dashboardData.highPriority },
  ];

  return (
    <div className="dashboard-container">
      {/* 第一个子页面 */}
      <div className="dashboard-content">
        <h1>PMS DASHBOARD - PAGE 1</h1>
        <div className="task-cards">
          <div className="task-card">
            <h2>COMPLETED TASKS</h2>
            <p>{dashboardData.completedTasks}</p>
            <span>Task count</span>
          </div>
          <div className="task-card">
            <h2>INCOMPLETED TASKS</h2>
            <p>{dashboardData.inProgressTasks}</p>
            <span>Task count</span>
          </div>
          <div className="task-card">
            <h2>OVERDUE TASKS</h2>
            <p>{dashboardData.toDoTasks}</p>
            <span>Task count</span>
          </div>
          <div className="task-card">
            <h2>TOTAL TASKS</h2>
            <p>{dashboardData.totalTasks}</p>
            <span>Task count</span>
          </div>
        </div>
        <div className="charts">
          <div className="chart">
            <h2>ALL TASKS BY COMPLETION STATUS</h2>
            <PieChart width={250} height={250}>
              <Pie
                data={dataPie}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {dataPie.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </div>
          <div className="chart">
            <h2>INCOMPLETED TASKS BY GROUP</h2>
            <BarChart
              width={350}
              height={250}
              data={dataBar}
              margin={{
                top: 5, right: 30, left: 20, bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="tasks" fill="#82ca9d" />
            </BarChart>
          </div>
        </div>
      </div>

      {/* 第二个子页面 */}
      <div className="dashboard-content">
        <h1>PMS DASHBOARD - PAGE 2</h1>
        <div className="task-cards">
          <div className="task-card">
            <h2>LOW PRIORITY TASKS</h2>
            <p>{dashboardData.lowPriority}</p>
            <span>Task count</span>
          </div>
          <div className="task-card">
            <h2>MEDIUM PRIORITY TASKS</h2>
            <p>{dashboardData.mediumPriority}</p>
            <span>Task count</span>
          </div>
          <div className="task-card">
            <h2>HIGH PRIORITY TASKS</h2>
            <p>{dashboardData.highPriority}</p>
            <span>Task count</span>
          </div>
          <div className="task-card">
            <h2>TASK COMPLETION RATE</h2>
            <p>{dashboardData.taskCompletionRate}</p>
            <span>Completion rate</span>
          </div>
        </div>
        <div className="charts">
          <div className="chart">
            <h2>TASK PRIORITY DISTRIBUTION</h2>
            <PieChart width={250} height={250}>
              <Pie
                data={dataPriorityPie}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {dataPriorityPie.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </div>
          <div className="chart">
            <h2>TASK COMPLETION RATE</h2>
            <BarChart
              width={350}
              height={250}
              data={[{ name: 'Completion Rate', tasks: dashboardData.taskCompletionRate }]}
              margin={{
                top: 5, right: 30, left: 20, bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="tasks" fill="#82ca9d" />
            </BarChart>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
