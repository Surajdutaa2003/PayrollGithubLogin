import React, { Component } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import EmployeeList from "./component/EmployeeList";
import EmployeeForm from "./component/EmployeeForm";
import Login from "./component/Login";
import "./styles/global.scss";


const LoginWithNavigate = (props) => {
  const navigate = useNavigate();
  return <Login {...props} navigate={navigate} />;
};

class App extends Component {
  render() {
    return (
      <Router>
        <div className="container">
          <Routes>
           
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<LoginWithNavigate />} />
            <Route path="/employees" element={<EmployeeList />} />
            <Route path="/add-employee" element={<EmployeeForm />} />
          </Routes>
        </div>
      </Router>
    );
  }
}

export default App;
