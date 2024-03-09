import React, { useEffect, useState } from 'react';
import ConfirmationDialog from '../components/ConfirmationDialog';
import config from '../config';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination'; // Import TablePagination
import ClearSharpIcon from '@mui/icons-material/ClearSharp';

const AlertPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [page, setPage] = useState(0); // Current page
  const [rowsPerPage, setRowsPerPage] = useState(5); // Number of rows per page

  useEffect(() => {
    fetchAlerts();
    // Listen for alerts from the main process
    window.api.onSendAlert((alert) => {
      // Update the state with the new alert added to the start
      setAlerts((alerts) => [alert, ...alerts]);
    });
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await fetch(`${config.apiUrl}/alerts`);
      const data = await response.json();
      // Sort alerts by timestamp in descending order (from newest to oldest)
      data.sort((a, b) => b.timestamp - a.timestamp);
      setAlerts(data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  const handleClearAlerts = () => {
    setShowConfirmationDialog(true);
  };

  const confirmClearAlerts = async () => {
    try {
      // Perform clearing of alerts here
      // Clear alerts state
      setAlerts([]);
      // Close the confirmation dialog
      setShowConfirmationDialog(false);
    } catch (error) {
      console.error('Error clearing alerts:', error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <Button startIcon={<ClearSharpIcon />} variant="outlined" onClick={handleClearAlerts}>Clear Alerts</Button>
      </div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{width: '5%'}} sx={{fontWeight: 'bold'}}>ID</TableCell>
            <TableCell style={{width: '15%'}} sx={{fontWeight: 'bold'}}>Timestamp</TableCell>
            <TableCell style={{width: '15%'}} sx={{fontWeight: 'bold'}}>Subject</TableCell>
            <TableCell style={{width: '15%'}} sx={{fontWeight: 'bold'}}>Camera</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {alerts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((alert, index) => (
            <TableRow key={index}>
              <TableCell>{alert.id}</TableCell>
              <TableCell>{new Date(alert.timestamp * 1000).toLocaleString()}</TableCell>
              <TableCell>{alert.subjectName}</TableCell>
              <TableCell>{alert.cameraName}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 20]}
        component="div"
        count={alerts.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <ConfirmationDialog
        title="Clear Alerts"
        open={showConfirmationDialog}
        message="Are you sure you want to clear all alerts?"
        onConfirm={confirmClearAlerts}
        onCancel={() => setShowConfirmationDialog(false)}
      />
    </div>
  );
};

export default AlertPage;
