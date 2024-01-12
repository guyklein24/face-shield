// App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Alerts from './pages/Alerts';
import Watchlist from './pages/Watchlist';
import Camera from './pages/Cameras';
import Users from './pages/Users';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<Alerts />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/cameras" element={<Camera />} />
        <Route path="/users" element={<Users />} />
      </Routes>
    </Router>
  );
}

export default App;
