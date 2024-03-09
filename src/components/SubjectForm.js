import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography, Input, Box } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AddIcon from '@mui/icons-material/Add';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';


const SubjectForm = ({ onAddSubject }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null,
    imageName: '' // Track the selected file name
  });
  const [openBackdrop, setOpenBackdrop] = useState(false);

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    if (name === 'image') {
      setFormData(prevState => ({
        ...prevState,
        image: files[0], // Set the image file
        imageName: files[0].name // Set the file name
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    // Reset the file selection if the dialog is canceled
    setFormData(prevState => ({
      ...prevState,
      image: null,
      imageName: ''
    }));
    setOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setOpen(false);
    setOpenBackdrop(true);
    try {
      const imagePath = await uploadImage(formData.image, formData.name);
  
      // Call onAddSubject function with new subject data and imagePath
      await onAddSubject({
        name: formData.name,
        description: formData.description,
        imagePath,
      });

      // Clear form fields after submission
      setFormData({
        name: '',
        description: '',
        image: null,
        imageName: '' // Reset the selected file name
      });
      setOpenBackdrop(false);
    } catch (error) {
      console.error('Error handling form submission:', error);
    }
  };

  const uploadImage = async (imageFile, subjectName) => {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        reader.onload = async () => {
          const base64Image = reader.result.split(',')[1]; // Extract base64 data
          const imagePath = await window.api.uploadImage(base64Image, subjectName);
          console.log('Image uploaded successfully.');
          resolve(imagePath); // Resolve with the image path
        };
        reader.onerror = (error) => {
          reject(error);
        };
        reader.readAsDataURL(imageFile);
      } catch (error) {
        console.error('Error uploading image:', error);
        reject(error);
      }
    });
  };
  
  return (
    <>
      <Button startIcon={<AddIcon />} variant="outlined" onClick={handleOpen}>Add New Subject</Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle color="secondary" >Add New Subject</DialogTitle>
        <DialogContent>
          <Box>
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
              margin="dense"
              variant="standard"
              color="secondary"
            />
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              minRows={3}
              maxRows={6}
              fullWidth
              margin="dense"
              variant="standard"
              color="secondary"
            />
          </Box>
          <Box mt={3} display="flex" alignItems="center">
            <Button
              variant="contained"
              component="label"
              color="secondary"
              startIcon={<CloudUploadIcon />}
            >
              Upload Image
              <Input
                type="file"
                accept="image/*"
                name="image"
                onChange={handleChange}
                fullWidth
                required
                style={{ display: 'none' }}
              />
            </Button>
            {formData.imageName && (
            <Typography variant="body2" color="textSecondary" gutterBottom paddingLeft="10px">
              {formData.imageName}
            </Typography>
          )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="secondary">Add Subject</Button>
        </DialogActions>
      </Dialog>
      <Backdrop
        open={openBackdrop}
        onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default SubjectForm;
