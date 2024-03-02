import React, { useState } from 'react';

const UserForm = ({ onAddUser }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    subscribeAlerts: false
  });
  const [passwordError, setPasswordError] = useState('');

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddUser = (event) => {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    setPasswordError('');
    onAddUser(formData);
  };

  return (
    <form onSubmit={handleAddUser}>
      <div>
        <label>
          First Name:
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
        </label>
      </div>
      <div>
        <label>
          Last Name:
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
        </label>
      </div>
      <div>
        <label>
          Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </label>
      </div>
      <div>
        <label>
          Password:
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </label>
      </div>
      <div>
        <label>
          Confirm Password:
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
        </label>
      </div>
      {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
      <div>
        <label>
          <input type="checkbox" name="subscribeAlerts" checked={formData.subscribeAlerts} onChange={handleChange} />
          Subscribe Alerts
        </label>
      </div>
      <button type="submit">Add User</button>
    </form>
  );
};

export default UserForm;
