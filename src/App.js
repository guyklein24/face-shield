import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Box } from '@mui/material'; // Import Box component
import Alerts from './pages/Alerts';
import Watchlist from './pages/Watchlist';
import Camera from './pages/Cameras';
import Users from './pages/Users';
import Header from './components/Header';
import { ThemeProvider } from '@mui/material/styles'; // Import ThemeProvider
import CssBaseline from '@mui/material/CssBaseline';
import theme from './muiTheme'; // Import your custom theme
import AlertSnackbar from './components/AlertSnackbar';


function App() {
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);

  const playAlertSound = () => {
    const audio = new Audio('/beep-warning.mp3'); // Replace with the path to your sound file
    audio.play();
  };

  useEffect(() => {
    window.api.onSendAlert((alert) => {
      setAlertMessage(`Subject ${alert.subjectName} was detected on ${alert.cameraName} camera `)
      setAlertOpen(true);
      playAlertSound();
    });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Header/>
        <Box p={3}> {/* Add padding to all sides of the Box */}
          <Routes>
            <Route path="/" exact element={<Alerts />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/cameras" element={<Camera />} />
            <Route path="/users" element={<Users />} />
          </Routes>
        </Box>
      </Router>
      <AlertSnackbar
        open={alertOpen}
        title="Unauthorized Access Detected"
        onClose={() => setAlertOpen(false)}
        severity="error"
        message={alertMessage}
      />
    </ThemeProvider>
  );
}

export default App;
