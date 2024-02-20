import React, { useState, useEffect } from 'react';
import UserForm from '../components/UsersForm';
import ConfirmationDialog from '../components/ConfirmationDialog';


const Users = () => {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3000/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleAddUser = async (userData) => {
    try {
      const response = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      const newUser = await response.json();
      setUsers([...users, newUser]);
      setShowForm(false);
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await fetch(`http://localhost:3000/users/${userId}`, {
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
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div>
      <h1>Users Page</h1>
      <button onClick={() => setShowForm(true)}>Add User</button>
      {showForm && <UserForm onSubmit={handleAddUser} />}
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Subscribe Alerts</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.subscribeAlerts ? 'Yes' : 'No'}</td>
              <td>
                <button onClick={() => setUserToDelete(user)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {userToDelete && (
        <ConfirmationDialog
          message={`Are you sure you want to delete user "${userToDelete.firstName}"?`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setUserToDelete(null)}
        />
      )}
    </div>
  );
};

export default Users;
