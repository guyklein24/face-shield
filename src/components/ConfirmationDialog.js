import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

const ConfirmationDialog = ({ open, message, onConfirm, onCancel, title }) => {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle color="secondary">{title}</DialogTitle>
      <DialogContent>
        <p>{message}</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="secondary">
          No
        </Button>
        <Button onClick={onConfirm} color="secondary" autoFocus>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
