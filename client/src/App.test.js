import React from 'react';
import { render, screen, act } from '@testing-library/react';
import App from './App';

// Mock the Supabase client
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn().mockReturnValue({
        data: [{ id: 1, task_name: 'Mock Task', task_status: 'Not Started' }],
        error: null,
      }),
    })),
  })),
}));

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
