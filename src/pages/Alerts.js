import React, { useEffect, useState } from 'react';
import ConfirmationDialog from '../components/ConfirmationDialog';
import config from '../config';

const AlertPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);

  useEffect(() => {
    fetchAlerts();
    // Listen for alerts from the main process
    window.api.onSendAlert((alert) => {
      // Update the state with the new alert
      setAlerts((alerts) => [...alerts, alert]);
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

  return (
    <div>
      <h1>Alerts</h1>
      <div style={{ marginBottom: '10px' }}>
        <button onClick={handleClearAlerts}>Clear Alerts</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Suspect</th>
            <th>Timestamp</th>
            <th>Camera</th>
          </tr>
        </thead>
        <tbody>
          {alerts.map((alert, index) => (
            <tr key={index}>
              <td>{alert.subjectName}</td>
              <td>{new Date(alert.timestamp * 1000).toLocaleString()}</td>
              <td>{alert.cameraName}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {showConfirmationDialog && (
        <ConfirmationDialog
          message="Are you sure you want to clear all alerts?"
          onConfirm={confirmClearAlerts}
          onCancel={() => setShowConfirmationDialog(false)}
        />
      )}
    </div>
  );
};

export default AlertPage;
