import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import EmployeeForm from "../../component/EmployeeForm";
import axios from "axios";
jest.mock("axios");

describe("EmployeeForm Component", () => {
  test("should allow user to input Name", () => {
    render(
      <MemoryRouter>
        <EmployeeForm />
      </MemoryRouter>
    );

    const nameInput = screen.getByPlaceholderText("Enter employee name");
    fireEvent.change(nameInput, { target: { value: "Jane Doe" } });

    expect(nameInput.value).toBe("Jane Doe");
  });

  test("should allow user to submit form", () => {
    render(
      <MemoryRouter>
        <EmployeeForm />
      </MemoryRouter>
    );

    const nameInput = screen.getByPlaceholderText("Enter employee name");
    fireEvent.change(nameInput, { target: { value: "Jane Doe" } });

    const submitButton = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(submitButton);

    
  });
  test("should allow user to select a profile image", () => {
    render(
      <MemoryRouter>
        <EmployeeForm />
      </MemoryRouter>
    );
  
    const radioButton = screen.getByRole("radio", { name: /boy1.jpeg/i });
    fireEvent.click(radioButton);
    expect(radioButton).toBeChecked();
  });
  
  test("should allow user to select gender", () => {
    render(
      <MemoryRouter>
        <EmployeeForm />
      </MemoryRouter>
    );
  
    const maleRadio = screen.getByLabelText("Male");
    fireEvent.click(maleRadio);
  
    expect(maleRadio.checked).toBe(true);
  });
  test("should allow user to select department", () => {
    render(
      <MemoryRouter>
        <EmployeeForm />
      </MemoryRouter>
    );
  
    const departmentCheckbox = screen.getByLabelText("HR");
    fireEvent.click(departmentCheckbox);
  
    expect(departmentCheckbox.checked).toBe(true);
  });

  test("should allow user to select salary", () => {
    render(
      <MemoryRouter>
        <EmployeeForm />
      </MemoryRouter>
    );
  
    const salaryDropdown = screen.getByRole("combobox", { name: /salary/i });
    fireEvent.change(salaryDropdown, { target: { value: "50000" } });
  
    expect(salaryDropdown.value).toBe("50000");
  });
  
  test("should show error messages for empty fields on submit", async () => {
    render(
      <MemoryRouter>
        <EmployeeForm />
      </MemoryRouter>
    );
  
    const submitButton = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(submitButton);
  
    expect(screen.getByText("Employee name is required")).toBeInTheDocument();
    expect(screen.getByText("Please select a profile image")).toBeInTheDocument();
    expect(screen.getByText("Please select a gender")).toBeInTheDocument();
  });
  
  test("should clear the form when reset is clicked", () => {
    render(
      <MemoryRouter>
        <EmployeeForm />
      </MemoryRouter>
    );
  
    const nameInput = screen.getByPlaceholderText("Enter employee name");
    fireEvent.change(nameInput, { target: { value: "John Doe" } });
  
    const resetButton = screen.getByRole("button", { name: /reset/i });
    fireEvent.click(resetButton);
  
    expect(nameInput.value).toBe("");
  });
test("should show validation errors when form fields are empty", async () => {
  render(
    <MemoryRouter>
      <EmployeeForm />
    </MemoryRouter>
  );

  fireEvent.click(screen.getByText("Submit"));

  expect(screen.getByText("Employee name is required")).toBeInTheDocument();
  expect(screen.getByText("Please select at least one department")).toBeInTheDocument();
expect(screen.getByText("Please select a salary")).toBeInTheDocument();
expect(screen.getByText("Please select a start day")).toBeInTheDocument();

});

   
test("should update profile image selection when clicked", async () => {
  render(
    <MemoryRouter>
      <EmployeeForm />
    </MemoryRouter>
  );

  const profileImages = await screen.findAllByTestId("profile-image-option");
  fireEvent.click(profileImages[1]); 

  expect(profileImages[1]).toBeChecked(); 
});

test("EmployeeForm Component > should reset profile image on form reset", () => {
  render(
    <MemoryRouter>
      <EmployeeForm />
    </MemoryRouter>
  );

 
  const profileImages = screen.getAllByRole("radio");
  fireEvent.click(profileImages[1]); 
  expect(profileImages[1].checked).toBe(true);

  
  const resetButton = screen.getByText(/reset/i);
  fireEvent.click(resetButton);

 
  profileImages.forEach((image) => {
    expect(image.checked).toBe(false);
  });
});
test("should progressively validate required fields", () => {
  render(
    <MemoryRouter>
      <EmployeeForm />
    </MemoryRouter>
  );

  const submitButton = screen.getByRole("button", { name: /submit/i });
  fireEvent.click(submitButton);

  expect(screen.getByText("Employee name is required")).toBeInTheDocument();
  expect(screen.getByText("Please select a profile image")).toBeInTheDocument();

  fireEvent.change(screen.getByPlaceholderText("Enter employee name"), {
    target: { value: "Jane Doe" },
  });
  fireEvent.click(submitButton);

  expect(screen.queryByText("Employee name is required")).not.toBeInTheDocument();
});


});