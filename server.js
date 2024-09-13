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
const port = 3000;

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

app.use(bodyParser.json());
app.use(cors());  // Enable CORS for all routes

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

// Example Route to Test Connection
app.get('/test', async (req, res) => {
    const { data, error } = await supabase
        .from('tasks')
        .select('*');

    if (error) {
        return res.status(500).send('Error fetching tasks.');
    }
    res.status(200).json(data);
});

// Create a new task
app.post('/tasks', async (req, res) => {
    const { title, description, assigned_to, status, due_date } = req.body;

    const { data, error } = await supabase
        .from('tasks')
        .insert([{ title, description, assigned_to, status, due_date }]);

    if (error) {
        return res.status(500).send('Error creating task.');
    }
    res.status(200).json(data);
});

// Get all tasks
app.get('/tasks', async (req, res) => {
    const { data, error } = await supabase
        .from('tasks')
        .select('*');

    if (error) {
        return res.status(500).send('Error fetching tasks.');
    }
    res.status(200).json(data);
});

// Update a task
app.put('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, assigned_to, status, due_date } = req.body;

    const { data, error } = await supabase
        .from('tasks')
        .update({ title, description, assigned_to, status, due_date })
        .eq('id', id);

    if (error) {
        return res.status(500).send('Error updating task.');
    }
    res.status(200).json(data);
});

// Delete a task
app.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;

    const { data, error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

    if (error) {
        return res.status(500).send('Error deleting task.');
    }
    res.status(200).json(data);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});