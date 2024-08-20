// public/script.js


//声明一个token, 储存用户登陆后的身份验证令牌
let token = '';

// Register用户注册功能
document.getElementById('register-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const role = document.getElementById('register-role').value;

    fetch('http://localhost:3000/register', {  // Updated URL with localhost and port
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password, role })
    }).then(response => response.json()).then(data => {
        alert('Registration successful');
        console.log('Registered:', data);
    }).catch(err => {
        alert('Registration failed');
        console.error(err);
    });
});

// Login用户登陆功能
document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    fetch('http://localhost:3000/login', {  // Updated URL with localhost and port
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    }).then(response => response.json()).then(data => {
        token = data.token;
        console.log('Logged in:', data);
        loadTasks();
        document.getElementById('tasks').style.display = 'block';
        document.getElementById('login').style.display = 'none';
        document.getElementById('register').style.display = 'none';
    }).catch(err => {
        alert('Login failed');
        console.error(err);
    });
});

// Load Tasks加载任务列表
function loadTasks() {
    fetch('http://localhost:3000/tasks', {  // Updated URL with localhost and port
        headers: {
            'Authorization': token
        }
    }).then(response => response.json()).then(tasks => {
        const taskList = document.getElementById('task-list');
        taskList.innerHTML = '';
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.textContent = `${task.title} - ${task.status}`;
            taskList.appendChild(li);
        });
    });
}

// Create Task创建新任务
document.getElementById('create-task').addEventListener('click', function () {
    const title = prompt('Task title');
    const description = prompt('Task description');
    const status = prompt('Task status (To Do, In Progress, Completed)');
    const due_date = prompt('Due date (YYYY-MM-DD)');

    fetch('http://localhost:3000/tasks', {  // Updated URL with localhost and port
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify({ title, description, status, due_date })
    }).then(response => response.json()).then(task => {
        console.log('Task created:', task);
        loadTasks();
    }).catch(err => {
        alert('Task creation failed');
        console.error(err);
    });
});