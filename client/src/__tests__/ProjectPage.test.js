import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import ProjectBoard from '../pages/ProjectPage';
import { supabase } from '../supabaseClient';

// Mock Supabase client
jest.mock('../supabaseClient', () => ({
    supabase: {
        from: jest.fn(() => ({
            select: jest.fn().mockReturnThis(),
            insert: jest.fn().mockReturnThis(),
            delete: jest.fn().mockReturnThis(),
            in: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            update: jest.fn().mockReturnThis(),
            single: jest.fn().mockReturnThis(),
            mockResolvedValue: jest.fn(),
        })),
    },
}));

describe('ProjectBoard', () => {
    const projectsMock = [
        {
            id: 1,
            title: 'Test Project 1',
            tasks_project_id_fkey: [
                { id: 1, task_name: 'Task 1', priority: 'High' },
                { id: 2, task_name: 'Task 2', priority: 'Low' },
            ],
        },
        {
            id: 2,
            title: 'Test Project 2',
            tasks_project_id_fkey: [],
        },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders project board correctly', async () => {
        supabase.from().select().mockResolvedValueOnce({ data: projectsMock, error: null });

        render(
            <MemoryRouter>
                <ProjectBoard />
            </MemoryRouter>
        );

        expect(await screen.findByText('PROJECT BOARD')).toBeInTheDocument();
        expect(await screen.findByText('Test Project 1')).toBeInTheDocument();
        expect(await screen.findByText('Test Project 2')).toBeInTheDocument();
        expect(await screen.findByText('Task 1')).toBeInTheDocument();
    });

    it('adds a new project', async () => {
        const newProject = {
            id: 3,
            title: 'New Project',
            tasks_project_id_fkey: [],
        };

        supabase.from().insert().mockResolvedValueOnce({ data: newProject, error: null });
        supabase.from().select().mockResolvedValueOnce({ data: projectsMock, error: null });

        render(
            <MemoryRouter>
                <ProjectBoard />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText('NEW PROJECT +'));

        await waitFor(() => {
            expect(screen.getByText('New Project')).toBeInTheDocument();
        });
    });

    it('deletes selected projects', async () => {
        supabase.from().delete().in().mockResolvedValueOnce({ error: null });
        supabase.from().select().mockResolvedValueOnce({ data: projectsMock, error: null });

        render(
            <MemoryRouter>
                <ProjectBoard />
            </MemoryRouter>
        );

        const checkbox = await screen.findAllByRole('checkbox');
        fireEvent.click(checkbox[0]); // Select the first project
        fireEvent.click(screen.getByText('DELETE'));

        await waitFor(() => {
            expect(screen.queryByText('Test Project 1')).not.toBeInTheDocument();
        });
    });

    it('filters projects based on search', async () => {
        supabase.from().select().mockResolvedValueOnce({ data: projectsMock, error: null });

        render(
            <MemoryRouter>
                <ProjectBoard />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText('Search for project...'), { target: { value: 'Project 1' } });

        expect(await screen.findByText('Test Project 1')).toBeInTheDocument();
        expect(screen.queryByText('Test Project 2')).not.toBeInTheDocument();
    });

    it('edits and saves project title', async () => {
        const editedTitle = 'Edited Project 1';
        supabase.from().update().eq().mockResolvedValueOnce({ error: null });

        render(
            <MemoryRouter>
                <ProjectBoard />
            </MemoryRouter>
        );

        fireEvent.click(await screen.findByText('Test Project 1'));

        const input = screen.getByDisplayValue('Test Project 1');
        fireEvent.change(input, { target: { value: editedTitle } });
        fireEvent.blur(input);

        await waitFor(() => {
            expect(screen.getByText(editedTitle)).toBeInTheDocument();
        });
    });
});
