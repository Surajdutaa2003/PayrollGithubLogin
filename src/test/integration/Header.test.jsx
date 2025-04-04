import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from "../../component/Header"; // Adjust the import path as needed

// Mock the react-router-dom hooks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

// Mock the logo import
jest.mock('../assets/logo.jpeg', () => 'mocked-logo-path');

describe('Header Component', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Mock window.location.search
    delete window.location;
    window.location = { search: '' };
  });

  test('renders header with default user name', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByAltText('Company Logo')).toBeInTheDocument();
    expect(screen.getByText('Employee')).toBeInTheDocument();
    expect(screen.getByText('Payroll')).toBeInTheDocument();
    expect(screen.getByText('User')).toBeInTheDocument();
  });

  test('displays stored user name from localStorage', () => {
    localStorage.setItem('user', JSON.stringify({ name: 'JohnDoe' }));
    
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByText('JohnDoe')).toBeInTheDocument();
  });

  test('updates user name from URL parameters', async () => {
    window.location.search = '?id=123&name=JaneDoe';
    
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('JaneDoe')).toBeInTheDocument();
    });
    expect(localStorage.getItem('user')).toEqual(JSON.stringify({ id: '123', name: 'JaneDoe' }));
  });

  test('sanitizes user name from URL parameters', async () => {
    window.location.search = '?id=123&name=Jane123Doe!!!';
    
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('JaneDoe')).toBeInTheDocument();
    });
  });

  test('toggles dropdown menu on profile button click', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    const profileButton = screen.getByLabelText('User Profile Menu');
    
    // Dropdown should not be visible initially
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();

    // Click to open dropdown
    fireEvent.click(profileButton);
    expect(screen.getByText('Logout')).toBeInTheDocument();

    // Click to close dropdown
    fireEvent.click(profileButton);
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
  });

  it("renders company logo, title, and logout button", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByAltText("Company Logo")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("EmployeePayroll");
  });

  test('profile button has correct aria attributes', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
  
    const profileButton = screen.getByLabelText('User Profile Menu');
    expect(profileButton).toHaveAttribute('aria-expanded', 'false');
    
    fireEvent.click(profileButton);
    expect(profileButton).toHaveAttribute('aria-expanded', 'true');
    
    fireEvent.click(profileButton);
    expect(profileButton).toHaveAttribute('aria-expanded', 'false');
  });
 
});