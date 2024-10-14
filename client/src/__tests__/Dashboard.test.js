import React from 'react';
import { render, screen } from '@testing-library/react';
import DashboardPage from '../pages/Dashboard';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import fetch from 'node-fetch';
import '@testing-library/jest-dom';





describe('DashboardPage Component', () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );
  });

  test('renders the main title for core data', () => {
    const titleElement = screen.getByText(/PMS DASHBOARD - CORE DATA/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('renders the task completion data cards', () => {
    const completedTaskCard = screen.getByText(/COMPLETED PROJECT/i);
    const inProgressTaskCard = screen.getByText(/IN PROGRESS PROJECT/i);
    const toDoTaskCard = screen.getByText(/TO DO PROJECT/i);
    const completionRateCard = screen.getByText(/PROJECT COMPLETION RATE/i);
    expect(completedTaskCard).toBeInTheDocument();
    expect(inProgressTaskCard).toBeInTheDocument();
    expect(toDoTaskCard).toBeInTheDocument();
    expect(completionRateCard).toBeInTheDocument();
  });

  test('renders priority pie chart', () => {
    const chartTitle = screen.getByText(/ALL PROJECT BY PRIORITY/i);
    expect(chartTitle).toBeInTheDocument();
  });

  test('renders status bar chart', () => {
    const chartTitle = screen.getByText(/PROJECT COMPLETION BY STATUS/i);
    expect(chartTitle).toBeInTheDocument();
  });

  test('renders the main title for group data', () => {
    const titleElement = screen.getByText(/PMS DASHBOARD - GROUP DATA/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('renders group pie chart', () => {
    const chartTitle = screen.getByText(/PROJECT BY GROUP/i);
    expect(chartTitle).toBeInTheDocument();
  });

  test('renders durations bar chart', () => {
    const chartTitle = screen.getByText(/PROJECT DURATIONS/i);
    expect(chartTitle).toBeInTheDocument();
  });
});
