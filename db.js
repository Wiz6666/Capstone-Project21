// db.js 创建初始的sqlite数据库
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('tasks.db'); // This will create a file named tasks.db in your project directory

// Create tables
db.serialize(() => {
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT CHECK(role IN ('admin', 'manager', 'user')) NOT NULL
    )`);

    // Tasks table
    db.run(`CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        assigned_to INTEGER,
        status TEXT CHECK(status IN ('To Do', 'In Progress', 'Completed')) DEFAULT 'To Do',
        due_date TEXT,
        FOREIGN KEY (assigned_to) REFERENCES users(id)
    )`);
});

module.exports = db;