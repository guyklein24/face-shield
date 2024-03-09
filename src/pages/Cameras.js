import React, { useState, useEffect } from 'react';
import CameraForm from '../components/CameraForm';
import ConfirmationDialog from '../components/ConfirmationDialog';
import CameraStatus from '../components/CameraStatus';
import config from '../config';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import DeleteSharpIcon from '@mui/icons-material/DeleteSharp';
import PlayArrowSharpIcon from '@mui/icons-material/PlayArrowSharp';
import StopSharpIcon from '@mui/icons-material/StopSharp';
import ButtonGroup from '@mui/material/ButtonGroup';
import AlertSnackbar from '../components/AlertSnackbar';

const Cameras = () => {
  const [cameras, setCameras] = useState([]);
  const [showCameraForm, setShowCameraForm] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [cameraToDelete, setCameraToDelete] = useState(null);

  useEffect(() => {
    fetchCameras();
    window.api.onCameraStopped((camera) => {
      updateCameraState(camera.id, false);
    });
  }, []);

  const updateCameraState = async (cameraId, isEnabled) => {
    try {
      const response = await fetch(`${config.apiUrl}/cameras/${cameraId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isEnabled: isEnabled }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update camera state');
      }
  
      let updatedCamera = await response.json();
      
      if (isEnabled) {
        updatedCamera.status = "Connecting";
      } else {
        updatedCamera.status = "Disconnected";
      }

      setCameras(cameras => cameras.map(c => c.id === updatedCamera.id ? updatedCamera : c));
      return updatedCamera;
    } catch (error) {
      console.error('Error updating camera state:', error);
    }
  };

  const fetchCameras = async () => {
    try {
      const response = await fetch(`${config.apiUrl}/cameras`);
      const cameras = await response.json();

      cameras.forEach(camera => {
        if (camera.isEnabled) {
          camera.status = "Connected";
        } else {
          camera.status = "Disconnected";
        }
      });

      setCameras(cameras);
    } catch (error) {
      console.error('Error fetching cameras:', error);
    }
  };

  const handleAddCamera = async (newCamera) => {
    try {
      const response = await fetch(`${config.apiUrl}/cameras`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCamera),
      });
      const createdCamera = await response.json();
      
      createdCamera.status = "Disconnected";

      setCameras([...cameras, createdCamera]);
      setShowCameraForm(false);

      setAlertMessage("Camera added successfully");
      setAlertOpen(true);
      
      if (newCamera.isEnabled) {
        window.api.startCamera(createdCamera);
      }
    } catch (error) {
      console.error('Error adding camera:', error);
    }
  };

  const handleStartCamera = async (camera) => {
    try {
      const updatedCamera = await updateCameraState(camera.id, true);
      window.api.startCamera(updatedCamera);
      setTimeout(async() => {
        updatedCamera.status = "Connected";
        setCameras(cameras => cameras.map(c => c.id === updatedCamera.id ? updatedCamera : c));
      }, 3000);
    } catch (error) {
      console.error('Error starting camera:', error);
    }
  };

  const handleDeleteCamera = async (cameraId) => {
    try {
      const response = await fetch(`${config.apiUrl}/cameras/${cameraId}`, {
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

  const handleStopCamera = async (camera) => {
    try {
      await updateCameraState(camera.id, false); // Update camera state to disabled
      await window.api.stopCamera(camera.name); // Call IPC to stop the camera
    } catch (error) {
      console.error('Error stopping camera:', error);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await handleDeleteCamera(cameraToDelete.id);
      const updatedCameras = cameras.filter(camera => camera.id !== cameraToDelete.id);
      setCameras(updatedCameras);
      setCameraToDelete(null);

      setAlertMessage("Camera deleted successfully");
      setAlertOpen(true);

    } catch (error) {
      console.error('Error deleting camera:', error);
    }
  };

  return (
    <div>
      <CameraForm onAddCamera={handleAddCamera}></CameraForm>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{ width: '10%'}} sx={{fontWeight: 'bold'}}>Name</TableCell>
            <TableCell style={{ width: '20%'}} sx={{fontWeight: 'bold'}}>Status</TableCell>
            <TableCell style={{ width: '20%'}} sx={{fontWeight: 'bold'}}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cameras.map((camera) => (
            <TableRow key={camera.id}>
              <TableCell>{camera.name}</TableCell>
              <TableCell>
                <CameraStatus status={camera.status} />
              </TableCell>
              <TableCell>
                <ButtonGroup variant="text" aria-label="Basic button group">                  
                  {camera.isEnabled && (
                    <Button startIcon={<StopSharpIcon />} variant="outlined" color='secondary' onClick={() => handleStopCamera(camera)}>Stop</Button>
                  )}
                  {!camera.isEnabled && (
                    <Button startIcon={<PlayArrowSharpIcon />} variant="outlined" color='secondary' onClick={() => handleStartCamera(camera)}>Start</Button>
                  )}
                  {!camera.isEnabled && (
                    <Button startIcon={<DeleteSharpIcon />} variant="outlined" color='secondary' onClick={() => setCameraToDelete(camera)}>Delete</Button>
                  )}
                </ButtonGroup>
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


      {cameraToDelete && (
        <ConfirmationDialog
          title="Delete Camera"
          message={`Are you sure you want to delete camera "${cameraToDelete.name}"?`}
          open={true}
          onConfirm={handleConfirmDelete}
          onCancel={() => setCameraToDelete(null)}
        />
      )}
    </div>
  );
};

export default Cameras;
