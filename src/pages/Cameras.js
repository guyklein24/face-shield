import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CameraForm from '../components/CameraForm';

const Cameras = () => {
  const [cameras, setCameras] = useState([]);
  const [showCameraForm, setShowCameraForm] = useState(false);

  useEffect(() => {
    fetchCameras();
  }, []);

  const fetchCameras = async () => {
    try {
      const response = await fetch('http://localhost:3000/cameras');
      const data = await response.json();
      setCameras(data);
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
    } catch (error) {
      console.error('Error adding camera:', error);
    }
  };

  return (
    <div>
      <h1>Camera Page</h1>
      <div>
        <button onClick={() => setShowCameraForm(true)}>Create Camera</button>
        <Link to="/cameras">View Cameras</Link>
      </div>

      {showCameraForm && <CameraForm onAddCamera={handleAddCamera} />}

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Is Enabled</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {cameras.map((camera) => (
              <tr key={camera.id}>
                <td>{camera.id}</td>
                <td>{camera.name}</td>
                <td>{camera.isEnabled ? 'Yes' : 'No'}</td>
                <td>{camera.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default Cameras;
  