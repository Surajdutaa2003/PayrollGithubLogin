import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EmployeeList from "../../component/EmployeeList";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";


vi.mock("axios");


const mockEmployees = [
  {
    id: 1,
    name: "John Doe",
    gender: "Male",
    department: ["HR"],
    salary: 50000,
    startDate: "2025-03-25",
    profileImage: "boy1.jpeg",
  },
  {
    id: 2,
    name: "Jane Smith",
    gender: "Female",
    department: ["Sales"],
    salary: 60000,
    startDate: "2025-04-01",
    profileImage: "girl1.jpeg",
  },
];

describe("EmployeeList Component", () => {
  beforeEach(() => {
    axios.get.mockClear();
    axios.delete.mockClear();
  });

  test("renders EmployeeList with header and table", async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    render(
      <MemoryRouter>
        <EmployeeList />
      </MemoryRouter>
    );

    expect(screen.getByText("Employee Details")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Gender")).toBeInTheDocument();
    expect(screen.getByText("Department")).toBeInTheDocument();
    expect(screen.getByText("Salary")).toBeInTheDocument();
    expect(screen.getByText("Start Date")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
    expect(screen.getByText("No employees found")).toBeInTheDocument();
  });

  test("displays employees from API", async () => {
    axios.get.mockResolvedValueOnce({ data: mockEmployees });

    render(
      <MemoryRouter>
        <EmployeeList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
      expect(screen.getByText(/Jane Smith/i)).toBeInTheDocument();
    }); 
  }); 

    


  test("handles empty employee list", async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    render(
      <MemoryRouter>
        <EmployeeList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("No employees found")).toBeInTheDocument();
    });
  });

  test("handles edit button click", async () => {
    axios.get.mockResolvedValueOnce({ data: mockEmployees });

    render(
      <MemoryRouter>
        <EmployeeList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    });

    const editButtons = screen.getAllByRole("button");
    fireEvent.click(editButtons[1]);

    expect(localStorage.getItem("editEmployeeId")).toBe(null);
  });

  test("checks if Add User button is present", async () => {
    axios.get.mockResolvedValueOnce({ data: mockEmployees }); 

    render(
      <MemoryRouter>
        <EmployeeList />
      </MemoryRouter>
    );

    const addButton = screen.getByText(/Add User/i);
    expect(addButton).toBeInTheDocument();
  });
  
  
  
});
// ss