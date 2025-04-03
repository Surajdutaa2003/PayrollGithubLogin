import { render, screen, fireEvent } from "@testing-library/react";
import Header from "../../component/Header";
import { MemoryRouter } from "react-router-dom";
import Login from "../../component/Login";
import { jwtDecode } from "jwt-decode"; 
import { act } from "react-dom/test-utils"; 

jest.mock("jwt-decode", () => ({
  jwtDecode: jest.fn(), 
}));


describe("Header Component", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });
  it("opens dropdown on clicking profile icon", () => {
    const mockUser = { name: "John Doe" };
    localStorage.setItem("user", JSON.stringify(mockUser));

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();

   
    fireEvent.click(screen.getByText("John Doe"));

    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  it("logs out the user when logout button is clicked", () => {
    const mockUser = { name: "John Doe" };
    localStorage.setItem("user", JSON.stringify(mockUser));

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("John Doe"));

   
    const logoutButton = screen.getByText("Logout");
    expect(logoutButton).toBeInTheDocument();

   
    fireEvent.click(logoutButton);

    
    expect(localStorage.getItem("user")).toBeNull();
  });

  it("displays the correct title in Typography", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
  
    expect(screen.getByText("Employee Payroll")).toBeInTheDocument();
    expect(screen.getByText("Sign in to manage your payroll")).toBeInTheDocument();

});
it("handles logout when user is logged in via profile dropdown", () => {
  const mockUser = { name: "Test User" };
  localStorage.setItem("user", JSON.stringify(mockUser));

  render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>
  );

  const profileIcon = screen.getByText("Test User"); 
  expect(profileIcon).toBeInTheDocument();
  fireEvent.click(profileIcon);

  const logoutButton = screen.getByText("Logout");
  expect(logoutButton).toBeInTheDocument();

  fireEvent.click(logoutButton);
  expect(localStorage.getItem("user")).toBeNull();
});

});
// ww