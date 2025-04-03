import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import styles from "../styles/EmployeeForm.module.scss";
import boy1 from "../assets/boy1.jpeg";
import boy2 from "../assets/boy2.jpeg";
import girl1 from "../assets/girl1.jpeg";
import Header from "./Header";
import {
  getEmployeeById,
  createEmployee,
  updateEmployee,
} from "../API/employeeApi";

class EmployeeForm extends Component {
  state = {
    id: null,
    name: "",
    profileImage: "",
    gender: "",
    department: [],
    salary: "",
    startDateDay: "",
    startDateMonth: "",
    startDateYear: "",
    startDate: "",
    notes: "",
    redirect: false,
    errors: {},
    loading: false,
  };

  componentDidMount() {
    this.fetchEmployeeData();
  }

  fetchEmployeeData = async () => {
    const editEmployeeId = localStorage.getItem("editEmployeeId");
    if (editEmployeeId) {
      this.setState({ loading: true });
      try {
        const employee = await getEmployeeById(editEmployeeId);
        const { startDate } = employee;
        let startDateDay = "",
          startDateMonth = "",
          startDateYear = "";

        if (startDate) {
          const date = new Date(startDate);
          startDateDay = date.getDate().toString();
          startDateMonth = (date.getMonth() + 1).toString();
          startDateYear = date.getFullYear().toString();
        }

        this.setState({
          ...employee,
          startDateDay,
          startDateMonth,
          startDateYear,
          loading: false,
        });
      } catch (error) {
        this.setState({ loading: false, errors: { fetch: error.message } });
      }
    }
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      [name]: value,
      errors: { ...prevState.errors, [name]: "" },
    }));
  };

  handleReset = () => {
    this.setState({
      id: null,
      name: "",
      profileImage: "",
      gender: "",
      department: [],
      salary: "",
      startDateDay: "",
      startDateMonth: "",
      startDateYear: "",
      startDate: "",
      notes: "",
      errors: {},
    });
  };

  handleCheckboxChange = (e) => {
    const { value, checked } = e.target;

    this.setState((prevState) => ({
      department: checked
        ? [...prevState.department, value]
        : prevState.department.filter((dep) => dep !== value),
      errors: { ...prevState.errors, department: "" },
    }));
  };

  validateForm = () => {
    const errors = {};
    const {
      name,
      profileImage,
      gender,
      department,
      salary,
      startDateDay,
      startDateMonth,
      startDateYear,
    } = this.state;

    if (!name.trim()) errors.name = "Employee name is required";
    if (!profileImage) errors.profileImage = "Please select a profile image";
    if (!gender) errors.gender = "Please select a gender";
    if (department.length === 0)
      errors.department = "Please select at least one department";
    if (!salary) errors.salary = "Please select a salary";
    if (!startDateDay) errors.startDateDay = "Please select a start day";
    if (!startDateMonth) errors.startDateMonth = "Please select a start month";
    if (!startDateYear) errors.startDateYear = "Please select a start year";

    this.setState({ errors });
    return Object.keys(errors).length === 0;
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    if (!this.validateForm()) {
      return;
    }

    this.setState({ loading: true });
    const {
      id,
      startDateDay,
      startDateMonth,
      startDateYear,
      startDate,
      errors,
      loading,
      redirect,
      ...employeeData
    } = this.state;
    const editEmployeeId = localStorage.getItem("editEmployeeId");

    if (startDateDay && startDateMonth && startDateYear) {
      const formattedDate = `${startDateYear}-${startDateMonth.padStart(
        2,
        "0"
      )}-${startDateDay.padStart(2, "0")}`;
      employeeData.startDate = formattedDate;
    }

    try {
      if (editEmployeeId) {
        await updateEmployee(editEmployeeId, employeeData);
        localStorage.removeItem("editEmployeeId");
      } else {
        await createEmployee(employeeData);
      }
      this.setState({ redirect: true, loading: false });
    } catch (error) {
      this.setState({
        errors: { submit: error.message },
        loading: false,
      });
    }
  };

  render() {
    if (this.state.redirect) {
      return <Navigate to="/employees" />;
    }

    const { errors, loading } = this.state;

    
    return (
      <div className={styles.container}>
        <Header />
        <div className={styles.formContainer}>
          <form onSubmit={this.handleSubmit}>
            <h1>Employee Payroll Form</h1>

            {errors.fetch && <div className={styles.error}>{errors.fetch}</div>}
            {errors.submit && (
              <div className={styles.error}>{errors.submit}</div>
            )}

            <div className={styles.formGroup}>
              <label htmlFor="name">Name</label>
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter employee name"
                  value={this.state.name || ""}
                  onChange={this.handleChange}
                  disabled={loading}
                />
                {errors.name && (
                  <span className={styles.error}>{errors.name}</span>
                )}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="profileImage" className={styles.pf}>
                Profile Image
              </label>
              <div className={styles.inputWrapper}>
                <div className={styles.profileImages}>
                  {[
                    { src: boy1, name: "boy1.jpeg" },
                    { src: boy2, name: "boy2.jpeg" },
                    { src: girl1, name: "girl1.jpeg" },
                  ].map((img) => (
                    <label key={img.name} className={styles.profileImageLabel}>
                      <input
                        type="radio"
                        name="profileImage"
                        id="profileImage"
                        value={img.name}
                        checked={this.state.profileImage === img.name}
                        onChange={this.handleChange}
                        data-testid="profile-image-option"
                        disabled={loading}
                      />
                      <img src={img.src} alt={`Profile ${img.name}`} />
                    </label>
                  ))}
                </div>
                {errors.profileImage && (
                  <span className={styles.error}>{errors.profileImage}</span>
                )}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="gender">Gender</label>
              <div className={styles.inputWrapper}>
                <div className={styles.radioGroup}>
                  <label>
                    <input
                      type="radio"
                      id="gender"
                      name="gender"
                      value="Male"
                      checked={this.state.gender === "Male"}
                      onChange={this.handleChange}
                      disabled={loading}
                    />
                    Male
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      checked={this.state.gender === "Female"}
                      onChange={this.handleChange}
                      disabled={loading}
                    />
                    Female
                  </label>
                </div>
                {errors.gender && (
                  <span className={styles.error}>{errors.gender}</span>
                )}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="department">Department</label>
              <div className={styles.inputWrapper}>
                <div className={styles.checkboxGroup}>
                  {["HR", "Sales", "Finance", "Engineer", "Others"].map(
                    (dept) => (
                      <label key={dept}>
                        <input
                          type="checkbox"
                          id="department"
                          value={dept}
                          checked={this.state.department.includes(dept)}
                          onChange={this.handleCheckboxChange}
                          disabled={loading}
                        />
                        {dept}
                      </label>
                    )
                  )}
                </div>
                {errors.department && (
                  <span className={styles.error}>{errors.department}</span>
                )}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="salary">Salary</label>
              <div className={styles.inputWrapper}>
                <select
                  id="salary"
                  name="salary"
                  value={this.state.salary}
                  onChange={this.handleChange}
                  disabled={loading}
                >
                  <option value="">Select Salary</option>
                  <option value="50000">50,000</option>
                  <option value="60000">60,000</option>
                </select>
                {errors.salary && (
                  <span className={styles.error}>{errors.salary}</span>
                )}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="startDate">Start Date</label>
              <div className={styles.inputWrapper}>
                <div className={styles.startDate}>
                  <select
                    name="startDateDay"
                    value={this.state.startDateDay}
                    onChange={this.handleChange}
                    disabled={loading}
                    id="startDate"
                  >
                    <option value="">Day</option>
                    {[...Array(31)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                  <select
                    name="startDateMonth"
                    value={this.state.startDateMonth}
                    onChange={this.handleChange}
                    disabled={loading}
                  >
                    <option value="">Month</option>
                    {[
                      "Jan",
                      "Feb",
                      "Mar",
                      "Apr",
                      "May",
                      "Jun",
                      "Jul",
                      "Aug",
                      "Sep",
                      "Oct",
                      "Nov",
                      "Dec",
                    ].map((month, i) => (
                      <option key={i + 1} value={i + 1}>
                        {month}
                      </option>
                    ))}
                  </select>
                  <select
                    name="startDateYear"
                    value={this.state.startDateYear}
                    onChange={this.handleChange}
                    disabled={loading}
                  >
                    <option value="">Year</option>
                    {[...Array(50)].map((_, i) => {
                      const year = 2025 - i;
                      return (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      );
                    })}
                  </select>
                </div>
                {(errors.startDateDay ||
                  errors.startDateMonth ||
                  errors.startDateYear) && (
                  <span className={styles.error}>
                    {errors.startDateDay ||
                      errors.startDateMonth ||
                      errors.startDateYear}
                  </span>
                )}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="notes">Notes</label>
              <div className={styles.inputWrapper}>
                <textarea
                  name="notes"
                  id="notes"
                  value={this.state.notes || ""}
                  onChange={this.handleChange}
                  placeholder="Enter notes"
                  disabled={loading}
                />
              </div>
            </div>

            <div className={styles.buttonContainer}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={() => this.setState({ redirect: true })}
                disabled={loading}
              >
                Cancel
              </button>
              <div className={styles.rightButtons}>
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={loading}
                >
                  {loading
                    ? "Processing..."
                    : this.state.id
                    ? "Update"
                    : "Submit"}
                </button>
                <button
                  type="button"
                  className={styles.resetButton}
                  onClick={this.handleReset}
                  disabled={loading}
                >
                  Reset
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default EmployeeForm;
