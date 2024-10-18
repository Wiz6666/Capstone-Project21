import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import TaskDetails from '../pages/DetailPage'; // Import the TaskDetails component
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

// Mock Supabase client
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(),
        })),
      })),
    })),
  })),
}));

const mockSupabaseClient = createClient();

describe('TaskDetails Component', () => {
  const mockTaskData = {
    task_name: 'Test Task',
    Users: {
      user_id: '123',
      username: 'testuser',
      avatar_url: 'https://example.com/avatar.png',
    },
    start_date: '2023-10-01',
    due_date: '2023-10-15',
    task_status: 'Pending',
    priority: 'High',
    task_description: 'This is a test task.',
  };

  it('displays loading state initially', async () => {
    // Simulate a pending state by returning a promise that doesn't resolve immediately
    mockSupabaseClient.from.mockReturnValue({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => new Promise(() => {})), // Pending promise to simulate loading
        })),
      })),
    });

    render(
      <MemoryRouter initialEntries={['/task/1']}>
        <Routes>
          <Route path="/task/:id" element={<TaskDetails />} />
        </Routes>
      </MemoryRouter>
    );

    // Ensure loading state is displayed
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('displays task details after successful data fetching', async () => {
    // Simulate a successful response from Supabase
    mockSupabaseClient.from.mockReturnValue({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({ data: mockTaskData, error: null }),
        })),
      })),
    });

    render(
      <MemoryRouter initialEntries={['/task/1']}>
        <Routes>
          <Route path="/task/:id" element={<TaskDetails />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for the loading state to disappear
    await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());

    // Ensure task details are displayed
    expect(screen.getByText('TASK DETAILS')).toBeInTheDocument();
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByText('This is a test task.')).toBeInTheDocument();
  });

  it('displays an error message if data fetching fails', async () => {
    // Simulate an error response from Supabase
    mockSupabaseClient.from.mockReturnValue({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({ data: null, error: 'Error fetching task' }),
        })),
      })),
    });

    render(
      <MemoryRouter initialEntries={['/task/1']}>
        <Routes>
          <Route path="/task/:id" element={<TaskDetails />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for the loading state to disappear
    await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());

    // Ensure error message is displayed
    expect(screen.getByText('Error fetching task details.')).toBeInTheDocument();
  });
});
