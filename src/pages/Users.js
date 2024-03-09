import React, { useState, useEffect } from 'react';
import UserForm from '../components/UsersForm';
import ConfirmationDialog from '../components/ConfirmationDialog';
import config from '../config';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import DeleteSharpIcon from '@mui/icons-material/DeleteSharp';
import DoneIcon from '@mui/icons-material/Done';
import AlertSnackbar from '../components/AlertSnackbar';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${config.apiUrl}/users`);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleAddUser = async (userData) => {
    try {
      const response = await fetch(`${config.apiUrl}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      const newUser = await response.json();
      setUsers([...users, newUser]);
      setShowForm(false);

      setAlertMessage("User added successfully");
      setAlertOpen(true);

    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await fetch(`${config.apiUrl}/users/${userId}`, {
        method: 'DELETE',
      });
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await handleDeleteUser(userToDelete.id);
      const updatedUsers = users.filter(user => user.id !== userToDelete.id);
      setUsers(updatedUsers);
      setUserToDelete(null);

      setAlertMessage("User deleted successfully");
      setAlertOpen(true);

    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div>
      <UserForm onAddUser={handleAddUser}></UserForm>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{ width: '20%'}} sx={{fontWeight: 'bold'}}>First Name</TableCell>
            <TableCell style={{ width: '20%'}} sx={{fontWeight: 'bold'}}>Last Name</TableCell>
            <TableCell style={{ width: '20%'}} sx={{fontWeight: 'bold'}}>Email</TableCell>
            <TableCell style={{ width: '20%'}} sx={{fontWeight: 'bold'}}>Subscribe Alerts</TableCell>
            <TableCell style={{ width: '20%'}} sx={{fontWeight: 'bold'}}>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.firstName}</TableCell>
              <TableCell>{user.lastName}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.subscribeAlerts ? <DoneIcon  color='success' /> : '' }</TableCell>
              <TableCell>
                <Button startIcon={<DeleteSharpIcon />} variant="outlined" color='secondary' onClick={() => setUserToDelete(user)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertSnackbar
        open={alertOpen}
        title="Success"
        onClose={() => setAlertOpen(false)}
        severity="success"
        message={alertMessage}
      />

      {userToDelete && (
        <ConfirmationDialog
          title="Delete User"
          message={`Are you sure you want to delete user "${userToDelete.firstName}"?`}
          onConfirm={handleConfirmDelete}
          open={true}
          onCancel={() => setUserToDelete(null)}
        />
      )}
    </div>
  );
};

export default Users;
