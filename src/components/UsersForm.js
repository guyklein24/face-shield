import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Checkbox, FormControlLabel, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const UserForm = ({ onAddUser }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    subscribeAlerts: false
  });
  const [errors, setErrors] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    confirmPassword: false
  });
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    // Check password match whenever password or confirmPassword changes
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
    } else {
      setPasswordError('');
    }
  }, [formData.password, formData.confirmPassword]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Update errors state
    setErrors(prevState => ({
      ...prevState,
      [name]: false
    }));
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const { firstName, lastName, email, password, confirmPassword } = formData;

    const formErrors = {
      firstName: !firstName.trim(),
      lastName: !lastName.trim(),
      email: !email.trim(),
      password: !password.trim(),
      confirmPassword: password !== confirmPassword || !confirmPassword.trim()
    };

    setErrors(formErrors);

    if (Object.values(formErrors).some(error => error)) {
      return;
    }

    onAddUser(formData);
    setOpen(false);
  };

  return (
    <>
      <Button startIcon={<AddIcon />} variant="outlined" onClick={handleOpen}>Add User</Button>
      <Dialog open={open} onClose={handleClose} color="secondary">
        <DialogTitle color="secondary">Add New User</DialogTitle>
        <DialogContent>
          <TextField
            color="secondary"
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            margin="dense"
            variant="standard"
            fullWidth
            required
            error={errors.firstName}
            helperText={errors.firstName ? 'First Name is required' : ''}
          />
          <TextField
            color="secondary"
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            margin="dense"
            variant="standard"
            fullWidth
            required
            error={errors.lastName}
            helperText={errors.lastName ? 'Last Name is required' : ''}
          />
          <TextField
            color="secondary"
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            margin="dense"
            variant="standard"
            fullWidth
            required
            error={errors.email}
            helperText={errors.email ? 'Email is required' : ''}
          />
          <TextField
            color="secondary"
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            margin="dense"
            variant="standard"
            fullWidth
            required
            error={errors.password}
            helperText={errors.password ? 'Password is required' : ''}
          />
          <TextField
            color="secondary"
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            margin="dense"
            variant="standard"
            fullWidth
            required
            error={errors.confirmPassword || passwordError !== ''}
            helperText={errors.confirmPassword ? 'Confirm Password is required' : passwordError}
          />
          <FormControlLabel
            control={<Checkbox
              color="secondary"
              name="subscribeAlerts"
              checked={formData.subscribeAlerts}
              onChange={handleChange}
            />}
            label="Subscribe Alerts"
          />
          <Typography variant="body2" color="textSecondary">
            If checked, the user will receive email notifications whenever a subject is recognized.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="secondary">Add User</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserForm;
