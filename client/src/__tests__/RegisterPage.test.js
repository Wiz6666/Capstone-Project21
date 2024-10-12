import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import RegisterPage from '../pages/RegisterPage';
import { supabase } from '../supabaseClient';
import { waitFor } from '@testing-library/react';

// Mock Supabase client
jest.mock('../supabaseClient', () => ({
    supabase: {
        auth: {
            signUp: jest.fn(), // Mock signUp method
            signIn: jest.fn(), // Mock signIn method
        },
        from: jest.fn(() => ({
            insert: jest.fn(), // Mock insert method
        })),
    },
}));

// Mock useNavigate hook
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(), // Mock useNavigate as a function
}));

let mockNavigate; // Declare a mockNavigate function

beforeEach(() => {
    jest.clearAllMocks(); // Clear all mocks
    mockNavigate = jest.fn(); // Create mockNavigate function
    useNavigate.mockReturnValue(mockNavigate); // Set it as the return value of useNavigate
});

describe('RegisterPage', () => {
    // Test the rendering of the registration form
    it('renders the registration form', () => {
        render(
            <MemoryRouter>
                <RegisterPage />
            </MemoryRouter>
        );
        expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument(); // Check if full name input exists
        expect(screen.getByPlaceholderText('Type Email')).toBeInTheDocument(); // Check if email input exists
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument(); // Check if password input exists
        expect(screen.getByPlaceholderText('Re-type Password')).toBeInTheDocument(); // Check if retype password input exists
    });

    // Test the error message when passwords do not match
    it('shows error message when passwords do not match', () => {
        render(
            <MemoryRouter>
                <RegisterPage />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password1' } }); // Enter password
        fireEvent.change(screen.getByPlaceholderText('Re-type Password'), { target: { value: 'password2' } }); // Enter a different retype password
        fireEvent.click(screen.getByText('Sign up')); // Click the sign-up button

        expect(screen.getByText("Passwords don't match")).toBeInTheDocument(); // Check if the error message is displayed
    });

    // Test calling Supabase's sign-up method on form submission
    it('calls supabase auth signup on form submit', async () => {
        supabase.auth.signUp.mockResolvedValue({
            data: { user: { id: 'test-user-id' } },
            error: null,
        });

        render(
            <MemoryRouter>
                <RegisterPage />
            </MemoryRouter>
        );

        // Fill the registration form
        fireEvent.change(screen.getByPlaceholderText('Full Name'), { target: { value: 'Test User' } });
        fireEvent.change(screen.getByPlaceholderText('Type Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password' } });
        fireEvent.change(screen.getByPlaceholderText('Re-type Password'), { target: { value: 'password' } });

        await act(async () => {
            fireEvent.click(screen.getByText('Sign up')); // Click the sign-up button
        });

        expect(supabase.auth.signUp).toHaveBeenCalledWith({ // Check if the correct sign-up method was called
            email: 'test@example.com',
            password: 'password',
        });
    });

    // Test handling errors during sign-up
    it('handles signup errors gracefully', async () => {
        const errorMessage = 'Error inserting user data'; // Define error message

        supabase.auth.signUp.mockResolvedValue({
            data: { user: { id: 'test-user-id' } },
            error: null,
        });

        supabase.from.mockReturnValue({
            insert: jest.fn().mockResolvedValue({
                data: null,
                error: { message: errorMessage }, // Mock error during data insertion
            }),
        });

        console.error = jest.fn(); // Mock console.error function

        render(
            <MemoryRouter>
                <RegisterPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Type Email')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Re-type Password')).toBeInTheDocument();
        });

        // Fill the registration form
        fireEvent.change(screen.getByPlaceholderText('Full Name'), { target: { value: 'Test User' } });
        fireEvent.change(screen.getByPlaceholderText('Type Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password' } });
        fireEvent.change(screen.getByPlaceholderText('Re-type Password'), { target: { value: 'password' } });

        await fireEvent.click(screen.getByText('Sign up')); // Click the sign-up button

        await waitFor(() => {
            expect(screen.getByText(errorMessage)).toBeInTheDocument(); // Check if the error message is displayed
        });

        expect(console.error).toHaveBeenCalledWith('Error inserting user data:', expect.anything()); // Ensure console logs the error
    });

    // Test clicking the "Already have an account" button
    it('handles Already have an account button click', async () => {
        supabase.auth.signIn.mockResolvedValue({
            user: { id: 'test-user-id' },
            error: null,
        });

        render(
            <MemoryRouter>
                <RegisterPage />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText('Already have an account?')); // Click "Already have an account" link
        expect(mockNavigate).toHaveBeenCalledWith('/login'); // Check if navigated to login page
    });

    // Test missing user ID after successful registration
    it('throws an error if user ID is not available after signup', async () => {
        const errorMessage = 'User ID not available after signup'; // Define error message

        supabase.auth.signUp.mockResolvedValue({
            data: { user: { id: null } }, // Mock missing user ID after registration
            error: null,
        });

        render(
            <MemoryRouter>
                <RegisterPage />
            </MemoryRouter>
        );

        // Fill the registration form
        fireEvent.change(screen.getByPlaceholderText('Full Name'), { target: { value: 'Test User' } });
        fireEvent.change(screen.getByPlaceholderText('Type Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password' } });
        fireEvent.change(screen.getByPlaceholderText('Re-type Password'), { target: { value: 'password' } });

        await act(async () => {
            fireEvent.click(screen.getByText('Sign up')); // Click the sign-up button
        });

        await waitFor(() => {
            expect(screen.getByText(errorMessage)).toBeInTheDocument(); // Check if the error message is displayed
        });

        expect(console.error).toHaveBeenCalledWith('Error during registration:', expect.any(Error)); // Ensure console logs the registration error
        expect(console.error.mock.calls[0][1].message).toBe(errorMessage); // Check the content of the error message
    });

    // Test showing success alert and redirect after successful registration
    it('shows success alert and redirects on successful registration', async () => {
        supabase.auth.signUp.mockResolvedValue({
            data: { user: { id: 'test-user-id' } },
            error: null,
        });

        supabase.from.mockReturnValue({
            insert: jest.fn().mockResolvedValue({
                data: [{}],
                error: null, // Mock successful data insertion
            }),
        });

        render(
            <MemoryRouter>
                <RegisterPage />
            </MemoryRouter>
        );

        // Fill the registration form
        fireEvent.change(screen.getByPlaceholderText('Full Name'), { target: { value: 'Test User' } });
        fireEvent.change(screen.getByPlaceholderText('Type Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password' } });
        fireEvent.change(screen.getByPlaceholderText('Re-type Password'), { target: { value: 'password' } });

        window.alert = jest.fn(); // Mock alert function

        await act(async () => {
            fireEvent.click(screen.getByText('Sign up')); // Click the sign-up button
        });

        expect(window.alert).toHaveBeenCalledWith('Registration successful! Please check your email to confirm your account.'); // Check if success alert is shown
        expect(mockNavigate).toHaveBeenCalledWith('/login'); // Check if redirected to login page
    });

    // Test handling authentication errors during registration
    it('handles authentication errors during registration', async () => {
        const authError = new Error('Authentication error');

        supabase.auth.signUp.mockResolvedValue({
            data: null,
            error: authError, // Mock authentication error
        });

        render(
            <MemoryRouter>
                <RegisterPage />
            </MemoryRouter>
        );

        // Fill the registration form
        fireEvent.change(screen.getByPlaceholderText('Full Name'), { target: { value: 'Test User' } });
        fireEvent.change(screen.getByPlaceholderText('Type Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password' } });
        fireEvent.change(screen.getByPlaceholderText('Re-type Password'), { target: { value: 'password' } });

        console.error = jest.fn(); // Mock console.error function

        await act(async () => {
            fireEvent.click(screen.getByText('Sign up')); // Click the sign-up button
        });

        expect(console.error).toHaveBeenCalledWith('Error during registration:', authError); // Ensure console logs the authentication error
    });
});
