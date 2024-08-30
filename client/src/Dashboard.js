import React from 'react';
import './DashboardPage.css';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const dataPie = [
  { name: 'Completed', value: 100 },
  { name: 'Incomplete', value: 45 },
];

const COLORS = ['#0088FE', '#FF8042'];

const dataBar = [
  { name: 'Group 1', tasks: 5 },
  { name: 'Group 2', tasks: 10 },
  { name: 'Group 3', tasks: 15 },
  { name: 'Group 4', tasks: 20 },
  { name: 'Group 5', tasks: 25 },
];

const DashboardPage = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <h1>PMS DASHBOARD</h1>
        <div className="task-cards">
          <div className="task-card">
            <h2>COMPLETED TASKS</h2>
            <p>100</p>
            <span>Task count</span>
          </div>
          <div className="task-card">
            <h2>INCOMPLETED TASKS</h2>
            <p>45</p>
            <span>Task count</span>
          </div>
          <div className="task-card">
            <h2>OVERDUE TASKS</h2>
            <p>20</p>
            <span>Task count</span>
          </div>
          <div className="task-card">
            <h2>TOTAL TASKS</h2>
            <p>165</p>
            <span>Task count</span>
          </div>
        </div>
        <div className="charts">
          <div className="chart">
            <h2>ALL TASKS BY COMPLETION STATUS</h2>
            <PieChart width={200} height={200}>
              <Pie
                data={dataPie}
                cx={100}
                cy={100}
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
              width={300}
              height={200}
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
      <footer className="footer">
        <p>© 2023 ASEAN-Australia Strategic Youth Partnership Ltd ACN 631 871 184</p>
      </footer>
    </div>
  );
}

export default DashboardPage;
