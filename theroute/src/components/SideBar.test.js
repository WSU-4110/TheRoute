import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from './SideBar';
import AuthProvider from '../context/AuthContext'; // Import AuthProvider

beforeAll(() => {
  global.fetch = jest.fn();
});

test('renders Sidebar for allowed paths', () => {
  const { container } = render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/map']}>
        <Sidebar />
      </MemoryRouter>
    </AuthProvider>
  );
  expect(container.querySelector('.sidebar')).toBeInTheDocument();
});

test('does not render Sidebar for disallowed paths', () => {
  const { container } = render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/home']}>
        <Sidebar />
      </MemoryRouter>
    </AuthProvider>
  );
  expect(container.querySelector('.sidebar')).not.toBeInTheDocument();
});

test('displays username fetched from API', async () => {
  fetch.mockResolvedValueOnce({
    json: () => Promise.resolve({ username: 'TestUser' })
  });

  render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/map']}>
        <Sidebar />
      </MemoryRouter>
    </AuthProvider>
  );

  await waitFor(() => {
    expect(screen.getByText(/TestUser/i)).toBeInTheDocument();
  });
});

test('displays "Guest" if no username is available', async () => {
  fetch.mockRejectedValueOnce(new Error('Failed to fetch'));

  render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/map']}>
        <Sidebar />
      </MemoryRouter>
    </AuthProvider>
  );

  await waitFor(() => {
    expect(screen.getByText('Guest')).toBeInTheDocument();
  });
});

test('renders Logout button and handles click', () => {
  const { getByText } = render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/map']}>
        <Sidebar />
      </MemoryRouter>
    </AuthProvider>
  );

  const logoutButton = getByText(/Logout/);
  expect(logoutButton).toBeInTheDocument();

  fireEvent.click(logoutButton); // Check for Logout click behavior
});

test('displays error message if user fetch fails', async () => {
  fetch.mockRejectedValueOnce(new Error('Fetch error'));

  render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/map']}>
        <Sidebar />
      </MemoryRouter>
    </AuthProvider>
  );

  await waitFor(() => {
    expect(screen.getByText('Failed to load user details')).toBeInTheDocument();
  });
});
