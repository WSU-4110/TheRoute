import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';
import SignUp from './SignUp';

// Mock the axios module
jest.mock('axios');

describe('SignUp Component', () => {
  test('renders SignUp component', () => {
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );

    expect(screen.getByText('Create an Account')).toBeInTheDocument();
  });

  test('displays error message for short password', async () => {
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText('Email:'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Username:'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText('Password:'), { target: { value: 'short' } });
    fireEvent.change(screen.getByLabelText('Confirm Password:'), { target: { value: 'short' } });

    fireEvent.click(screen.getByText('Sign Up'));

    expect(await screen.findByText('Password must be at least 8 characters long')).toBeInTheDocument();
  });

  test('displays error message for mismatched passwords', async () => {
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText('Email:'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Username:'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText('Password:'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Confirm Password:'), { target: { value: 'password456' } });

    fireEvent.click(screen.getByText('Sign Up'));

    expect(await screen.findByText('Passwords do not match')).toBeInTheDocument();
  });

  test('successful sign up redirects to map page', async () => {
    axios.post.mockResolvedValueOnce({
      data: {
        access: 'mockAccessToken',
        refresh: 'mockRefreshToken',
      },
    });

    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText('Email:'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Username:'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText('Password:'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Confirm Password:'), { target: { value: 'password123' } });

    fireEvent.click(screen.getByText('Sign Up'));

    await screen.findByText('Create an Account'); // Wait for the component to re-render

    expect(localStorage.getItem('access_token')).toBe('mockAccessToken');
    expect(localStorage.getItem('refresh_token')).toBe('mockRefreshToken');
  });

  test('displays error message on registration failure', async () => {
    axios.post.mockRejectedValueOnce({
      response: {
        data: {
          detail: 'Invalid credentials. Please try again.',
        },
      },
    });

    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText('Email:'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Username:'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText('Password:'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Confirm Password:'), { target: { value: 'password123' } });

    fireEvent.click(screen.getByText('Sign Up'));

    expect(await screen.findByText('Invalid credentials. Please try again.')).toBeInTheDocument();
  });
});