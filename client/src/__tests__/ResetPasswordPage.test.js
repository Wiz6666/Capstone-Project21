import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ResetPasswordPage from '../pages/RestPasswordPage'; // Import Reset Password Page component
import { supabase } from '../supabaseClient'; // Import Supabase client
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

// Mock Supabase
jest.mock('../supabaseClient', () => {
    return {
        supabase: {
            auth: {
                updateUser: jest.fn(), // Mock the method for updating user password
            },
        },
    };
});

// Mock useNavigate
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(), // Mock useNavigate as a function
}));

// Import jest-dom to use extended matchers
import '@testing-library/jest-dom';

describe('ResetPasswordPage', () => {
    const navigate = jest.fn(); // Create a mock function for navigation

    beforeEach(() => {
        useNavigate.mockReturnValue(navigate); // Set the mock navigation function to be returned
        jest.useFakeTimers(); // Use fake timers
        render(
            <MemoryRouter>
                <ResetPasswordPage /> // Render the Reset Password Page
            </MemoryRouter>
        );
    });

    afterEach(() => {
        jest.clearAllTimers(); // Clear all timers
        jest.clearAllMocks();  // Clear all mocks
    });

    // Test if the reset password page renders correctly
    test('renders reset password page', () => {
        expect(screen.getByPlaceholderText("New Password")).toBeInTheDocument(); // Check if the new password input field exists
        expect(screen.getByPlaceholderText("Confirm New Password")).toBeInTheDocument(); // Check if the confirm password input field exists
    });

    // Test successful password reset
    test('successful password reset', async () => {
        const newPasswordInput = screen.getByPlaceholderText("New Password");
        const confirmPasswordInput = screen.getByPlaceholderText("Confirm New Password");
        const submitButton = screen.getByRole('button', { name: /reset password/i });

        fireEvent.change(newPasswordInput, { target: { value: 'newpassword123' } }); // Enter new password
        fireEvent.change(confirmPasswordInput, { target: { value: 'newpassword123' } }); // Enter confirm password

        supabase.auth.updateUser.mockResolvedValueOnce({ error: null }); // Mock successful password update response

        fireEvent.click(submitButton); // Click the reset password button

        await waitFor(() => {
            expect(screen.getByText('Password updated successfully. Redirecting to login...')).toBeInTheDocument(); // Check if the success message is displayed
        });

        // Fast-forward time to simulate setTimeout
        jest.runAllTimers();

        // Check if navigation to the login page happens
        expect(navigate).toHaveBeenCalledWith('/login');
    });

    // Test if an error message is shown when passwords do not match
    test('shows error message for mismatched passwords', async () => {
        const newPasswordInput = screen.getByPlaceholderText("New Password");
        const confirmPasswordInput = screen.getByPlaceholderText("Confirm New Password");
        const submitButton = screen.getByRole('button', { name: /reset password/i });

        fireEvent.change(newPasswordInput, { target: { value: 'newpassword123' } }); // Enter new password
        fireEvent.change(confirmPasswordInput, { target: { value: 'differentpassword' } }); // Enter a non-matching confirm password

        fireEvent.click(submitButton); // Click the reset password button

        expect(await screen.findByText("Passwords don't match")).toBeInTheDocument(); // Check if the password mismatch error message is displayed
    });

    // Test handling errors returned from Supabase
    test('handles error from supabase', async () => {
        const newPasswordInput = screen.getByPlaceholderText("New Password");
        const confirmPasswordInput = screen.getByPlaceholderText("Confirm New Password");
        const submitButton = screen.getByRole('button', { name: /reset password/i });

        fireEvent.change(newPasswordInput, { target: { value: 'newpassword123' } }); // Enter new password
        fireEvent.change(confirmPasswordInput, { target: { value: 'newpassword123' } }); // Enter confirm password

        supabase.auth.updateUser.mockResolvedValueOnce({ error: { message: 'Error updating password' } }); // Mock failed password update response

        fireEvent.click(submitButton); // Click the reset password button

        await waitFor(() => {
            expect(screen.getByText('Error updating password')).toBeInTheDocument(); // Check if the error message for password update failure is displayed
        });
    });
});
