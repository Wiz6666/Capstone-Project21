import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProfilePage from '../pages/ProfilePage';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

jest.mock('../supabaseClient', () => ({
    supabase: {
        auth: {
            getUser: jest.fn(),
        },
        from: jest.fn(() => ({
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn(),
            update: jest.fn().mockResolvedValue({ error: null }),
        })),
    },
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

// Mock convertToBase64
jest.mock('../pages/ProfilePage', () => {
    return {
        __esModule: true,
        ...jest.requireActual('../pages/ProfilePage'),
        convertToBase64: jest.fn(),
    };
});

import '@testing-library/jest-dom';
import { convertToBase64 } from '../pages/ProfilePage'; // Import the mocked function

describe('ProfilePage', () => {
    const userId = 'test-user-id';
    const navigate = jest.fn();

    beforeEach(() => {
        useNavigate.mockReturnValue(navigate);
        supabase.auth.getUser.mockResolvedValue({
            data: { user: { id: userId } },
            error: null,
        });

        supabase.from.mockReturnValue({
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({
                data: {
                    username: 'Test User',
                    role: 'Admin',
                    phone_number: '123456789',
                    location: 'Test Location',
                    avatar_url: '/test-avatar.png',
                    email: 'test@example.com',
                },
                error: null,
            }),
            update: jest.fn().mockResolvedValue({ error: null }),
        });

        jest.spyOn(console, 'error').mockImplementation(() => {});

        render(
            <MemoryRouter initialEntries={[`/profile/${userId}`]}>
                <ProfilePage />
            </MemoryRouter>
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // Test if the profile data is rendered correctly
    test('renders profile data', async () => {
        expect(screen.getByText(/loading profile data/i)).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText('Test User')).toBeInTheDocument();
            expect(screen.getByText('Admin')).toBeInTheDocument();
            expect(screen.getByText('test@example.com')).toBeInTheDocument();
            expect(screen.getByText('123456789')).toBeInTheDocument();
            expect(screen.getByText('Test Location')).toBeInTheDocument();
        });
    });

    // Test handling a click outside while editing
    test('handles click outside while editing', async () => {
        await waitFor(() => {
            fireEvent.click(screen.getByText(/Test User/i));
        });

        fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Updated User' } });
        fireEvent.mouseDown(document);

        await waitFor(() => {
            expect(screen.getByText('Test User')).toBeInTheDocument();
        });
    });

    // Test successful avatar upload
    test('successfully uploads avatar', async () => {
        const file = new Blob(['test'], { type: 'image/png' });
        const base64 = 'data:image/png;base64,testbase64string';

        // Mock convertToBase64 to return a resolved promise
        convertToBase64.mockResolvedValue(base64);

        // Mock Supabase update method
        supabase.from().update.mockResolvedValue({ error: null });

        // Wait for the component to render
        await waitFor(() => {
            expect(screen.getByAltText(/avatar/i)).toBeInTheDocument();
        });

        // Find the avatar img element and simulate a click to trigger avatar upload
        const avatarImg = screen.getByAltText(/avatar/i);
        fireEvent.click(avatarImg); // Simulate clicking avatar

        // Find the file input and simulate file upload
        const input = document.createElement('input');
        input.type = 'file';
        document.body.appendChild(input); // Add the input to the document

        fireEvent.change(input, { target: { files: [file] } }); // Simulate file upload
    });

    // Test closing avatar modal when clicking outside
    test('closes avatar modal when clicking outside', async () => {
        // Wait for the component to render
        await waitFor(() => {
            expect(screen.getByAltText(/avatar/i)).toBeInTheDocument();
        });

        // Find the avatar img element and simulate a click to trigger avatar upload
        const avatarImg = screen.getByAltText(/avatar/i);
        fireEvent.click(avatarImg); // Simulate clicking avatar

        // Simulate clicking outside the modal
        fireEvent.mouseDown(document); // Click outside

        // Wait to verify that the modal has closed
        await waitFor(() => {
            expect(screen.queryByText(/modal content/i)).not.toBeInTheDocument(); // Ensure the modal is closed
        });
    });

    // Add a test case to cover handleFieldUpdate for different fields
    test('handles username field update', async () => {
        await waitFor(() => {
            fireEvent.click(screen.getByText(/Test User/i));
        });
        fireEvent.change(screen.getByRole('textbox'), { target: { value: 'New Username' } });
        fireEvent.click(screen.getByText(/save/i));
        // Verify that the Supabase update method was called
        await waitFor(() => {
            expect(supabase.from().update).toHaveBeenCalledWith({ username: 'New Username' });
        });
    });

    test('handles role field update', async () => {
        await waitFor(() => {
            fireEvent.click(screen.getByText(/Admin/i));
        });
        fireEvent.change(screen.getByRole('textbox'), { target: { value: 'New Admin' } });
        fireEvent.click(screen.getByText(/save/i));
        // Verify that the Supabase update method was called
        await waitFor(() => {
            expect(supabase.from().update).toHaveBeenCalledWith({ role: 'New Admin' });
        });
    });

    test('handles email field update', async () => {
        await waitFor(() => {
            fireEvent.click(screen.getByText(/test@example.com/i));
        });
        fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Newtest@example.com' } });
        fireEvent.click(screen.getByText(/save/i));
        // Verify that the Supabase update method was called
        await waitFor(() => {
            expect(supabase.from().update).toHaveBeenCalledWith({ email: 'Newtest@example.com' });
        });
    });

    test('handles phone_number field update', async () => {
        await waitFor(() => {
            fireEvent.click(screen.getByText(/123456789/i));
        });
        fireEvent.change(screen.getByRole('textbox'), { target: { value: '223456789' } });
        fireEvent.click(screen.getByText(/save/i));
        // Verify that the Supabase update method was called
        await waitFor(() => {
            expect(supabase.from().update).toHaveBeenCalledWith({ phone_number: '223456789' });
        });
    });

    test('handles location field update', async () => {
        await waitFor(() => {
            fireEvent.click(screen.getByText(/Test Location/i));
        });
        fireEvent.change(screen.getByRole('textbox'), { target: { value: 'New Test Location' } });
        fireEvent.click(screen.getByText(/save/i));
        // Verify that the Supabase update method was called
        await waitFor(() => {
            expect(supabase.from().update).toHaveBeenCalledWith({ location: 'New Test Location' });
        });
    });
});
