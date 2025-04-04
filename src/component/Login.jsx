import React, { Component } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { Button, Typography, Container, Box } from "@mui/material";
import { FaGithub } from "react-icons/fa";

import "../styles/Login.scss";
import Footer from "./Footer";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      isLoading: false,
      githubLoading: false,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get("id");
      const username = urlParams.get("username");
      const avatar = urlParams.get("avatar");

      if (id && username && avatar) {
        const githubUser = { id, name: username, avatar };
        localStorage.setItem("user", JSON.stringify(githubUser));
        this.setState({ user: githubUser });

        window.history.replaceState(null, "", "/employees");
      }
    }, 500);
  }

  handleSuccess = (response) => {
    const token = response.credential;
    const decodedUser = jwtDecode(token);

    this.setState({ user: decodedUser, isLoading: true });
    localStorage.setItem("user", JSON.stringify(decodedUser));

    setTimeout(() => {
      this.props.navigate("/employees");
    }, 1000);
  };

  handleError = () => {
    alert("Login Failed! Please try again.");
  };

  handleLogout = () => {
    this.setState({ user: null });
    localStorage.removeItem("user");
  };

  handleGitHubLogin = () => {
    this.setState({ githubLoading: true });

    setTimeout(() => {
      window.location.href = "http://localhost:5000/auth/github";
    }, 500); // Give time for animation to show
  };

  renderAuthSection = () => {
    const { isLoading, user, githubLoading } = this.state;

    if (isLoading) {
      return <div className="spinner"></div>;
    }

    if (user) {
      return (
        <div className="welcome-section">
          <Typography variant="h6" className="welcome-text">
            Welcome, {user.name}!
          </Typography>
          <Button
            variant="outlined"
            onClick={this.handleLogout}
            className="logout-button"
          >
            Logout
          </Button>
        </div>
      );
    }

    return (
      <div className="auth-buttons">
        <GoogleLogin
          onSuccess={this.handleSuccess}
          onError={this.handleError}
          className="google-login-button"
          data-testid="google-login"
        />

        <Button
          variant="contained"
          startIcon={!githubLoading && <FaGithub />}
          className={`github-login-button ${githubLoading ? "loading" : ""}`}
          onClick={this.handleGitHubLogin}
        >
          <span className="btn-text">Sign in with GitHub</span>
          <div className="loader"></div>
        </Button>
      </div>
    );
  };

  render() {
    return (
      <GoogleOAuthProvider clientId={clientId}>
        <Container maxWidth="sm" className="login-container">
          <Box className="login-box">
            <Typography variant="h4" gutterBottom className="login-title">
              <span className="green-text">Employee</span>{" "}
              <span className="black-text">Payroll</span>
            </Typography>
            <Typography variant="subtitle1" className="login-subtitle">
              Sign in to manage your payroll
            </Typography>

            {this.renderAuthSection()}
          </Box>
          <Footer />
        </Container>
      </GoogleOAuthProvider>
    );
  }
}

export default Login;
