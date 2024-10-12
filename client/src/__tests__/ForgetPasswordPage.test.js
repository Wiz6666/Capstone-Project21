import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ForgetPasswordPage from '../pages/ForgetPasswordPage';
import { supabase } from '../supabaseClient';

// Mock the Supabase client to simulate API calls
jest.mock('../supabaseClient', () => ({
    supabase: {
        auth: {
            resetPasswordForEmail: jest.fn(),
        },
    },
}));

// Mock the global alert function to prevent actual alerts during tests
beforeAll(() => {
    global.alert = jest.fn();
});

// Helper function to render the ForgetPasswordPage component
const setup = () => {
    render(
        <MemoryRouter>
            <ForgetPasswordPage />
        </MemoryRouter>
    );
};

// Test the initial rendering of the forget password page
test('renders forget password page', () => {
    setup();  // Render the component
    expect(screen.getByPlaceholderText(/enter email address/i)).toBeInTheDocument();  // Check if email input is present
    expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();  // Check if continue button is present
});

// Test the successful submission of a password reset request
test('successful password reset request', async () => {
    setup();  // Render the component
    const emailInput = screen.getByPlaceholderText(/enter email address/i);  // Get the email input element
    const continueButton = screen.getByRole('button', { name: /continue/i });  // Get the continue button

    // Simulate entering an email address
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    // Simulate successful response from Supabase
    supabase.auth.resetPasswordForEmail.mockResolvedValueOnce({ data: {}, error: null });

    // Simulate clicking the "continue" button to submit the form
    fireEvent.click(continueButton);

    // Wait for the success message to appear and check for its presence
    await waitFor(() => {
        expect(screen.getByText(/password reset email sent. please check your inbox./i)).toBeInTheDocument();  // Check for success message
        expect(screen.queryByText(/invalid email/i)).not.toBeInTheDocument();  // Ensure no error message appears
    });
});

// Test a failed password reset request and error handling
test('failed password reset request shows error message', async () => {
    setup();  // Render the component // 渲染组件
    const emailInput = screen.getByPlaceholderText(/enter email address/i);  // Get the email input element
    const continueButton = screen.getByRole('button', { name: /continue/i });  // Get the continue button

    // Simulate entering an email address
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    // Simulate a failed response from Supabase
    const errorMessage = 'Email not found';  // Set a custom error message
    supabase.auth.resetPasswordForEmail.mockResolvedValueOnce({ data: null, error: { message: errorMessage } });

    // Simulate clicking the "continue" button to submit the form
    fireEvent.click(continueButton);

    // Wait for the error message to appear and check for its presence
    await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();  // Check for error message
        expect(screen.queryByText(/password reset email sent. please check your inbox./i)).not.toBeInTheDocument();  // Ensure no success message appears
    });
});
