import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Login from './Login';

const mockLogin = jest.fn();
const mockNavigate = jest.fn();

// Mocking useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <AuthContext.Provider value={{ login: mockLogin }}>
        <Router>
          <Login />
        </Router>
      </AuthContext.Provider>
    );

  test('renders login form correctly', () => {
    renderComponent();

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Login');
    expect(screen.getByLabelText('Email:')).toBeInTheDocument();
    expect(screen.getByLabelText('Password:')).toBeInTheDocument();
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
  });

//   test('displays error for empty email and password', () => {
//     renderComponent();

//     fireEvent.click(screen.getByRole('button', { name: /login/i }));

//     expect(screen.getByText('Please enter both email and password')).toBeInTheDocument();
//   });

  test('displays error for invalid email format', () => {
    renderComponent();

    fireEvent.change(screen.getByLabelText('Email:'), { target: { value: 'invalidemail' } });
    fireEvent.change(screen.getByLabelText('Password:'), { target: { value: 'validpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(screen.getByText('Please enter a valid email')).toBeInTheDocument();
  });

  test('displays error for password shorter than 8 characters', () => {
    renderComponent();

    fireEvent.change(screen.getByLabelText('Email:'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password:'), { target: { value: 'short' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(screen.getByText('Password must be at least 8 characters long')).toBeInTheDocument();
  });

  test('renders login title correctly', () => {
    renderComponent();
    const loginTitle = screen.getByRole('heading', { level: 2 });
    expect(loginTitle).toHaveTextContent('Login');
  });

  test('renders login button correctly', () => {
    renderComponent(); 
    const loginButton = screen.getByRole('button', { name: /login/i });
    expect(loginButton).toHaveTextContent('Login');
  });

  test('navigates to signup page when Register link is clicked', () => {
    renderComponent();

    fireEvent.click(screen.getByText('Register')); 

    expect(mockNavigate).toHaveBeenCalledWith('/signup');
  });
});
