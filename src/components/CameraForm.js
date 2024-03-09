import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Checkbox, FormControlLabel, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const CameraForm = ({ onAddCamera }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    newCameraName: '',
    rtspUrl: '',
    useDefaultCamera: true
  });
  const [errors, setErrors] = useState({
    newCameraName: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
    setErrors(prevState => ({
      ...prevState,
      [name]: false
    }));
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { newCameraName, rtspUrl, useDefaultCamera } = formData;

    if (!newCameraName.trim()) {
      setErrors(prevState => ({
        ...prevState,
        newCameraName: true
      }));
      return;
    }

    const newCamera = {
      name: newCameraName,
      isEnabled: false,
      status: 'Disconnected',
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

    // Close the dialog after submission
    setOpen(false);
  };

  return (
    <>
      <Button variant="outlined" startIcon={<AddIcon />} onClick={handleOpen}>Create New Camera</Button>
      <Dialog open={open} onClose={handleClose} color="secondary">
        <DialogTitle color="secondary">Create New Camera</DialogTitle>
        <DialogContent>
          <TextField
            color="secondary"
            label="Name"
            name="newCameraName"
            value={formData.newCameraName}
            onChange={handleChange}
            margin="dense"
            variant="standard"
            fullWidth
            required
            error={errors.newCameraName}
            helperText={errors.newCameraName ? 'Name is required' : ''}
          />
          <TextField
            color="secondary"
            label="RTSP URL"
            name="rtspUrl"
            value={formData.rtspUrl}
            onChange={handleChange}
            fullWidth
            disabled={formData.useDefaultCamera}
            margin="dense"
            variant="standard"
            helperText="Example: rtsp://username:password@address/stream"
          />
          <FormControlLabel
            control={<Checkbox
              color="secondary"
              name="useDefaultCamera"
              checked={formData.useDefaultCamera}
              onChange={handleChange}
            />}
            label="Use device default camera"
            color="secondary"
            margin="dense"
            variant="standard"
          />
          <Typography variant="body2" color="textSecondary">
            Uncheck if you want to use an RTSP camera.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="secondary">Add Camera</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CameraForm;
