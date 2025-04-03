import { render, screen } from "@testing-library/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App";

const clientId = "test-client-id"; 

jest.mock("@react-oauth/google", () => ({
  GoogleOAuthProvider: jest.fn(({ children }) => <div data-testid="google-provider">{children}</div>),
}));

describe("Main Entry File", () => {
  it("renders App inside GoogleOAuthProvider", async () => {
    render(
      <GoogleOAuthProvider clientId={clientId}>
        <App />
      </GoogleOAuthProvider>
    );

    // Expectation ko properly check karne ke liye queryByTestId use karo
    expect(screen.getByText(/employee payroll/i)).toBeInTheDocument();
});
});
