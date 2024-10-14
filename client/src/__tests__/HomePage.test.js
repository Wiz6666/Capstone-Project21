import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // To enable navigation for testing
import HomePage from '../pages/HomePage';
import fetch from 'node-fetch';
import '@testing-library/jest-dom';

// Mock video file path
jest.mock('../public/24 uwa capstone Group20 webpage background video.mp4', () => 'mockedVideoUrl.mp4');

describe('HomePage Component', () => {
  test('renders the main title', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    const titleElement = screen.getByText(/PROJECT MANAGEMENT SYSTEM/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('renders Sign in and Sign up buttons', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    const signInButton = screen.getByText(/Sign in/i);
    const signUpButton = screen.getByText(/Sign up/i);
    expect(signInButton).toBeInTheDocument();
    expect(signUpButton).toBeInTheDocument();
  });

  test('renders What is AASYP PMS? section', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    const infoTitle = screen.getByText(/WHAT IS AASYP PMS\?/i);
    const description = screen.getByText(/Our mission is to empower teams/i);
    expect(infoTitle).toBeInTheDocument();
    expect(description).toBeInTheDocument();
  });

  test('renders Contact Us section with contact details', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    const contactTitle = screen.getByText(/CONTACT US/i);
    const phone = screen.getByText(/\(123\) 456-7890/);
    const email = screen.getByText(/team@aasyp.org/i);
    expect(contactTitle).toBeInTheDocument();
    expect(phone).toBeInTheDocument();
    expect(email).toBeInTheDocument();
  });

  test('renders social media icons with links', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    const twitterIcon = screen.getByAltText(/Twitter/i);
    const facebookIcon = screen.getByAltText(/Facebook/i);
    const instagramIcon = screen.getByAltText(/Instagram/i);
    const linkedinIcon = screen.getByAltText(/LinkedIn/i);
    expect(twitterIcon).toBeInTheDocument();
    expect(facebookIcon).toBeInTheDocument();
    expect(instagramIcon).toBeInTheDocument();
    expect(linkedinIcon).toBeInTheDocument();
  });
});
