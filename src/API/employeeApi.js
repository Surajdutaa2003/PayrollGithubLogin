import axios from "axios";

const BASE_URL = "http://localhost:3000/employees";

export const getEmployees = async () => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data.reverse(); 
  } catch (error) {
    throw new Error("Failed to fetch employees");
  }
};

export const getEmployeeById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch employee data");
  }
};

export const createEmployee = async (employeeData) => {
  try {
    const response = await axios.post(BASE_URL, employeeData);
    return response.data;
  } catch (error) {
    throw new Error("Failed to create employee");
  }
};

export const updateEmployee = async (id, employeeData) => {
  try {
    const response = await axios.patch(`${BASE_URL}/${id}`, employeeData);
    return response.data;
  } catch (error) {
    throw new Error("Failed to update employee");
  }
};

export const deleteEmployee = async (id) => {
  try {
    await axios.delete(`${BASE_URL}/${id}`);
    return "Employee deleted successfully!";
  } catch (error) {
    throw new Error("Error deleting employee");
  }
};