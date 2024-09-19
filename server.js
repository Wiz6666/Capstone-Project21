const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');  // Import the CORS package
const db = require('./db');
const path = require('path');
require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');
const app = express();
const port = 5001;
app.listen(5001, () => {
    console.log('Server running on http://localhost:5001');
});

app.use(cors({
    origin: 'http://localhost:3000',
    methods: 'GET, POST, OPTIONS',
    allowedHeaders: 'Content-Type',
}));
// deal with OPTIONS request
app.options('/dashboard-data', (req, res) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.sendStatus(200);
});

// from .env file to get  Supabase setting;and clients can  set their own Supabase URL and API key 
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);


// collect dashboard data
app.get('/dashboard-data', async (req, res) => {
    try {
        console.log('Received request at /dashboard-data');

        // Get data from the Supabase 
        const { data: totalTasksData, error: totalTasksError } = await supabase
            .from('tasks')
            .select('*');

        if (totalTasksError) {
            console.error('Error fetching total tasks:', totalTasksError);
            return res.status(500).json({ error: 'Error fetching total tasks' });
        }

        // calculate the total tasks
        const totalTasks = totalTasksData.length;

        // Get "To Do" status tasks
        const { data: toDoTasksData, error: toDoTasksError } = await supabase
            .from('tasks')
            .select('*')
            .eq('task_status', 'To do');

        if (toDoTasksError) {
            console.error('Error fetching To Do tasks:', toDoTasksError);
            return res.status(500).json({ error: 'Error fetching To Do tasks' });
        }
        const toDoTasks = toDoTasksData.length;

        // Get "In Progress" status tasks
        const { data: inProgressTasksData, error: inProgressTasksError } = await supabase
            .from('tasks')
            .select('*')
            .eq('task_status', 'In progress');

        if (inProgressTasksError) {
            console.error('Error fetching In Progress tasks:', inProgressTasksError);
            return res.status(500).json({ error: 'Error fetching In Progress tasks' });
        }
        const inProgressTasks = inProgressTasksData.length;



        // Get "Completed" status tasks
        const { data: completedTasksData, error: completedTasksError } = await supabase
            .from('tasks')
            .select('*')
            .eq('task_status', 'completed');

        if (completedTasksError) {
            console.error('Error fetching Completed tasks:', completedTasksError);
            return res.status(500).json({ error: 'Error fetching Completed tasks' });
        }
        const completedTasks = completedTasksData.length;

        console.log("totalTasks:", totalTasks,
            "toDoTasks:", toDoTasks,
            "inProgressTasks,", inProgressTasks,
            "completedTasks,", completedTasks);

        // calculate the priority rate
        let highPriority = 0;
        let mediumPriority = 0;
        let lowPriority = 0;

        totalTasksData.forEach(task => {
            console.log('Task Priority:', task.priority); // Output the priority of each task for debugging

            if (task.priority === 'High') {
                highPriority++;
            } else if (task.priority === 'Medium') {
                mediumPriority++;
            } else if (task.priority === 'Low') {
                lowPriority++;
            }
        });

        console.log('High Priority:', highPriority);
        console.log('Medium Priority:', mediumPriority);
        console.log('Low Priority:', lowPriority);


        // calculate the completed rate
        const taskCompletionRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(2) + '%' : '0%';
        console.log('Task Completion Rate:', taskCompletionRate);

        // Use map to generate the arrays
        const startDates = totalTasksData.map(task => task.start_date);
        const dueDates = totalTasksData.map(task => task.due_date);
        const statuses = totalTasksData.map(task => task.task_status);
        const durations = totalTasksData.map(task => {
            const startDate = new Date(task.start_date);
            const dueDate = new Date(task.due_date);
            const duration = (dueDate - startDate) / (1000 * 60 * 60 * 24); // Measured in days
            return parseFloat(duration.toFixed(1)) > 0 ? parseFloat(duration.toFixed(1)) : 0; // one decimal place and avoid negative values
        });
        console.log('Due Dates:', durations);
        console.log(' Start Dates:', startDates);

        // Use reduce to calculate each groups' tasks
        const groupTaskCounts = totalTasksData.reduce((acc, task) => {
            const groupName = task.group_name || 'Unknown'; // set 'Unknown'
            if (!acc[groupName]) {
                acc[groupName] = 0; // initial number
            }
            acc[groupName] += 1; // add the task number
            return acc;
        }, {});

        // Convert groupTaskCounts to an array and return it to the frontend
        const groupTaskCountsArray = Object.keys(groupTaskCounts).map(groupName => ({
            groupName,
            taskCount: groupTaskCounts[groupName]
        }));
        console.log('group:', groupTaskCountsArray);


        // return data to the front end
        res.status(200).json({
            totalTasks,
            toDoTasks,
            inProgressTasks,
            completedTasks,
            highPriority,
            mediumPriority,
            lowPriority,
            taskCompletionRate,
            startDates,
            dueDates,
            statuses,
            durations,
            groupTaskCounts: groupTaskCountsArray
        });


    } catch (error) {
        console.error('Error fetching task statistics:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



const PORT = process.env.PORT || 5000;



