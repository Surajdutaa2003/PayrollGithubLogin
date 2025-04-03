import React, { Component } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/EmployeeList.module.scss";
import { MdSearch, MdDelete, MdEdit, MdAdd } from "react-icons/md";
import Header from "./Header";
import { getEmployees, deleteEmployee } from '../API/employeeApi'; 

class EmployeeList extends Component {
  state = {
    employees: [],
    searchQuery: "",
    error: null 
  };

  componentDidMount() {
    this.fetchEmployees();
   
  }

  fetchEmployees = async () => {
    try {
      const employees = await getEmployees();
      this.setState({ employees, error: null });
    } catch (error) {
      this.setState({ error: error.message });
    }
  };

  handleEdit = (id) => {
    localStorage.setItem("editEmployeeId", id);
  };

  handleDelete = async (id) => {
    try {
      await deleteEmployee(id); 
      this.fetchEmployees(); 
    } catch (error) {
      this.setState({ error: error.message });
    }
  };

  handleSearch = (e) => {
    this.setState({ searchQuery: e.target.value });
  };

  formatDate = (dateString) => {
    if (!dateString) return "N/A"; 
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date"; 
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }); 
  };

  highlightText = (text, query) => {
    if (!query || !text) return text; 

    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();

    if (!lowerText.includes(lowerQuery)) return text;

    const startIndex = lowerText.indexOf(lowerQuery);
    const endIndex = startIndex + query.length;

    const before = text.substring(0, startIndex);
    const match = text.substring(startIndex, endIndex);
    const after = text.substring(endIndex);

    return (
      <>
        {before}
        <span className={styles.highlight}>{match}</span>
        {after}
      </>
    );
  };

  render() {
    const { employees, searchQuery, error } = this.state;

    const filteredEmployees = employees.filter((employee) => {
      const query = searchQuery.toLowerCase();

      const matchesName = employee.name.toLowerCase().includes(query);
      const matchesGender = employee.gender.toLowerCase().includes(query);
      const matchesDepartment = Array.isArray(employee.department)
        ? employee.department.some((dept) => dept.toLowerCase().includes(query))
        : employee.department?.toLowerCase().includes(query) || false;
      const matchesSalary = employee.salary.toString().includes(query);

      const formattedDate = this.formatDate(employee.startDate).toLowerCase();
      const matchesFormattedDate = formattedDate.includes(query);

      const rawDate = employee.startDate?.toLowerCase() || "";
      const matchesRawDate = rawDate.includes(query);

      return (
        matchesName ||
        matchesGender ||
        matchesDepartment ||
        matchesSalary ||
        matchesFormattedDate ||
        matchesRawDate
      );
    });

    return (
      <div className={styles.employeeListContainer}>
        <Header />

        <header className={styles.header}>
          <div className={styles.details}>
            <h2>Employee Details</h2>
          </div>
          
          <div className={styles.headerActions}>
            <div className={styles.searchContainer}>
              <input
                type="text"
                value={searchQuery}
                onChange={this.handleSearch}
                className={styles.searchInput}
              />
              <MdSearch className={styles.searchIcon} />
            </div>
            <Link to="/add-employee" className={styles.addButton}>
              <MdAdd className={styles.addIcon} /> Add User
            </Link>
          </div>
        </header>

        {error && <div className={styles.error}>{error}</div>}

        <table className={styles.employeeTable}>
          <thead>
            <tr>
              <th></th> 
              <th>Name</th>
              <th>Gender</th>
              <th>Department</th>
              <th>Salary</th>
              <th>Start Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((employee) => (
                <tr key={employee.id}>
                  <td>
                    <img
                      src={
                        employee.profileImage.startsWith("/")
                          ? employee.profileImage
                          : `/src/assets/${employee.profileImage}`
                      }
                      alt="Profile"
                      className={styles.profileImage}
                      onError={(e) => (e.target.src = "/src/assets/default.png")}
                    />
                  </td>
                  <td>{this.highlightText(employee.name, searchQuery)}</td>
                  <td>{this.highlightText(employee.gender, searchQuery)}</td>
                  <td>
                    {Array.isArray(employee.department) ? (
                      employee.department.map((dept, index) => (
                        <span key={dept} className={styles.departmentTag}>
                          {this.highlightText(dept, searchQuery)}
                        </span>
                      ))
                    ) : (
                      <span className={styles.departmentTag}>
                        {this.highlightText(
                          employee.department || "N/A",
                          searchQuery
                        )}
                      </span>
                    )}
                  </td>
                  <td>
                    ₹{" "}
                    {this.highlightText(employee.salary.toString(), searchQuery)}
                  </td>
                  <td>
                    {this.highlightText(
                      this.formatDate(employee.startDate),
                      searchQuery
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() => this.handleDelete(employee.id)}
                      className={styles.deleteButton}
                    >
                      <MdDelete />
                    </button>
                    <Link to="/add-employee">
                      <button
                        onClick={() => this.handleEdit(employee.id)}
                        className={styles.editButton}
                      >
                        <MdEdit />
                      </button>
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No employees found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }
}

export default EmployeeList;