import React, { useState } from 'react';

const CameraForm = ({ onAddCamera }) => {
  const [formData, setFormData] = useState({
    newCameraName: '',
    newCameraStatus: '',
    rtspUrl: '',
    useDefaultCamera: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { newCameraName, newCameraStatus, rtspUrl, useDefaultCamera } = formData;

    const newCamera = {
      name: newCameraName,
      isEnabled: false,
      status: newCameraStatus,
      rtspUrl: useDefaultCamera ? '' : rtspUrl
    };

    onAddCamera(newCamera);
    
    // Clear form fields after submission
    setFormData({
      newCameraName: '',
      newCameraStatus: '',
      rtspUrl: '',
      useDefaultCamera: true
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create New Camera</h2>
      <div>
        <label>Name:</label>
        <input
          type="text"
          name="newCameraName"
          value={formData.newCameraName}
          onChange={handleChange}
        />
      </div>
      <div>
        <input
          type="checkbox"
          name="useDefaultCamera"
          checked={formData.useDefaultCamera}
          onChange={handleChange}
        />
        <label>Use device default camera</label>
      </div>
      <div>
        <label>RTSP URL:</label>
        <input
          type="text"
          name="rtspUrl"
          value={formData.rtspUrl}
          onChange={handleChange}
          disabled={formData.useDefaultCamera}
        />
      </div>
      <button type="submit">Add Camera</button>
    </form>
  );
};

export default CameraForm;