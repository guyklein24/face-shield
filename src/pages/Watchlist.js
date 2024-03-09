import React, { useState, useEffect } from 'react';
import SubjectForm from '../components/SubjectForm';
import ConfirmationDialog from '../components/ConfirmationDialog';
import config from '../config';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import DeleteSharpIcon from '@mui/icons-material/DeleteSharp';
import AlertSnackbar from '../components/AlertSnackbar';



const Watchlist = () => {
  const [subjects, setSubjects] = useState([]);
  const [showSubjectForm, setShowForm] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await fetch(`${config.apiUrl}/subjects`);
      if (!response.ok) {
        throw new Error('Failed to fetch subjects');
      }
      const data = await response.json();
      setSubjects(data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const handleAddSubject = async (newSubject) => {
    try {
      const createdSubject = await window.api.addSubject(newSubject);
      setSubjects([...subjects, createdSubject]);
      setShowForm(false);

      
      setAlertMessage("Subeject was added successfully to watchlist");
      setAlertOpen(true);

    } catch (error) {
      console.error('Error adding subject:', error);
    }
  };

  const handleDeleteSubject = (subject) => {
    setSubjectToDelete(subject);
  };

  const handleConfirmDelete = async () => {
    try {
      await window.api.deleteSubject(subjectToDelete);
      const updatedSubjects = subjects.filter(subject => subject.id !== subjectToDelete.id);
      setSubjects(updatedSubjects);
      setSubjectToDelete(null);

      setAlertMessage("Subeject was successfully deleted");
      setAlertOpen(true);

    } catch (error) {
      console.error('Error deleting subject:', error);
    }
  };

  return (
    <div>
      <SubjectForm onAddSubject={handleAddSubject} />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{width: '10%'}} sx={{fontWeight: 'bold'}}>Name</TableCell>
            <TableCell style={{width: '20%'}} sx={{fontWeight: 'bold'}}>Description</TableCell>
            <TableCell style={{width: '20%'}} sx={{fontWeight: 'bold'}}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {subjects.map((subject) => (
            <TableRow key={subject.id}>
              <TableCell>{subject.name}</TableCell>
              <TableCell>{subject.description}</TableCell>
              <TableCell>
                <Button startIcon={<DeleteSharpIcon />} variant="outlined" color='secondary' onClick={() => handleDeleteSubject(subject)}>Delete</Button>
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

      {subjectToDelete && (
        <ConfirmationDialog
          title="Delete Subject"
          open={true}
          message={`Are you sure you want to delete the subject "${subjectToDelete.name}"?`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setSubjectToDelete(null)}
        />
      )}
    </div>
  );
};

export default Watchlist;
