import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import ViewTrips from './ViewTrips';

// Mock the useNavigate hook
jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');
  return {
    ...originalModule,
    useNavigate: jest.fn(),
  };
});

describe('ViewTrips Component', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock data
    localStorage.clear(); // Clear localStorage
    useNavigate.mockReturnValue(mockNavigate); // Mock the navigate function
  });

  afterEach(() => {
    jest.resetModules(); // Reset modules to avoid interference
  });

  test('renders message when no trips are found', () => {
    localStorage.setItem('userEmail', 'test@example.com');

    render(
      <MemoryRouter>
        <ViewTrips />
      </MemoryRouter>
    );

    expect(screen.getByText(/No trips found/i)).toBeInTheDocument();
    expect(screen.getByText(/Add Your First Trip/i)).toBeInTheDocument();
  });

  test('renders trips when available', () => {
    const trips = [
      {
        email: 'test@example.com',
        startLocation: 'New York',
        endLocation: 'Los Angeles',
        tripDate: '2023-10-01',
        tripDistance: 3000,
        returnDate: '2023-10-10',
        vehicleInfo: 'Car',
        expenses: 500,
        plannedLocations: 'Chicago, Denver',
      },
    ];

    localStorage.setItem('userEmail', 'test@example.com');
    localStorage.setItem('trips', JSON.stringify(trips));

    render(
      <MemoryRouter>
        <ViewTrips />
      </MemoryRouter>
    );

    expect(screen.getByText(/New York → Los Angeles/i)).toBeInTheDocument();
    expect(screen.getByText(/Distance:/i)).toBeInTheDocument();
    expect(screen.getByText(/3000 miles/i)).toBeInTheDocument();
  });

  test('redirects to login if userEmail is not found', () => {
    render(
      <MemoryRouter>
        <ViewTrips />
      </MemoryRouter>
    );

    // Assert that navigate('/login') was called
    expect(mockNavigate).toHaveBeenCalledWith('/login');
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

  test('displays multiple trips correctly', () => {
    const trips = [
      {
        email: 'test@example.com',
        startLocation: 'New York',
        endLocation: 'Los Angeles',
        tripDate: '2023-10-01',
        tripDistance: 3000,
        returnDate: '2023-10-10',
        vehicleInfo: 'Car',
        expenses: 500,
        plannedLocations: 'Chicago, Denver',
      },
      {
        email: 'test@example.com',
        startLocation: 'Miami',
        endLocation: 'Seattle',
        tripDate: '2023-11-01',
        tripDistance: 2500,
        returnDate: '2023-11-10',
        vehicleInfo: 'Plane',
        expenses: 700,
        plannedLocations: 'Dallas, Denver',
      },
    ];

    localStorage.setItem('userEmail', 'test@example.com');
    localStorage.setItem('trips', JSON.stringify(trips));

    render(
      <MemoryRouter>
        <ViewTrips />
      </MemoryRouter>
    );

    expect(screen.getByText(/New York → Los Angeles/i)).toBeInTheDocument();
    expect(screen.getByText(/Miami → Seattle/i)).toBeInTheDocument();
  });

  test('displays planned stops if available', () => {
    const trips = [
      {
        email: 'test@example.com',
        startLocation: 'Boston',
        endLocation: 'Chicago',
        tripDate: '2023-12-01',
        tripDistance: 1000,
        returnDate: '2023-12-05',
        vehicleInfo: 'Bus',
        expenses: 300,
        plannedLocations: 'Cleveland, Detroit',
      },
    ];

    localStorage.setItem('userEmail', 'test@example.com');
    localStorage.setItem('trips', JSON.stringify(trips));

    render(
      <MemoryRouter>
        <ViewTrips />
      </MemoryRouter>
    );

    expect(screen.getByText(/Planned Stops:/i)).toBeInTheDocument();
    expect(screen.getByText(/Cleveland, Detroit/i)).toBeInTheDocument();
  });

  test('navigates back when back button is clicked', () => {
    render(
      <MemoryRouter>
        <ViewTrips />
      </MemoryRouter>
    );

    const backButton = screen.getByText(/Back/i);
    expect(backButton).toBeInTheDocument();

    // Simulate click
    userEvent.click(backButton);

    // Assert navigation (navigates back one step)
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});
