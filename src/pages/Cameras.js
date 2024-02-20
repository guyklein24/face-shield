import React, { useState, useEffect } from 'react';
import CameraForm from '../components/CameraForm';
import ConfirmationDialog from '../components/ConfirmationDialog';

const Cameras = () => {
  const [cameras, setCameras] = useState([]);
  const [showCameraForm, setShowCameraForm] = useState(false);
  const [cameraToDelete, setCameraToDelete] = useState(null);

  useEffect(() => {
    fetchCameras();
    window.api.onCameraStopped((camera) => {
      updateCameraState(camera.id, false);
    });
  }, []);

  const updateCameraState = async (cameraId, isEnabled) => {
    try {
      // Make an API call to update camera state
      const response = await fetch(`http://localhost:3000/cameras/${cameraId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isEnabled: isEnabled }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update camera state');
      }
  
      // Optionally, handle the response if needed
      let updatedCamera = await response.json();

      setCameras(cameras => cameras.map(c => c.id === updatedCamera.id ? updatedCamera : c));
      return updatedCamera


    } catch (error) {
      console.error('Error updating camera state:', error);
    }
  };

  const fetchCameras = async () => {
    try {
      const response = await fetch('http://localhost:3000/cameras');
      const cameras = await response.json();
      setCameras(cameras);
    } catch (error) {
      console.error('Error fetching cameras:', error);
    }
  };

  const handleAddCamera = async (newCamera) => {
    try {
      const response = await fetch('http://localhost:3000/cameras', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCamera),
      });
      const createdCamera = await response.json();
      setCameras([...cameras, createdCamera]);
      setShowCameraForm(false);

      if (newCamera.isEnabled) {
        window.api.startCamera(createdCamera);
      }
    } catch (error) {
      console.error('Error adding camera:', error);
    }
  };

  const handleStartCamera = async (camera) => {
    try {
      const updatedCamera = await updateCameraState(camera.id, true)
      window.api.startCamera(updatedCamera);
      updateCameraState(camera.id, true)
    } catch (error) {
        console.error('Error starting camera:', error);
    }
  };

  const handleDeleteCamera = async (cameraId) => {
    try {
      const response = await fetch(`http://localhost:3000/cameras/${cameraId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete camera');
      }

      setCameras(cameras => cameras.filter(c => c.id !== cameraId));
    } catch (error) {
      console.error('Error deleting camera:', error);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await handleDeleteCamera(cameraToDelete.id);
      const updatedCameras = cameras.filter(camera => camera.id !== cameraToDelete.id);
      setCameras(updatedCameras);
      setCameraToDelete(null);
    } catch (error) {
      console.error('Error deleting camera:', error);
    }
  };

  return (
    <div>
      <h1>Camera Page</h1>
      <div>
        <button onClick={() => setShowCameraForm(true)}>Create Camera</button>
      </div>

      {showCameraForm && <CameraForm onAddCamera={handleAddCamera} />}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Is Enabled</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cameras.map((camera) => (
            <tr key={camera.id}>
              <td>{camera.id}</td>
              <td>{camera.name}</td>
              <td>{camera.isEnabled ? 'Yes' : 'No'}</td>
              <td>{camera.status}</td>
              <td>
                {!camera.isEnabled && (
                  <button onClick={() => handleStartCamera(camera)}>Start</button>
                )}
                {!camera.isEnabled && (
                  <button onClick={() => setCameraToDelete(camera)}>Delete</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {cameraToDelete && (
        <ConfirmationDialog
          message={`Are you sure you want to delete camera "${cameraToDelete.name}"?`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setCameraToDelete(null)}
        />
      )}
    </div>
  );
};

export default Cameras;
