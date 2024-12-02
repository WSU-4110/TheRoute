import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import ViewTrips from './ViewTrips';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../components/axios'; // Import axiosInstance for mocking

jest.mock('../components/axios'); // Mock axiosInstance

const mockGetAccessToken = jest.fn();

const mockAuthContextValue = {
  getAccessToken: mockGetAccessToken,
};

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
    jest.clearAllMocks();
    localStorage.clear();
    mockGetAccessToken.mockReturnValue('mockAccessToken');
    useNavigate.mockReturnValue(mockNavigate);
  });

  test('renders message when no trips are found', async () => {
    axiosInstance.get.mockResolvedValueOnce({ data: [] }); // Mock no trips response
    localStorage.setItem('userEmail', 'test@example.com'); // Mock userEmail in localStorage
  
    render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <MemoryRouter>
          <ViewTrips />
        </MemoryRouter>
      </AuthContext.Provider>
    );
  
    await waitFor(() => {
      expect(screen.getByText(/No trips found for test@example.com/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/Add Your First Trip/i)).toBeInTheDocument();
  });
  

  test('renders trips when available', async () => {
    const trips = [
      {
        id: 1,
        start_location: 'New York',
        end_location: 'Los Angeles',
        start_date: '2023-10-01',
        end_date: '2023-10-10',
        trip_name: 'Business Trip',
        trip_distance: 3000,
        budget: 500,
        plannedLocations: 'Chicago, Denver',
      },
    ];
    axiosInstance.get.mockResolvedValueOnce({ data: trips }); // Mock trips response

    localStorage.setItem('userEmail', 'test@example.com');

    render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <MemoryRouter>
          <ViewTrips />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/New York → Los Angeles/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/Distance:/i)).toBeInTheDocument();
    expect(screen.getByText(/3000 mi/i)).toBeInTheDocument();
  });

  test('displays loading message while fetching trips', async () => {
    axiosInstance.get.mockImplementationOnce(
      () => new Promise((resolve) => setTimeout(() => resolve({ data: [] }), 500)) // Mock delayed response
    );
  
    render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <MemoryRouter>
          <ViewTrips />
        </MemoryRouter>
      </AuthContext.Provider>
    );
  
    // Assert that the loading message is shown initially
    expect(screen.getByText(/Loading trips.../i)).toBeInTheDocument();
  
    // Wait for the loading message to disappear
    await waitFor(() => {
      expect(screen.queryByText(/Loading trips.../i)).not.toBeInTheDocument();
    });
  });
  

  test('displays error message if fetching trips fails', async () => {
    axiosInstance.get.mockRejectedValueOnce(new Error('Error fetching trips')); // Mock API error

    render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <MemoryRouter>
          <ViewTrips />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Error fetching trips/i)).toBeInTheDocument();
    });
  });

  test('displays authentication error if userEmail is not found', async () => {
    // Mock getAccessToken to return null (simulate authentication failure)
    mockGetAccessToken.mockResolvedValueOnce(null);
  
    render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <MemoryRouter>
          <ViewTrips />
        </MemoryRouter>
      </AuthContext.Provider>
    );
  
    // Assert that the authentication error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/Authentication required. Please log in again./i)).toBeInTheDocument();
    });
  });
  
  
  
  

  test('displays planned stops if available', async () => {
    const trips = [
      {
        id: 1,
        start_location: 'Boston',
        end_location: 'Chicago',
        start_date: '2023-12-01',
        end_date: '2023-12-05',
        trip_name: 'Vacation',
        trip_distance: 1000,
        budget: 300,
        plannedLocations: 'Cleveland, Detroit',
      },
    ];
    axiosInstance.get.mockResolvedValueOnce({ data: trips }); // Mock trips response

    localStorage.setItem('userEmail', 'test@example.com');

    render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <MemoryRouter>
          <ViewTrips />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Planned Stops:/i)).toBeInTheDocument();
      expect(screen.getByText(/Cleveland, Detroit/i)).toBeInTheDocument();
    });
  });
});