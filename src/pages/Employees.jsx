import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Stack,
  Avatar,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
  Snackbar,
  Alert,
  Switch,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PrintIcon from '@mui/icons-material/Print';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import PeopleIcon from '@mui/icons-material/People';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { deleteEmployee, addEmployee, updateEmployee, toggleEmployeeStatus } from '../redux/slices/employeeSlice';

const Employees = () => {
  const employees = useSelector((state) => state.employees.employees);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGender, setFilterGender] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isPreview, setIsPreview] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    dateOfBirth: '',
    email: '',
    position: '',
    department: '',
    state: '',
    salary: '',
    joinDate: '',
    status: 'active',
    profileImage: null,
  });

  const departments = ['Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'HR'];
  const statuses = ['active', 'inactive'];
  const genders = ['Male', 'Female', 'Other'];
  const states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
    'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
    'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
    'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
    'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
    'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
    'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
    'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
    'West Virginia', 'Wisconsin', 'Wyoming'
  ];

  const handleOpenAddModal = () => {
    setModalMode('add');
    setFormData({
      name: '',
      gender: '',
      dateOfBirth: '',
      email: '',
      position: '',
      department: '',
      state: '',
      salary: '',
      joinDate: '',
      status: 'active',
      profileImage: null,
    });
    setImagePreview(null);
    setErrors({});
    setIsPreview(false);
    setOpenModal(true);
  };

  const handleOpenEditModal = (employee) => {
    setModalMode('edit');
    setSelectedEmployee(employee);
    setFormData(employee);
    setImagePreview(employee.profileImage);
    setErrors({});
    setIsPreview(false);
    setOpenModal(true);
  };

  const handleOpenViewModal = (employee) => {
    setModalMode('view');
    setSelectedEmployee(employee);
    setFormData(employee);
    setImagePreview(employee.profileImage);
    setErrors({});
    setIsPreview(false);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedEmployee(null);
    setImagePreview(null);
    setErrors({});
    setIsPreview(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors({
          ...errors,
          profileImage: 'Please select a valid image file',
        });
        return;
      }
      
      if (file.size > 2 * 1024 * 1024) {
        setErrors({
          ...errors,
          profileImage: 'Image size should be less than 2MB',
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({
          ...formData,
          profileImage: reader.result,
        });
        setErrors({
          ...errors,
          profileImage: '',
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else {
      const age = new Date().getFullYear() - new Date(formData.dateOfBirth).getFullYear();
      if (age < 18) {
        newErrors.dateOfBirth = 'Employee must be at least 18 years old';
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.position.trim()) {
      newErrors.position = 'Position is required';
    }

    if (!formData.department) {
      newErrors.department = 'Department is required';
    }

    if (!formData.state) {
      newErrors.state = 'State is required';
    }

    if (!formData.salary) {
      newErrors.salary = 'Salary is required';
    } else if (formData.salary <= 0) {
      newErrors.salary = 'Salary must be greater than 0';
    }

    if (!formData.joinDate) {
      newErrors.joinDate = 'Join date is required';
    }

    if (!formData.status) {
      newErrors.status = 'Status is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkDuplicateEmployee = () => {
    // Only check email as primary unique identifier
    const duplicate = employees.find(emp => 
      emp.email.toLowerCase().trim() === formData.email.toLowerCase().trim()
    );
    return duplicate;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (modalMode === 'add') {
      setIsPreview(true);
    } else if (modalMode === 'edit') {
      dispatch(updateEmployee({
        ...formData,
        salary: parseFloat(formData.salary),
      }));
      setSnackbar({ open: true, message: 'Employee updated successfully!', severity: 'success' });
      handleCloseModal();
    }
  };

  const handleConfirmSubmit = () => {
    // Check for duplicate email before final submission
    const duplicate = employees.find(emp => 
      emp.email.toLowerCase().trim() === formData.email.toLowerCase().trim()
    );
    
    if (duplicate) {
      setSnackbar({ 
        open: true, 
        message: 'Employee already exists! Please change the details or recheck.', 
        severity: 'error' 
      });
      setIsPreview(false);
      return;
    }
    
    dispatch(addEmployee({
      ...formData,
      salary: parseFloat(formData.salary),
    }));
    setSnackbar({ open: true, message: 'Employee added successfully!', severity: 'success' });
    handleCloseModal();
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleBackToEdit = () => {
    setIsPreview(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      dispatch(deleteEmployee(id));
    }
  };

  const handleToggleStatus = (id) => {
    dispatch(toggleEmployeeStatus(id));
  };

  const handlePrint = (employee) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Employee - ${employee.name}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #1976d2; }
            .info { margin: 10px 0; }
            .label { font-weight: bold; }
            img { max-width: 150px; border-radius: 50%; }
          </style>
        </head>
        <body>
          <h1>Employee Details</h1>
          ${employee.profileImage ? `<img src="${employee.profileImage}" alt="${employee.name}" />` : ''}
          <div class="info"><span class="label">ID:</span> ${employee.id}</div>
          <div class="info"><span class="label">Name:</span> ${employee.name}</div>
          <div class="info"><span class="label">Email:</span> ${employee.email}</div>
          <div class="info"><span class="label">Gender:</span> ${employee.gender}</div>
          <div class="info"><span class="label">Date of Birth:</span> ${employee.dateOfBirth}</div>
          <div class="info"><span class="label">Position:</span> ${employee.position}</div>
          <div class="info"><span class="label">Department:</span> ${employee.department}</div>
          <div class="info"><span class="label">State:</span> ${employee.state}</div>
          <div class="info"><span class="label">Salary:</span> $${employee.salary}</div>
          <div class="info"><span class="label">Join Date:</span> ${employee.joinDate}</div>
          <div class="info"><span class="label">Status:</span> ${employee.status}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handlePrintAll = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Print All Employees</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #1976d2; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #1976d2; color: white; }
            tr:nth-child(even) { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>Employee List</h1>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Gender</th>
                <th>DOB</th>
                <th>Position</th>
                <th>Department</th>
                <th>State</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${filteredEmployees.map(emp => `
                <tr>
                  <td>${emp.id}</td>
                  <td>${emp.name}</td>
                  <td>${emp.email}</td>
                  <td>${emp.gender}</td>
                  <td>${emp.dateOfBirth}</td>
                  <td>${emp.position}</td>
                  <td>${emp.department}</td>
                  <td>${emp.state}</td>
                  <td>${emp.status}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch = 
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGender = filterGender === '' || employee.gender === filterGender;
    const matchesStatus = filterStatus === '' || employee.status === filterStatus;
    
    return matchesSearch && matchesGender && matchesStatus;
  });

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(emp => emp.status === 'active').length;
  const inactiveEmployees = totalEmployees - activeEmployees;

  const stats = [
    {
      title: 'Total Employees',
      value: totalEmployees,
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      color: '#1976d2',
    },
    {
      title: 'Active Employees',
      value: activeEmployees,
      icon: <CheckCircleIcon sx={{ fontSize: 40 }} />,
      color: '#2e7d32',
    },
    {
      title: 'Inactive Employees',
      value: inactiveEmployees,
      icon: <CancelIcon sx={{ fontSize: 40 }} />,
      color: '#d32f2f',
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3, mb: 4 }}>
        {stats.map((stat, index) => (
          <Card elevation={3} key={index}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    {stat.title}
                  </Typography>
                  <Typography variant="h4">
                    {stat.value}
                  </Typography>
                </Box>
                <Box sx={{ color: stat.color }}>
                  {stat.icon}
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Employees
        </Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            onClick={handlePrintAll}
          >
            Print List
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAddModal}
          >
            Add Employee
          </Button>
        </Box>
      </Box>

      <Box mb={3}>
        <Box display="flex" gap={2} mb={2}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by name, email, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        
        <Box display="flex" gap={2} alignItems="center">
          <TextField
            select
            label="Filter by Gender"
            value={filterGender}
            onChange={(e) => setFilterGender(e.target.value)}
            sx={{ minWidth: 200 }}
            size="small"
          >
            <MenuItem value="">All Genders</MenuItem>
            {genders.map((gender) => (
              <MenuItem key={gender} value={gender}>
                {gender}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Filter by Status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            sx={{ minWidth: 200 }}
            size="small"
          >
            <MenuItem value="">All Status</MenuItem>
            {statuses.map((status) => (
              <MenuItem key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </MenuItem>
            ))}
          </TextField>

          {(filterGender || filterStatus || searchTerm) && (
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                setSearchTerm('');
                setFilterGender('');
                setFilterStatus('');
              }}
            >
              Clear Filters
            </Button>
          )}
        </Box>
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Profile</strong></TableCell>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Gender</strong></TableCell>
              <TableCell><strong>DOB</strong></TableCell>
              <TableCell><strong>Position</strong></TableCell>
              <TableCell><strong>Department</strong></TableCell>
              <TableCell><strong>State</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell align="center"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEmployees.map((employee) => (
              <TableRow key={employee.id} hover>
                <TableCell>{employee.id}</TableCell>
                <TableCell>
                  <Avatar src={employee.profileImage} alt={employee.name} />
                </TableCell>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.gender}</TableCell>
                <TableCell>{employee.dateOfBirth}</TableCell>
                <TableCell>{employee.position}</TableCell>
                <TableCell>{employee.department}</TableCell>
                <TableCell>{employee.state}</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      {employee.status === 'active' ? 'Active' : 'Inactive'}
                    </Typography>
                    <Switch
                      checked={employee.status === 'active'}
                      onChange={() => handleToggleStatus(employee.id)}
                      color="success"
                      size="small"
                    />
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => handleOpenViewModal(employee)}
                    title="View"
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => handleOpenEditModal(employee)}
                    title="Edit"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="secondary"
                    onClick={() => handlePrint(employee)}
                    title="Print"
                  >
                    <PrintIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(employee.id)}
                    title="Delete"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog 
        open={openModal} 
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            handleCloseModal();
          }
        }}
        maxWidth="sm"
        fullWidth
        disableEscapeKeyDown
        sx={{ zIndex: 1400 }}
      >
        <DialogTitle>
          {isPreview ? 'Preview Employee Information' :
           modalMode === 'add' ? 'Add New Employee' : 
           modalMode === 'edit' ? 'Edit Employee' : 'Employee Details'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ pt: 3 }}>
            {isPreview ? (
              <Stack spacing={2}>
                <Box sx={{ textAlign: 'center' }}>
                  <Avatar
                    src={imagePreview}
                    sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
                  />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Full Name</Typography>
                  <Typography variant="body1" fontWeight="bold">{formData.name}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Gender</Typography>
                  <Typography variant="body1">{formData.gender}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Date of Birth</Typography>
                  <Typography variant="body1">{formData.dateOfBirth}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Email</Typography>
                  <Typography variant="body1">{formData.email}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Position</Typography>
                  <Typography variant="body1">{formData.position}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Department</Typography>
                  <Typography variant="body1">{formData.department}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">State</Typography>
                  <Typography variant="body1">{formData.state}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Salary</Typography>
                  <Typography variant="body1">${formData.salary}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Join Date</Typography>
                  <Typography variant="body1">{formData.joinDate}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Status</Typography>
                  <Chip 
                    label={formData.status.charAt(0).toUpperCase() + formData.status.slice(1)} 
                    color={formData.status === 'active' ? 'success' : 'default'}
                    size="small"
                  />
                </Box>
              </Stack>
            ) : (
            <Stack spacing={2.5}>
              <Box sx={{ textAlign: 'center' }}>
                <Avatar
                  src={imagePreview}
                  sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}
                />
                {modalMode !== 'view' && (
                  <>
                    <Button
                      component="label"
                      variant="outlined"
                      startIcon={<CloudUploadIcon />}
                    >
                      Upload Profile Image
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </Button>
                    {errors.profileImage && (
                      <FormHelperText error sx={{ textAlign: 'center', mt: 1 }}>
                        {errors.profileImage}
                      </FormHelperText>
                    )}
                  </>
                )}
              </Box>

              <TextField
                fullWidth
                required
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={modalMode === 'view'}
                error={!!errors.name}
                helperText={errors.name}
              />

              <FormControl error={!!errors.gender} disabled={modalMode === 'view'}>
                <FormLabel>Gender *</FormLabel>
                <RadioGroup
                  row
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  {genders.map((gender) => (
                    <FormControlLabel
                      key={gender}
                      value={gender}
                      control={<Radio />}
                      label={gender}
                    />
                  ))}
                </RadioGroup>
                {errors.gender && <FormHelperText>{errors.gender}</FormHelperText>}
              </FormControl>

              <TextField
                fullWidth
                required
                type="date"
                label="Date of Birth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                disabled={modalMode === 'view'}
                error={!!errors.dateOfBirth}
                helperText={errors.dateOfBirth}
                InputLabelProps={{
                  shrink: true,
                }}
              />

              <TextField
                fullWidth
                required
                type="email"
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={modalMode === 'view'}
                error={!!errors.email}
                helperText={errors.email}
              />

              <TextField
                fullWidth
                required
                label="Position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                disabled={modalMode === 'view'}
                error={!!errors.position}
                helperText={errors.position}
              />

              <TextField
                fullWidth
                required
                select
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                disabled={modalMode === 'view'}
                error={!!errors.department}
                helperText={errors.department}
                SelectProps={{
                  MenuProps: {
                    style: { zIndex: 1500 }
                  }
                }}
              >
                {departments.map((dept) => (
                  <MenuItem key={dept} value={dept}>
                    {dept}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                required
                select
                label="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
                disabled={modalMode === 'view'}
                error={!!errors.state}
                helperText={errors.state}
                SelectProps={{
                  MenuProps: {
                    style: { zIndex: 1500 }
                  }
                }}
              >
                {states.map((state) => (
                  <MenuItem key={state} value={state}>
                    {state}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                required
                type="number"
                label="Salary"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                disabled={modalMode === 'view'}
                error={!!errors.salary}
                helperText={errors.salary}
              />

              <TextField
                fullWidth
                required
                type="date"
                label="Join Date"
                name="joinDate"
                value={formData.joinDate}
                onChange={handleChange}
                disabled={modalMode === 'view'}
                error={!!errors.joinDate}
                helperText={errors.joinDate}
                InputLabelProps={{
                  shrink: true,
                }}
              />

              <FormControl error={!!errors.status} disabled={modalMode === 'view'}>
                <FormLabel>Status *</FormLabel>
                <RadioGroup
                  row
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  {statuses.map((status) => (
                    <FormControlLabel
                      key={status}
                      value={status}
                      control={<Radio />}
                      label={status.charAt(0).toUpperCase() + status.slice(1)}
                    />
                  ))}
                </RadioGroup>
                {errors.status && <FormHelperText>{errors.status}</FormHelperText>}
              </FormControl>
            </Stack>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            {isPreview ? (
              <>
                <Button
                  onClick={handleBackToEdit}
                  startIcon={<EditIcon />}
                  color="inherit"
                >
                  Back to Edit
                </Button>
                <Button
                  onClick={handleConfirmSubmit}
                  variant="contained"
                  startIcon={<SaveIcon />}
                  color="primary"
                >
                  Confirm & Submit
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={handleCloseModal}
                  startIcon={<CloseIcon />}
                  color="inherit"
                >
                  {modalMode === 'view' ? 'Close' : 'Cancel'}
                </Button>
                {modalMode !== 'view' && (
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SaveIcon />}
                  >
                    {modalMode === 'add' ? 'Preview' : 'Update Employee'}
                  </Button>
                )}
              </>
            )}
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={5000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ mt: 10, zIndex: 2000 }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          variant="filled"
          elevation={6}
          sx={{ 
            width: '100%', 
            fontSize: '0.95rem',
            fontWeight: 500
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Employees;
