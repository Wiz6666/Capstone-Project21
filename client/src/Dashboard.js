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
  });

  // 使用 useEffect 在组件挂载时发起请求
  useEffect(() => {
    fetch('http://localhost:5001/dashboard-data', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',  // 明确使用 CORS 模式
    })
      .then(response => {
        console.log('Response from backend:', response);  // 打印完整的响应对象

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        return response.json();  // 确保 response 转换为 JSON
      })
      .then(data => {
        console.log('Received data from backend:', data);  // 打印从后端收到的数据


        // 更新 state
        setDashboardData({
          totalTasks: data.totalTasks || 0,
          toDoTasks: data.toDoTasks || 0,
          inProgressTasks: data.inProgressTasks || 0,
          completedTasks: data.completedTasks || 0,
        });
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);  // 空数组意味着只在组件挂载时运行

  // 数据用于展示图表
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
      <div className="dashboard-content">
        <h1>PMS DASHBOARD</h1>
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
    </div>
  );
}

export default DashboardPage;
