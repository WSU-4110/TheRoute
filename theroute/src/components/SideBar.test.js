import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from './SideBar';
//import axios from 'axios';

//jest.mock('axios');
beforeAll(() => {
  global.fetch = jest.fn();
});



test('renders Sidebar for allowed paths', () => {
  const { container } = render(
    <MemoryRouter initialEntries={['/map']}>
      <Sidebar />
    </MemoryRouter>
  );
  expect(container.querySelector('.sidebar')).toBeInTheDocument();
});

test('does not render Sidebar for disallowed paths', () => {
  const { container } = render(
    <MemoryRouter initialEntries={['/home']}>
      <Sidebar />
    </MemoryRouter>
  );
  expect(container.querySelector('.sidebar')).not.toBeInTheDocument();
});


test('displays username fetched from API', async () => {
  fetch.mockResolvedValueOnce({
    json: () => Promise.resolve({ username: 'TestUser' })
  });
  const { getByText } = render(
    <MemoryRouter initialEntries={['/map']}>
      <Sidebar />
    </MemoryRouter>
  );

  waitFor(() => {
    expect(getByText(/TestUser/i)).toBeInTheDocument();
  });
});

test('displays "Guest" if no username is available', async () => {
  fetch.mockRejectedValueOnce(new Error('Failed to fetch'));

  const { getByText } = render(
    <MemoryRouter initialEntries={['/map']}>
      <Sidebar />
    </MemoryRouter>
  );

  waitFor(() => {
    expect(getByText('Guest')).toBeInTheDocument();
  });
});

test('renders correct sidebar options', () => {
  const { getByText } = render(
    <MemoryRouter initialEntries={['/map']}>
      <Sidebar />
    </MemoryRouter>
  );

  expect(getByText(/Expenses/)).toBeInTheDocument();
  expect(getByText(/Map/)).toBeInTheDocument();
  expect(getByText(/Achievements/)).toBeInTheDocument();
  expect(getByText(/Trip Details/)).toBeInTheDocument();
});

test('renders Logout button and handles click', () => {
  const { getByText } = render(
    <MemoryRouter initialEntries={['/map']}>
      <Sidebar />
    </MemoryRouter>
  );

  const logoutButton = getByText(/Logout/);
  expect(logoutButton).toBeInTheDocument();

  fireEvent.click(logoutButton);
});

test('displays error message if user fetch fails', async () => {
  fetch.mockRejectedValueOnce(new Error('Fetch error'));

  const { getByText } = render(
    <MemoryRouter initialEntries={['/map']}>
      <Sidebar />
    </MemoryRouter>
  );

  waitFor(() => {
    expect(screen.getByText("Failed to load user details")).toBeInTheDocument();
  });
});

