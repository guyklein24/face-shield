import React, { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';


const AlertSnackbar = ({ open, title, onClose, severity, message }) => {

    return (
        <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            open={open}
            autoHideDuration={3000} // Adjust as needed
            onClose={onClose}
        >
        <Alert
            elevation={6}
            variant="outlined"
            onClose={onClose}
            severity={severity} // 'success', 'error', 'warning', 'info'
        >
            <AlertTitle><b>{title}</b></AlertTitle>
            {message}
        </Alert>
        </Snackbar>
    );
};

export default AlertSnackbar;
