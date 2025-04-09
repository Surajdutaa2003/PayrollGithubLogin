import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Header from "../../component/Header";
import { MemoryRouter } from "react-router-dom";
import Login from "../../component/Login";
import { jwtDecode } from "jwt-decode";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";


jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(() => jest.fn()), 
}));

jest.mock("@react-oauth/google", () => ({
  GoogleOAuthProvider: ({ children }) => <div>{children}</div>,
  GoogleLogin: jest.fn(({ onSuccess }) => (
    <button
      data-testid="google-login"
      onClick={() => onSuccess({ credential: "mock-token" })}
    >
      Google Login
    </button>
  )),
}));

jest.mock("jwt-decode", () => jest.fn());

Object.defineProperty(window, "location", {
  value: { href: "", search: "" },
  writable: true,
});


jest.mock("../../assets/logo.jpeg", () => "mocked-logo-path");

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
    expect(screen.getByRole("heading", { name: /Employee Payroll/i })).toBeInTheDocument();
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

describe("Header Component - GitHub Login", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    // Reset window.location.search
    delete window.location;
    window.location = { search: "", href: "" };
  });

  it("handles GitHub login via URL parameters", async () => {
    window.location.search = "?id=123&name=Jane123Doe!!!";
    
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    
    await screen.findByText("JaneDoe");
    
    expect(screen.getByText("JaneDoe")).toBeInTheDocument();
    expect(localStorage.getItem("user")).toEqual(
      JSON.stringify({ id: "123", name: "JaneDoe" })
    );
  });

  it("handles GitHub login redirect", async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Sign in with GitHub"));

    await waitFor(() => {
      expect(window.location.href).toBe("http://localhost:5000/auth/github");
    });
  });
 
 
});  
// ss