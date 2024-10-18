
# AASYP Project Management System

## CITS5206 Group 20 Project

This Project Management System (PMS) is developed for the ASEAN-Australia Strategic Youth Partnership (AASYP). It is designed to enhance task management, collaboration, and secure access control for team members. The system was developed as part of the CITS5206 Capstone Project at the University of Western Australia by the following team members:

| UWA ID    | Name                     | Github Username         |
|-----------|--------------------------|-------------------------|
| 23210735  | Weisi Zhang               | Wiz6666                 |
| 23938319  | Jimin Thadathil Varghese  | varghesejimin0212        |
| 23766091  | Yunzhi Chen               | Rebecca115              |
| 23853193  | Lingzi Huangfu            | LizzzzHF                |
| 23855006  | Wannian Mei               | WannianMEI              |
| 23191783  | Jiandong Wang             | JOEY-WANG-UWA           |

## Overview

The Project Management System provides tools for task management, user collaboration, and secure access control. The system is built using Node.js for the backend and Supabase as the database provider, following Agile development principles. It focuses on features like user authentication, profile management, task handling, and secure data access.

## Key Features

### 1. Task Management
- **Create, Edit, Delete Tasks**: Manage tasks easily within projects.
- **Task Status Updates**: Track tasks through various stages such as "In Progress", "Completed", and "Pending".

### 2. User Authentication
- **Sign Up, Sign In, and Forgot Password**: Users can create accounts, log in, and recover passwords through email.

### 3. Profile Management
- **Edit User Profile**: Users can update their personal information, including name, role, and contact details.

### 4. Collaboration
- **Document and Link Attachments**: Attach relevant documents and links to tasks and projects.

### 5. Security and Access Control
- **Role-Based Access**: Control access levels based on user roles, such as admin and standard users, ensuring secure data management.

## Installation and Setup

To get started with the project, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/Wiz6666/Capstone-Project21.git
   ```
2. Navigate into the project directory:
   ```bash
   cd Capstone-Project21
   ```
3. Remove unnecessary files:
   ```bash
   rm .DS_Store
   ```
4. Checkout to the main branch:
   ```bash
   git checkout main
   ```
5. Open a terminal, install dependencies:
   ```bash
   npm install concurrently --save
   ```
6. Start the server:
   ```bash
   node server.js
   ```
7. In a new terminal, navigate to the client directory:
   ```bash
   cd client
   npm install
   npm install multer --save
   ```
8. Run the client:
   ```bash
   npm start
   ```

## Future Development

- **Enhanced Profile Customization**: Future iterations will allow users to add more details and customize their profile.
- **Enhanced Role-Based Permissions**: Fine-tuning of user roles to manage task assignments and project visibility.
- **Group and Task Management**: Adding features like multi-assignee tasks and better filtering options.

## Database Structure

The database uses Supabase and is structured as follows:

### 1. Users Table
- `user_id`: UUID, primary key
- `username`: Text
- `email`: Text
- `role`: Text (e.g., Admin, User)

### 2. Projects Table
- `id`: UUID, primary key
- `task_name`: Text
- `task_status`: Text
- `priority`: Text (Low, Medium, High)

### 3. Tasks Table
- `id`: Primary key
- `task_name`: Text
- `start_date`: Timestamp
- `due_date`: Timestamp

## License

This project is licensed under the MIT License.
