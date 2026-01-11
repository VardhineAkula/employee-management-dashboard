import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  employees: [
    {
      id: 1,
      name: 'John Doe',
      gender: 'Male',
      dateOfBirth: '1990-05-15',
      email: 'john.doe@company.com',
      position: 'Software Engineer',
      department: 'Engineering',
      state: 'California',
      salary: 85000,
      joinDate: '2023-01-15',
      status: 'active',
      profileImage: null,
    },
    {
      id: 2,
      name: 'Jane Smith',
      gender: 'Female',
      dateOfBirth: '1988-08-20',
      email: 'jane.smith@company.com',
      position: 'Product Manager',
      department: 'Product',
      state: 'New York',
      salary: 95000,
      joinDate: '2022-06-20',
      status: 'active',
      profileImage: null,
    },
    {
      id: 3,
      name: 'Bob Johnson',
      gender: 'Male',
      dateOfBirth: '1992-03-10',
      email: 'bob.johnson@company.com',
      position: 'Designer',
      department: 'Design',
      state: 'Texas',
      salary: 75000,
      joinDate: '2023-03-10',
      status: 'active',
      profileImage: null,
    },
  ],
  loading: false,
  error: null,
};

const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    addEmployee: (state, action) => {
      const maxId = state.employees.length > 0 
        ? Math.max(...state.employees.map(emp => emp.id)) 
        : 0;
      state.employees.unshift({
        ...action.payload,
        id: maxId + 1,
      });
    },
    updateEmployee: (state, action) => {
      const index = state.employees.findIndex(emp => emp.id === action.payload.id);
      if (index !== -1) {
        state.employees[index] = action.payload;
      }
    },
    toggleEmployeeStatus: (state, action) => {
      const employee = state.employees.find(emp => emp.id === action.payload);
      if (employee) {
        employee.status = employee.status === 'active' ? 'inactive' : 'active';
      }
    },
    deleteEmployee: (state, action) => {
      state.employees = state.employees.filter(emp => emp.id !== action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { addEmployee, updateEmployee, deleteEmployee, toggleEmployeeStatus, setLoading, setError } = employeeSlice.actions;
export default employeeSlice.reducer;
