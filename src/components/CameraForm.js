import React, { useState } from 'react';

const CameraForm = ({ onAddCamera }) => {
  const [newCameraName, setNewCameraName] = useState('');
  const [newCameraStatus, setNewCameraStatus] = useState('');
  const [rtspUrl, setRtspUrl] = useState('');
  const [useDefaultCamera, setUseDefaultCamera] = useState(true);

  const handleAddCamera = () => {
    const newCamera = {
      name: newCameraName,
      isEnabled: false,
      status: newCameraStatus,
      rtspUrl: useDefaultCamera ? '' : rtspUrl // Use rtspUrl if not using default camera
    };

    onAddCamera(newCamera);
    setNewCameraName('');
    setNewCameraStatus('');
    setRtspUrl('');
    setUseDefaultCamera(true);
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
        <input
          type="checkbox"
          checked={useDefaultCamera}
          onChange={(e) => setUseDefaultCamera(e.target.checked)}
        />
        <label>Use device default camera</label>
      </div>
      <div>
        <label>RTSP URL:</label>
        <input
          type="text"
          value={rtspUrl}
          onChange={(e) => setRtspUrl(e.target.value)}
          disabled={useDefaultCamera}
        />
      </div>
      <button onClick={handleAddCamera}>Add Camera</button>
    </div>
  );
};

export default CameraForm;
