const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');  // Import the CORS package
const db = require('./db');

const app = express();

app.use(bodyParser.json());
app.use(cors());  // Enable CORS for all routes

const SECRET_KEY = 'your_jwt_secret_key';

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});