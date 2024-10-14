import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../pages/Navbar';
import '@testing-library/jest-dom';
import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';





jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    auth: {
      signOut: jest.fn().mockResolvedValue({}),
    },
  })),
}));

const navigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => navigate,
}));

describe('Navbar Component', () => {
  test('renders logo', () => {
    render(
      <MemoryRouter>
        <Navbar session={null} />
      </MemoryRouter>
    );
    const logo = screen.getByAltText(/logo/i);
    expect(logo).toBeInTheDocument();
  });

  test('renders login link when not logged in', () => {
    render(
      <MemoryRouter>
        <Navbar session={null} />
      </MemoryRouter>
    );
    const loginLink = screen.getByText(/login/i);
    expect(loginLink).toBeInTheDocument();
  });

  test('renders project, dashboard, profile, and logout links when logged in', () => {
    render(
      <MemoryRouter>
        <Navbar session={{}} />
      </MemoryRouter>
    );
    const projectLink = screen.getByText(/project/i);
    const dashboardLink = screen.getByText(/dashboard/i);
    const profileLink = screen.getByText(/profile/i);
    const logoutLink = screen.getByText(/logout/i);
    expect(projectLink).toBeInTheDocument();
    expect(dashboardLink).toBeInTheDocument();
    expect(profileLink).toBeInTheDocument();
    expect(logoutLink).toBeInTheDocument();
  });

  test('logs out and navigates to login page', async () => {
    render(
      <MemoryRouter>
        <Navbar session={{}} />
      </MemoryRouter>
    );
    const logoutLink = screen.getByText(/logout/i);
    fireEvent.click(logoutLink);
    expect(navigate).toHaveBeenCalledWith('/login');
  });
});// Navbar.test.js 或类似的测试文件
import { render, screen } from '@testing-library/react';
// 其他必要的导入