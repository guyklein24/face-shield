import React, { useEffect, useState } from 'react';
import config from '../config';

const AlertPage = () => {
  const [alerts, setAlerts] = useState([]);

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

  return (
    <div>
      <h1>Alerts</h1>
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
    </div>
  );
};

export default AlertPage;
