const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(bodyParser.json());
app.use(cors());


// Mock Supabase client
const { createClient } = require('@supabase/supabase-js');
jest.mock('@supabase/supabase-js');

// Sample response data for mocking
const mockTasksData = [
    {
        id: 1,
        task_name: 'Test Task 1',
        task_status: 'Not Started',
        priority: 'High',
        start_date: '2023-10-01',
        due_date: '2023-10-10',
        group_id: 1
    },
    {
        id: 2,
        task_name: 'Test Task 2',
        task_status: 'In Progress',
        priority: 'Medium',
        start_date: '2023-09-15',
        due_date: '2023-09-20',
        group_id: 2
    },
    {
        id: 3,
        task_name: 'Test Task 3',
        task_status: 'Completed',
        priority: 'Low',
        start_date: '2023-08-01',
        due_date: '2023-08-05',
        group_id: 3
    }
];

// Mock the Supabase client's `from().select()` method
const supabase = {
    from: jest.fn(() => ({
        select: jest.fn(() => ({
            eq: jest.fn().mockResolvedValue({ data: mockTasksData, error: null })
        })),
        select: jest.fn().mockResolvedValue({ data: mockTasksData, error: null })
    })),
};

createClient.mockReturnValue(supabase);


app.use(bodyParser.json());
app.use(cors());

// Include your route here
app.get('/dashboard-data', async (req, res) => {
    try {
        // Simulate fetching tasks from Supabase
        const { data: totalTasksData, error: totalTasksError } = await supabase.from('tasks').select('*');
        if (totalTasksError) {
            return res.status(500).json({ error: 'Error fetching total tasks' });
        }

        const totalTasks = totalTasksData.length;
        const toDoTasks = totalTasksData.filter(task => task.task_status === 'Not Started').length;
        const inProgressTasks = totalTasksData.filter(task => task.task_status === 'In Progress').length;
        const completedTasks = totalTasksData.filter(task => task.task_status === 'Completed').length;

        const highPriority = totalTasksData.filter(task => task.priority === 'High').length;
        const mediumPriority = totalTasksData.filter(task => task.priority === 'Medium').length;
        const lowPriority = totalTasksData.filter(task => task.priority === 'Low').length;

        const taskCompletionRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(2) + '%' : '0%';

        res.status(200).json({
            totalTasks,
            toDoTasks,
            inProgressTasks,
            completedTasks,
            highPriority,
            mediumPriority,
            lowPriority,
            taskCompletionRate
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Unit test for the `/dashboard-data` route
describe('GET /dashboard-data', () => {
    it('should return task statistics successfully', async () => {
        const response = await request(app).get('/dashboard-data');
        expect(response.statusCode).toBe(200);
        expect(response.body.totalTasks).toBe(3);
        expect(response.body.toDoTasks).toBe(1);
        expect(response.body.inProgressTasks).toBe(1);
        expect(response.body.completedTasks).toBe(1);
        expect(response.body.highPriority).toBe(1);
        expect(response.body.mediumPriority).toBe(1);
        expect(response.body.lowPriority).toBe(1);
        expect(response.body.taskCompletionRate).toBe('33.33%');
    });

    it('should return 500 if there is an error fetching tasks', async () => {
        // Mock an error response from Supabase
        supabase.from.mockReturnValueOnce({
            select: jest.fn().mockResolvedValueOnce({ data: null, error: 'Fetch error' })
        });

        const response = await request(app).get('/dashboard-data');
        expect(response.statusCode).toBe(500);
        expect(response.body.error).toBe('Error fetching total tasks');
    });
});
