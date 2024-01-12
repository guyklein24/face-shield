// src/components/CameraForm.js
import React, { useState } from 'react';

const CameraForm = ({ onAddCamera }) => {
  const [newCameraName, setNewCameraName] = useState('');
  const [newCameraStatus, setNewCameraStatus] = useState('');

  const handleAddCamera = () => {
    const newCamera = {
      name: newCameraName,
      isEnabled: true, // Set default value or retrieve from a form input
      status: 'Active', // Set default value or retrieve from a form input
    };

    onAddCamera(newCamera);
    setNewCameraName('');
    setNewCameraStatus('');
  };

  return (
    <div>
      <h2>Create New Camera</h2>
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={newCameraName}
          onChange={(e) => setNewCameraName(e.target.value)}
        />
      </div>
      <div>
        <label>Status:</label>
        <input
          type="text"
          value={newCameraStatus}
          onChange={(e) => setNewCameraStatus(e.target.value)}
        />
      </div>
      <button onClick={handleAddCamera}>Add Camera</button>
    </div>
  );
};

export default CameraForm;
