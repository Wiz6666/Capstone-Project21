// LoginPage.test.js
import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import LoginPage from './LoginPage';
import { supabase } from '../supabaseClient';

// Mock the supabase client
jest.mock('../supabaseClient', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
    },
  },
}));

// Mock useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('LoginPage', () => {
  test('renders login form', () => {
    render(
      <Router>
        <LoginPage />
      </Router>
    );
    expect(screen.getByPlaceholderText('Your email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Your password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  test('handles successful login', async () => {
    supabase.auth.signInWithPassword.mockResolvedValue({ data: {}, error: null });
    render(
      <Router>
        <LoginPage />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText('Your email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Your password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  test('handles login error', async () => {
    supabase.auth.signInWithPassword.mockResolvedValue({ data: null, error: new Error('Invalid login credentials') });
    render(
      <Router>
        <LoginPage />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText('Your email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Your password'), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText('Invalid login credentials')).toBeInTheDocument();
    });
  });
});

// RegisterPage.test.js
import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import RegisterPage from './RegisterPage';
import { supabase } from '../supabaseClient';

jest.mock('../supabaseClient', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
    },
    from: jest.fn(() => ({
      insert: jest.fn(),
    })),
  },
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('RegisterPage', () => {
  test('renders registration form', () => {
    render(
      <Router>
        <RegisterPage />
      </Router>
    );
    expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Type Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Re-type Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  test('handles successful registration', async () => {
    supabase.auth.signUp.mockResolvedValue({ data: { user: { id: 'test-id' } }, error: null });
    supabase.from().insert.mockResolvedValue({ data: {}, error: null });

    render(
      <Router>
        <RegisterPage />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText('Full Name'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByPlaceholderText('Type Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Re-type Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(supabase.from().insert).toHaveBeenCalled();
    });
  });

  test('handles password mismatch', async () => {
    render(
      <Router>
        <RegisterPage />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText('Full Name'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByPlaceholderText('Type Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Re-type Password'), { target: { value: 'password456' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText("Passwords don't match")).toBeInTheDocument();
    });
  });
});

// ForgetPasswordPage.test.js
import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import ForgetPasswordPage from './ForgetPasswordPage';
import { supabase } from '../supabaseClient';

jest.mock('../supabaseClient', () => ({
  supabase: {
    auth: {
      resetPasswordForEmail: jest.fn(),
    },
  },
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('ForgetPasswordPage', () => {
  test('renders forget password form', () => {
    render(
      <Router>
        <ForgetPasswordPage />
      </Router>
    );
    expect(screen.getByPlaceholderText('Enter email address')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();
  });

  test('handles successful password reset request', async () => {
    supabase.auth.resetPasswordForEmail.mockResolvedValue({ data: {}, error: null });

    render(
      <Router>
        <ForgetPasswordPage />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText('Enter email address'), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));

    await waitFor(() => {
      expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalledWith('test@example.com', expect.any(Object));
      expect(screen.getByText('Password reset email sent. Please check your inbox.')).toBeInTheDocument();
    });
  });

  test('handles password reset error', async () => {
    supabase.auth.resetPasswordForEmail.mockResolvedValue({ data: null, error: new Error('User not found') });

    render(
      <Router>
        <ForgetPasswordPage />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText('Enter email address'), { target: { value: 'nonexistent@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));

    await waitFor(() => {
      expect(screen.getByText('User not found')).toBeInTheDocument();
    });
  });
});

// ResetPasswordPage.test.js
import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import ResetPasswordPage from './ResetPasswordPage';
import { supabase } from '../supabaseClient';

jest.mock('../supabaseClient', () => ({
  supabase: {
    auth: {
      updateUser: jest.fn(),
    },
  },
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('ResetPasswordPage', () => {
  test('renders reset password form', () => {
    render(
      <Router>
        <ResetPasswordPage />
      </Router>
    );
    expect(screen.getByPlaceholderText('New Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm New Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reset password/i })).toBeInTheDocument();
  });

  test('handles successful password reset', async () => {
    supabase.auth.updateUser.mockResolvedValue({ data: {}, error: null });

    render(
      <Router>
        <ResetPasswordPage />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText('New Password'), { target: { value: 'newpassword123' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm New Password'), { target: { value: 'newpassword123' } });
    fireEvent.click(screen.getByRole('button', { name: /reset password/i }));

    await waitFor(() => {
      expect(supabase.auth.updateUser).toHaveBeenCalledWith({ password: 'newpassword123' });
      expect(screen.getByText('Password updated successfully. Redirecting to login...')).toBeInTheDocument();
    });
  });

  test('handles password mismatch', async () => {
    render(
      <Router>
        <ResetPasswordPage />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText('New Password'), { target: { value: 'newpassword123' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm New Password'), { target: { value: 'differentpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /reset password/i }));

    await waitFor(() => {
      expect(screen.getByText("Passwords don't match")).toBeInTheDocument();
    });
  });
});

// ProfilePage.test.js
import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import ProfilePage from './ProfilePage';
import { supabase } from '../supabaseClient';

jest.mock('../supabaseClient', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(),
      update: jest.fn().mockReturnThis(),
    })),
  },
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ userId: 'test-user-id' }),
  useNavigate: () => jest.fn(),
}));

describe('ProfilePage', () => {
  beforeEach(() => {
    supabase.auth.getUser.mockResolvedValue({
      data: { user: { id: 'test-user-id' } },
      error: null,
    });
    supabase.from().select().eq().single.mockResolvedValue({
      data: {
        username: 'Test User',
        role: 'User',
        email: 'test@example.com',
        phone_number: '1234567890',
        location: 'Test City',
        avatar_url: '/test-avatar.png',
      },
      error: null,
    });
  });

  test('renders profile information', async () => {
    render(
      <Router>
        <ProfilePage />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByText('User')).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
      expect(screen.getByText('1234567890')).toBeInTheDocument();
      expect(screen.getByText('Test City')).toBeInTheDocument();
      expect(screen.getByAltText('Avatar')).toHaveAttribute('src', '/test-avatar.png');
    });
  });

  test('handles field update', async () => {
    supabase.from().update().eq.mockResolvedValue({ data: {}, error: null });

    render(
      <Router>
        <ProfilePage />
      </Router>
    );

    await waitFor(() => {
      fireEvent.click(screen.getByText('Test User'));
    });

    const input = screen.getByDisplayValue('Test User');
    fireEvent.change(input, { target: { value: 'Updated Name' } });
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(supabase.from().update).toHaveBeenCalledWith({ username: 'Updated Name' });
      expect(screen.getByText('Updated Name')).toBeInTheDocument();
    });
  });

  test('handles avatar update', async () => {
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    supabase.from().update().eq.mockResolvedValue({ data: {}, error: null });

    render(
      <Router>
        <ProfilePage />
      </Router>
    );

    await waitFor(() => {
      fireEvent.click(screen.getByAltText('Avatar'));
    });

    const input = screen.getByLabelText('Upload New Avatar
