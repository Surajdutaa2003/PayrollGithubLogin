import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders Employee Payroll heading", () => {
  render(<App />);
  const heading = screen.getByText(/Employee Payroll/i);
  expect(heading).toBeInTheDocument();
});
