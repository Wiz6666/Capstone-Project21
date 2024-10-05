import React, { useState, useEffect } from 'react';
import '../styles/DashboardPage.css';
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

  const baseUrl = `${window.location.protocol}//${window.location.hostname}:${process.env.REACT_APP_API_PORT}`;

  useEffect(() => {
    // Fetch data from the backend API dynamically based on the current URL
    fetch(`${baseUrl}/dashboard-data?timestamp=${new Date().getTime()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      credentials: 'same-origin', // or 'include' if working with cookies
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
          // update state with fetched data
          setDashboardData({
            //task基础数据
            totalTasks: data.totalTasks || 0,
            toDoTasks: data.toDoTasks || 0,
            inProgressTasks: data.inProgressTasks || 0,
            completedTasks: data.completedTasks || 0,
            //task完成率
            taskCompletionRate: data.taskCompletionRate || 0,

            //优先级相关数据
            highPriority: data.highPriority || 0,
            mediumPriority: data.mediumPriority || 0,
            lowPriority: data.lowPriority || 0,

            //各个group所属项目数据
            groupTaskCounts: data.groupTaskCounts || [],

            //duration相关数据：
            taskname_duration: data.taskname_duration || [],//获取后端返回的 taskname 
            durations: data.durations || [], // 获取后端返回的 durations 数据
            taskNames: data.taskNames || [], // 获取后端返回的任务名称数据
            startDates: data.startDates || [], // 获取开始日期
            dueDates: data.dueDates || [], // 获取结束日期
          });
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, [baseUrl]);


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