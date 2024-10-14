const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');  // Import the CORS package
const app = express();


const path = require('path');
require('dotenv').config();
app.use(bodyParser.json());  // use bodyParser 

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL and Key are required.');
}

const supabase = createClient(supabaseUrl, supabaseKey);


// Set the port dynamically or default to 5001 for local development
const port = process.env.PORT || 5001;


// Set the origin dynamically, based on an environment variable or fallback to localhost:3000
const allowedOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:3000';


// Set up CORS
app.use(cors({
    origin: allowedOrigin,
    methods: 'GET, POST, OPTIONS',
    allowedHeaders: 'Content-Type',
}));

// Handle OPTIONS request for CORS preflight
app.options('/dashboard-data', (req, res) => {
    res.header('Access-Control-Allow-Origin', allowedOrigin);
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.sendStatus(200);
});




// Serve static files from the "public" directory
//app.use(express.static(path.join(__dirname, 'public')));

// Serve the index.html file from its location outside the public directory
//app.get('/', (req, res) => {
//res.sendFile(path.join(__dirname, 'index.html'));
//});


app.use((req, res, next) => {
    console.log(`Request URL: ${req.url}`);
    console.log(`Request Method: ${req.method}`);
    next();
});
// Serve the static files from the React app
//app.use(express.static(path.join(__dirname, 'client/build')));

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

// Handles any requests that don't match the ones above
//app.get('*', (req, res) => {
//res.sendFile(path.join(__dirname + '/client/build/index.html'));
//});



//collect the data for dashboard

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
            .eq('task_status', 'Not Started');

        if (toDoTasksError) {
            console.error('Error fetching To Do tasks:', toDoTasksError);
            return res.status(500).json({ error: 'Error fetching To Do tasks' });
        }
        const toDoTasks = toDoTasksData.length;


        // Get "In Progress" status tasks
        const { data: inProgressTasksData, error: inProgressTasksError } = await supabase
            .from('tasks')
            .select('*')
            .eq('task_status', 'In Progress');

        if (inProgressTasksError) {
            console.error('Error fetching In Progress tasks:', inProgressTasksError);
            return res.status(500).json({ error: 'Error fetching In Progress tasks' });
        }
        const inProgressTasks = inProgressTasksData.length;


        // Get "Completed" status tasks
        const { data: completedTasksData, error: completedTasksError } = await supabase
            .from('tasks')
            .select('*')
            .eq('task_status', 'Completed');

        if (completedTasksError) {
            console.error('Error fetching Completed tasks:', completedTasksError);
            return res.status(500).json({ error: 'Error fetching Completed tasks' });
        }
        const completedTasks = completedTasksData.length;
        console.log('completedTasks:', completedTasks);

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
        const taskname_duration = totalTasksData.map(task => task.task_name);
        const durations = totalTasksData.map(task => {
            const startDate = new Date(task.start_date);
            const dueDate = new Date(task.due_date);
            const duration = (dueDate - startDate) / (1000 * 60 * 60 * 24); // Measured in days
            return parseFloat(duration.toFixed(1)) > 0 ? parseFloat(duration.toFixed(1)) : 0; // one decimal place and avoid negative values
        });
        console.log('Durations:', durations);
        console.log(' Start Dates:', startDates);
        console.log(' Due Dates:', dueDates);
        console.log(' Taskname for duration:', taskname_duration);


        // Use reduce to calculate tasks per group by group_id
        const groupTaskCounts = totalTasksData.reduce((acc, task) => {
            const groupId = task.group_id || 'Unknown'; // use group_id and set 'Unknown' for missing IDs
            if (!acc[groupId]) {
                acc[groupId] = 0; // initialize the task count for the group
            }
            acc[groupId] += 1; // increment the task count for the group
            return acc;
        }, {});

        // Link the group_id to the name from the groups table
        const groupNames = {
            1: 'Executive',
            2: 'Community and Culture',
            3: 'Marketing and Communications',
            4: 'Finance',
            5: 'Operations',
            6: 'Partnerships',
            13: 'Technology',
            // add any other group ids and names here
        };

        // Convert groupTaskCounts to an array, including the group name
        const groupTaskCountsArray = Object.keys(groupTaskCounts).map(groupId => ({
            groupName: groupNames[groupId] || 'Unknown', // fetch the name from the groupNames mapping
            taskCount: groupTaskCounts[groupId]
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
            taskname_duration,// add the taskname for duration display
            durations,
            groupTaskCounts: groupTaskCountsArray
        });


    } catch (error) {
        console.error('Error fetching task statistics:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

// Get User Profile
app.get('/profile', verifyToken, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('Users')
            .select('username, email, phone_number, role, avatar_url, location, mobile')
            .eq('user_id', req.userId)
            .single();

        if (error) throw error;

        if (data) {
            res.status(200).json(data);
        } else {
            res.status(404).json({ message: 'User Profile not found' });
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Update User Profile
app.put('/profile', verifyToken, async (req, res) => {
    try {
        const { username, email, phone_number, role, avatar_url, location, mobile } = req.body;
        const { data, error } = await supabase
            .from('Users')
            .update({ username, email, phone_number, role, avatar_url, location, mobile })
            .eq('user_id', req.userId)
            .single();

        if (error) throw error;

        if (data) {
            res.status(200).json(data);
        } else {
            res.status(404).json({ message: 'User Profile not found' });
        }
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Delete User Profile
app.delete('/profile', verifyToken, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('Users')
            .delete()
            .eq('user_id', req.userId)
            .single();

        if (error) throw error;

        if (data) {
            res.status(200).json(data);
        } else {
            res.status(404).json({ message: 'User Profile not found' });
        }
    } catch (error) {
        console.error('Error deleting user profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// Upload profile image
app.post('/profile/avatar', verifyToken, upload.single('avatar'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const file = req.file;
        const userId = req.userId;
        const fileExt = file.originalname.split('.').pop();
        const fileName = `${userId}_${Date.now()}.${fileExt}`;

        // Upload file to Supabase storage
        const { data, error } = await supabase
            .storage
            .from('Profile Image')  //Our Supabase bucket name, we store the image in the bucket
            .upload(fileName, file.buffer, {
                contentType: file.mimetype,
            });

        if (error) throw error;

        // Get public URL of the uploaded file
        const { publicURL, error: urlError } = supabase
            .storage
            .from('Profile Image')
            .getPublicUrl(fileName);

        if (urlError) throw urlError;

        // Update user's avatar_url in the database
        const { data: userData, error: userError } = await supabase
            .from('Users')
            .update({ avatar_url: publicURL })
            .eq('user_id', userId)
            .single();

        if (userError) throw userError;

        res.status(200).json({ avatarUrl: publicURL });
    } catch (error) {
        console.error('Error uploading avatar:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

