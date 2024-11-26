import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import ViewAchievements from './ViewAchievements';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';  // Import axios for mocking

// Mock axios (Explicit Mock)
jest.mock('axios', () => {
  const mockGet = jest.fn();
  return {
    create: jest.fn(() => ({
      get: mockGet, // Ensure `get` is properly mocked
      interceptors: {
        request: {
          use: jest.fn(),
        },
      },
    })),
    get: mockGet, // Support direct usage of axios.get if necessary
  };
});

// Mock context
const mockGetAccessToken = jest.fn();

const AuthContextMock = ({ children }) => (
  <AuthContext.Provider value={{ getAccessToken: mockGetAccessToken }}>
    {children}
  </AuthContext.Provider>
);

describe('ViewAchievements Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders header and progress bar', () => {
    render(
      <AuthContextMock>
        <ViewAchievements />
      </AuthContextMock>
    );

    expect(screen.getByText('Achievements')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument(); // Initial progress
  });

  test('fetches and displays achievements correctly', async () => {
    const allAchievements = [
        { id: 1, key: 'first_login', name: 'First Login', description: 'Log in for the first time' },
        { id: 2, key: 'first_expense', name: 'First Expense', description: 'Add your first expense' },
    ];
    const userAchievements = [
        { achievement_id: 1 }, // User has obtained "First Login"
    ];

    // Mock Axios calls
    axios.get.mockResolvedValueOnce({ data: allAchievements }); // Fetch all achievements
    axios.get.mockResolvedValueOnce({ data: userAchievements }); // Fetch user achievements

    mockGetAccessToken.mockResolvedValue('mockToken'); // Mock token retrieval

    // Spy on Axios calls
    const axiosSpy = jest.spyOn(axios, 'get');

    await act(async () => {
        render(
            <AuthContextMock>
                <ViewAchievements />
            </AuthContextMock>
        );
    });

    console.log(screen.debug()); // Debug the DOM

    expect(axiosSpy).toHaveBeenCalledTimes(2); // Ensure two Axios calls are made

    // Wait for elements to appear in the DOM
    await waitFor(() => {
        expect(screen.getByText((content) => content.includes('First Login'))).toBeInTheDocument();
        expect(screen.getByText((content) => content.includes('First Expense'))).toBeInTheDocument();
    });

    // Verify "Obtained" label and progress percentage
    expect(screen.getByText('Obtained')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument(); // 1 of 2 achievements completed
});



  test('displays error message when token is missing', async () => {
    mockGetAccessToken.mockResolvedValue(null); // Simulate missing token

    await act(async () => {
      render(
        <AuthContextMock>
          <ViewAchievements />
        </AuthContextMock>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Authentication required. Please log in again.')).toBeInTheDocument();
    });
  });

  test('handles API errors gracefully', async () => {
    mockGetAccessToken.mockResolvedValue('mockToken'); // Mock token retrieval
    axios.create.mockRejectedValueOnce(new Error('API Error')); // Simulate API error
  
    await act(async () => {
      render(
        <AuthContextMock>
          <ViewAchievements />
        </AuthContextMock>
      );
    });
  
    // Log the rendered DOM for debugging
    console.log(screen.debug());
  
    await waitFor(() => {
      // Update expectation to match the rendered error text
      expect(screen.getByText('Error fetching user achievements')).toBeInTheDocument();
    });
  });
  

  test('displays default message when no achievements are available', async () => {
    mockGetAccessToken.mockResolvedValue('mockToken'); // Mock token retrieval
    axios.create.mockResolvedValueOnce({ data: [] }); // Simulate empty achievements list
    axios.create.mockResolvedValueOnce({ data: [] }); // Simulate empty user achievements

    await act(async () => {
      render(
        <AuthContextMock>
          <ViewAchievements />
        </AuthContextMock>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('No achievements available to display.')).toBeInTheDocument();
    });
  });

  test('calculates and displays progress percentage correctly', async () => {
    const allAchievements = [
      { id: 1, key: 'first_login', name: 'First Login', description: 'Log in for the first time' },
      { id: 2, key: 'first_expense', name: 'First Expense', description: 'Add your first expense' },
    ];
    const userAchievements = [{ achievement_id: 1 }]; // Simulate that "First Login" is obtained
  
    mockGetAccessToken.mockResolvedValue('mockToken');
    axios.get.mockResolvedValueOnce({ data: allAchievements });
    axios.get.mockResolvedValueOnce({ data: userAchievements });
  
    await act(async () => {
      render(
        <AuthContextMock>
          <ViewAchievements />
        </AuthContextMock>
      );
    });
  
    await waitFor(() => {
      expect(screen.getByText('50%')).toBeInTheDocument(); // 1 of 2 achievements completed
    });
  });  
});