import React, { useState, useEffect } from 'react';
import '../styles/DashboardPage.css';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList } from 'recharts';

const COLORS = ['#0088FE', '#FF8042', '#FFBB28']; // Define colors for pie chart segments

const DashboardPage = () => {
  // State to store data for the first dashboard
  const [dashboardData, setDashboardData] = useState({
    totalTasks: 0,
    toDoTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
    taskPriorityLow: 0,
    taskPriorityMedium: 0,
    taskPriorityHigh: 0,
    taskCompletionRate: 0,
    groupTaskCounts: [],
    durations: [], // 初始化为一个空数组
    taskNames: [], // 初始化为任务名称
    startDates: [], // 新增：从后端获取的开始日期
    dueDates: [], // 新增：从后端获取的结束日期
  });

  // Fetch dashboard data from backend API on component mount
  useEffect(() => {
    fetch('http://localhost:5001/dashboard-data')
      .then(response => response.json())
      .then(data => {
        // 将后端数据存储到 state 中
        setDashboardData({
          totalTasks: data.totalTasks || 0,
          toDoTasks: data.toDoTasks || 0,
          inProgressTasks: data.inProgressTasks || 0,
          completedTasks: data.completedTasks || 0,
          taskPriorityLow: data.lowPriority || 0,
          taskPriorityMedium: data.mediumPriority || 0,
          taskPriorityHigh: data.highPriority || 0,
          taskCompletionRate: data.taskCompletionRate || 0,
          groupTaskCounts: data.groupTaskCounts || [],
          durations: data.durations || [], // 获取后端返回的 durations 数据
          taskNames: data.taskNames || [], // 获取后端返回的任务名称数据
          startDates: data.startDates || [], // 获取开始日期
          dueDates: data.dueDates || [], // 获取结束日期
        });
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  // 计算每个任务的持续时间（以天为单位）
  const dataDurationsBar = dashboardData.taskNames.map((name, index) => {
    const startDate = new Date(dashboardData.startDates[index]);
    const dueDate = new Date(dashboardData.dueDates[index]);
    const duration = (dueDate - startDate) / (1000 * 60 * 60 * 24); // 计算天数
    return {
      name,
      duration: duration || 0,
    };
  });

  // Data for pie chart (Group Task Count)
  const dataGroupPie = dashboardData.groupTaskCounts.map(group => ({
    name: group.groupName,
    value: group.taskCount,
  }));

  // Data for pie chart on the first page (Task Priorities)
  const dataPriorityPie = [
    { name: 'Low Priority', value: dashboardData.taskPriorityLow },
    { name: 'Medium Priority', value: dashboardData.taskPriorityMedium },
    { name: 'High Priority', value: dashboardData.taskPriorityHigh },
  ];

  // Data for project completion status
  const dataStatusBar = [
    { name: 'To Do', tasks: dashboardData.toDoTasks },
    { name: 'In Progress', tasks: dashboardData.inProgressTasks },
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
