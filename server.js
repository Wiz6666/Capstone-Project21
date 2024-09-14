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
// 处理 OPTIONS 请求
app.options('/dashboard-data', (req, res) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.sendStatus(200);
});

// 从 .env 文件中获取 Supabase 配置
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);




// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the index.html file from its location outside the public directory
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


app.use((req, res, next) => {
    console.log(`Request URL: ${req.url}`);
    console.log(`Request Method: ${req.method}`);
    next();
});
// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

//const SECRET_KEY = 'your_jwt_secret_key';

// Register a new user
app.post('/register', (req, res) => {
    const { name, email, password, role } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);

    db.run(`INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`, [name, email, hashedPassword, role], function (err) {
        if (err) {
            return res.status(500).send('Error registering user.');
        }
        res.status(200).send({ id: this.lastID });
    });
});

// Login
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
        if (err || !user || !bcrypt.compareSync(password, user.password)) {
            return res.status(400).send('Invalid credentials');
        }

        const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, {
            expiresIn: 86400, // 24 hours
        });

        res.status(200).send({ auth: true, token });
    });
});

// Middleware to verify token
function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    });
}

// Create a new task
app.post('/tasks', verifyToken, (req, res) => {
    const { title, description, assigned_to, status, due_date } = req.body;

    if (req.userRole !== 'admin' && req.userRole !== 'manager') {
        return res.status(403).send('Only admin or manager can create tasks.');
    }

    db.run(`INSERT INTO tasks (title, description, assigned_to, status, due_date) VALUES (?, ?, ?, ?, ?)`,
        [title, description, assigned_to, status, due_date], function (err) {
            if (err) {
                return res.status(500).send('Error creating task.');
            }
            res.status(200).send({ id: this.lastID });
        });
});

// Get all tasks
app.get('/tasks', verifyToken, (req, res) => {
    db.all(`SELECT * FROM tasks`, [], (err, tasks) => {
        if (err) {
            return res.status(500).send('Error fetching tasks.');
        }
        res.status(200).send(tasks);
    });
});

// Update a task
app.put('/tasks/:id', verifyToken, (req, res) => {
    const { id } = req.params;
    const { title, description, assigned_to, status, due_date } = req.body;

    if (req.userRole !== 'admin' && req.userRole !== 'manager') {
        return res.status(403).send('Only admin or manager can update tasks.');
    }

    db.run(`UPDATE tasks SET title = ?, description = ?, assigned_to = ?, status = ?, due_date = ? WHERE id = ?`,
        [title, description, assigned_to, status, due_date, id], function (err) {
            if (err) {
                return res.status(500).send('Error updating task.');
            }
            res.status(200).send({ updated: this.changes });
        });
});

// Delete a task
app.delete('/tasks/:id', verifyToken, (req, res) => {
    const { id } = req.params;

    if (req.userRole !== 'admin' && req.userRole !== 'manager') {
        return res.status(403).send('Only admin or manager can delete tasks.');
    }

    db.run(`DELETE FROM tasks WHERE id = ?`, [id], function (err) {
        if (err) {
            return res.status(500).send('Error deleting task.');
        }
        res.status(200).send({ deleted: this.changes });
    });
});

// Handles any requests that don't match the ones above
//app.get('*', (req, res) => {
//res.sendFile(path.join(__dirname + '/client/build/index.html'));
//});

const PORT = process.env.PORT || 5000;




app.get('/dashboard-data', async (req, res) => {
    try {
        console.log('Received request at /dashboard-data');

        // 从 Supabase 获取所有任务数据
        const { data: totalTasksData, error: totalTasksError } = await supabase
            .from('tasks')
            .select('*');

        if (totalTasksError) {
            console.error('Error fetching total tasks:', totalTasksError);
            return res.status(500).json({ error: 'Error fetching total tasks' });
        }

        // 计算任务总数
        const totalTasks = totalTasksData.length;

        // 获取 "To Do" 状态的任务数
        const { data: toDoTasksData, error: toDoTasksError } = await supabase
            .from('tasks')
            .select('*')
            .eq('task_status', 'To do');

        if (toDoTasksError) {
            console.error('Error fetching To Do tasks:', toDoTasksError);
            return res.status(500).json({ error: 'Error fetching To Do tasks' });
        }
        const toDoTasks = toDoTasksData.length;

        // 获取 "In Progress" 状态的任务数
        const { data: inProgressTasksData, error: inProgressTasksError } = await supabase
            .from('tasks')
            .select('*')
            .eq('task_status', 'In progress');

        if (inProgressTasksError) {
            console.error('Error fetching In Progress tasks:', inProgressTasksError);
            return res.status(500).json({ error: 'Error fetching In Progress tasks' });
        }
        const inProgressTasks = inProgressTasksData.length;

        // 获取 "Completed" 状态的任务数
        const { data: completedTasksData, error: completedTasksError } = await supabase
            .from('tasks')
            .select('*')
            .eq('task_status', 'completed');

        if (completedTasksError) {
            console.error('Error fetching Completed tasks:', completedTasksError);
            return res.status(500).json({ error: 'Error fetching Completed tasks' });
        }
        const completedTasks = completedTasksData.length;

        // 返回统计数据给前端
        res.status(200).json({
            totalTasks,
            toDoTasks,
            inProgressTasks,
            completedTasks
        });
    } catch (error) {
        console.error('Error fetching task statistics:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
