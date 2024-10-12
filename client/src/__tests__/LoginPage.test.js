import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import { supabase } from '../supabaseClient';

// Mock the Supabase client
jest.mock('../supabaseClient', () => ({
    supabase: {
        auth: {
            signInWithPassword: jest.fn(), // Mock the sign-in method using a password
        },
    },
}));

// Mock useNavigate hook
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate, // Mock useNavigate as a function
}));

// Mock window.alert
beforeAll(() => {
    global.alert = jest.fn(); // Used to mock the alert function
});

// Setup function to render the LoginPage
const setup = () => {
    render(
        <MemoryRouter>
            <LoginPage />
        </MemoryRouter>
    );
};

// Test if the login page renders correctly
test('renders login page', () => {
    setup();
    expect(screen.getByPlaceholderText(/Your email/i)).toBeInTheDocument(); // Check if the email input field exists
    expect(screen.getByPlaceholderText(/Your password/i)).toBeInTheDocument(); // Check if the password input field exists
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument(); // Check if the sign-in button exists
});

// Test for successful login
test('successful login', async () => {
    setup();
    const emailInput = screen.getByPlaceholderText(/Your email/i);
    const passwordInput = screen.getByPlaceholderText(/Your password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } }); // Enter email
    fireEvent.change(passwordInput, { target: { value: 'password123' } }); // Enter password

    // Mock the response for a successful login
    supabase.auth.signInWithPassword.mockResolvedValueOnce({ data: {}, error: null });

    fireEvent.click(submitButton); // Click the sign-in button

    await waitFor(() => {
        expect(mockedNavigate).toHaveBeenCalledWith('/dashboard'); // Check if it navigates to the dashboard
        expect(window.alert).toHaveBeenCalledWith('Login successful!'); // Check if a success alert is shown
    });
});

// Test for failed login and showing an error message
test('failed login shows error message', async () => {
    setup();
    const emailInput = screen.getByPlaceholderText(/Your email/i);
    const passwordInput = screen.getByPlaceholderText(/Your password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } }); // Enter email
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } }); // Enter incorrect password

    // Mock the response for a failed login
    const errorMessage = 'Invalid credentials'; // Define the error message
    supabase.auth.signInWithPassword.mockResolvedValueOnce({ data: null, error: { message: errorMessage } });

    fireEvent.click(submitButton); // Click the sign-in button

    await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument(); // Check if the error message is displayed
    });
});

// Test navigation to forgot password page
test('navigates to forgot password page', () => {
    setup();
    const forgotPasswordButton = screen.getByRole('button', { name: /forgot password\?/i });
    fireEvent.click(forgotPasswordButton); // Click the forgot password button

    expect(mockedNavigate).toHaveBeenCalledWith('/forgot-password'); // Check if it navigates to the forgot password page
});

// Test navigation to the register page
test('navigates to register page', () => {
    setup();
    const noAccountButton = screen.getByRole('button', { name: /no account\?/i });
    fireEvent.click(noAccountButton); // Click the no account button

    expect(mockedNavigate).toHaveBeenCalledWith('/register'); // Check if it navigates to the register page
});
