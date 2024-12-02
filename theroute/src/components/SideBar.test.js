import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Sidebar from './SideBar';

// Mock data for AuthContext
const mockAuthContextValueWithUser = { user: { username: 'TestUser' } };
const mockAuthContextValueWithoutUser = { user: null };

// Utility function to render Sidebar with context
const renderSidebar = (path, contextValue) => {
  return render(
    <AuthContext.Provider value={contextValue}>
      <MemoryRouter initialEntries={[path]}>
        <Sidebar />
      </MemoryRouter>
    </AuthContext.Provider>
  );
};

describe('Sidebar Component Tests', () => {
  test('renders Sidebar for allowed paths', () => {
    const { container } = renderSidebar('/map', mockAuthContextValueWithUser);
    expect(container.querySelector('.sidebar')).toBeInTheDocument();
  });

  test('does not render Sidebar for disallowed paths', () => {
    const { container } = renderSidebar('/home', mockAuthContextValueWithUser);
    expect(container.querySelector('.sidebar')).not.toBeInTheDocument();
  });

  test('renders correct number of sidebar navigation links', () => {
    const { container } = renderSidebar('/map', mockAuthContextValueWithUser);
  
    // Select all the <a> tags within the sidebar
    const navLinks = container.querySelectorAll('a');
  
    // Verify the number of links matches the expected count
    expect(navLinks.length).toBe(5); // 4 navigation links + 1 logout link
  });
  

  test('displays "User" if no username is provided in AuthContext', () => {
    const { getByText } = renderSidebar('/map', mockAuthContextValueWithoutUser);
    expect(getByText('User')).toBeInTheDocument();
  });

  test('renders correct sidebar options', () => {
    const { getByText } = renderSidebar('/map', mockAuthContextValueWithUser);
    expect(getByText(/Expenses/)).toBeInTheDocument();
    expect(getByText(/Map/)).toBeInTheDocument();
    expect(getByText(/Achievements/)).toBeInTheDocument();
    expect(getByText(/Trip Details/)).toBeInTheDocument();
  });

  test('renders Logout button and handles click', () => {
    const { getByText } = renderSidebar('/map', mockAuthContextValueWithUser);
    const logoutButton = getByText(/Logout/);
    expect(logoutButton).toBeInTheDocument();
    fireEvent.click(logoutButton);
    // Verify if click triggers expected behavior, e.g., redirection or function call
  });

  test('toggles sidebar on button click', () => {
    const { container, getByText } = renderSidebar('/map', mockAuthContextValueWithUser);
    const toggleButton = container.querySelector('.sidebar-toggle');
    expect(toggleButton).toBeInTheDocument();

    fireEvent.click(toggleButton); // Open sidebar
    expect(container.querySelector('.sidebar.open')).toBeInTheDocument();

    fireEvent.click(container.querySelector('.close > svg')); // Close sidebar
    expect(container.querySelector('.sidebar.open')).not.toBeInTheDocument();
  });
});
