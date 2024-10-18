import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import TaskPage from '../pages/TaskPage'; // Make sure the import path is correct
import { supabase } from '../supabaseClient';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

// Mock Supabase client
jest.mock('../supabaseClient', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => ({
            data: { project_name: 'Test Project' },
            error: null,
          })),
        })),
      })),
    })),
  },
}));

describe('TaskPage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it('renders TaskPage component and fetches project name', async () => {
    render(
      <MemoryRouter initialEntries={['/project/1']}>
        <Routes>
          <Route path="/project/:projectId" element={<TaskPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Check that loading initially appears
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Wait for the project name to be fetched
    await waitFor(() => expect(screen.getByText('Test Project')).toBeInTheDocument());
  });

  it('displays an error if project name fetching fails', async () => {
    // Mocking a failed Supabase request
    supabase.from.mockReturnValueOnce({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => ({
            data: null,
            error: 'Error fetching project name',
          })),
        })),
      })),
    });

    render(
      <MemoryRouter initialEntries={['/project/1']}>
        <Routes>
          <Route path="/project/:projectId" element={<TaskPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for the error message to appear
    await waitFor(() => expect(screen.getByText('Error fetching project name')).toBeInTheDocument());
  });
});
