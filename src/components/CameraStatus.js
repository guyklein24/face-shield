import React from 'react';
import { Typography, Box } from '@mui/material';
import CircleSharpIcon from '@mui/icons-material/CircleSharp';
import CircularProgress from '@mui/material/CircularProgress';


const CameraStatus = ({ status }) => {
  const getStatusComponent = () => {
    switch (status) {
      case 'Connected':
        return (
          <Box display="flex" alignItems="center">
            <CircleSharpIcon fontSize='x-small' color="success" />
            <Typography variant="body2" sx={{ ml: 1 }}>Connected</Typography>
          </Box>
        );
      case 'Disconnected':
        return (
          <Box display="flex" alignItems="center">
            <CircleSharpIcon fontSize='x-small' color="error" />
            <Typography variant="body2" sx={{ ml: 1 }}>Disconnected</Typography>
          </Box>
        );
      case 'Connecting':
        return (
          <Box display="flex" alignItems="center">
            <CircularProgress size={20} color="secondary" />
            <Typography variant="body2" sx={{ ml: 1 }}>Connecting</Typography>
          </Box>
        );
      default:
        return null; // Handle unknown status
    }
  };

  return (
    <div>
      {getStatusComponent()}
    </div>
  );
};

export default CameraStatus;
