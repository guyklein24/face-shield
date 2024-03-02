import React, { useState, useEffect } from 'react';
import SubjectForm from '../components/SubjectForm';
import ConfirmationDialog from '../components/ConfirmationDialog';
import config from '../config';

const Watchlist = () => {
  const [subjects, setSubjects] = useState([]);
  const [showSubjectForm, setShowForm] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState(null);

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
      // Add the subject
      console.log('New subject:', newSubject);
      const createdSubject = await window.api.addSubject(newSubject);
      console.log(createdSubject)
      // Update the subjects state with the new subject
      setSubjects([...subjects, createdSubject]);
      setShowForm(false); // Hide the subject form
      
    } catch (error) {
      console.error('Error adding subject:', error);
    }
  };

  const handleEditSubject = (subjectId) => {
    // Send IPC command to edit subject with subjectId
    window.api.editSubject(subjectId);
  };

  const handleDeleteSubject = (subject) => {
    // Send IPC command to delete subject with subjectId
    setSubjectToDelete(subject)
  };

  const handleConfirmDelete = async () => {
    try {
      await window.api.deleteSubject(subjectToDelete);
      // Filter out the deleted subject from the subjects array
      const updatedSubjects = subjects.filter(subject => subject.id !== subjectToDelete.id);
      setSubjects(updatedSubjects);
      setSubjectToDelete(null);
    } catch (error) {
      console.error('Error deleting subject:', error);
    }
  };

  return (
    <div>
      <h1>Watchlist Page</h1>
      <button onClick={() => setShowForm(true)}>Add New Subject</button>
      {showSubjectForm && <SubjectForm onAddSubject={handleAddSubject} />}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((subject) => (
            <tr key={subject.id}>
              <td>{subject.id}</td>
              <td>{subject.name}</td>
              <td>{subject.description}</td>
              <td>
                <button onClick={() => handleEditSubject(subject.id)}>Edit</button>
                <button onClick={() => handleDeleteSubject(subject)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {subjectToDelete && (
        <ConfirmationDialog
          message={`Are you sure you want to delete the subject "${subjectToDelete.name}"?`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setSubjectToDelete(null)}
        />
      )}
    </div>
  );
};

export default Watchlist;
