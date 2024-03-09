import React, { useState } from 'react';
import { AppBar, Box, Toolbar, IconButton, Tabs, Tab } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import { Link } from 'react-router-dom';
import NotificationsIcon from '@mui/icons-material/Notifications';

const Header = () => {
  // State to manage the selected tab
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const tabStyle = {
    minWidth: { sm: 160 },
  }
  
  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Hamburger menu icon */}
        <IconButton edge="start" color="inherit" aria-label="menu">
          {/* <MenuIcon /> */}
        </IconButton>
        {/* Application logo */}
        <img src="/face_shield_logo_light.png" alt="Logo" style={{ height: '30px', marginRight: '16px' }} />
        {/* Settings icon */}
        <IconButton edge="end" color="inherit" aria-label="settings">
          {/* <SettingsIcon /> */}
        </IconButton>
      </Toolbar>
      {/* Tabs for navigation */}
      <Tabs 
        value={selectedTab}
        onChange={handleTabChange}
        centered
        textColor="inherit"
        indicatorColor="secondary"
        >

        <Tab 
          icon={
              <NotificationsIcon />
          }
          iconPosition='start'
          label={"Alerts"}
          component={Link}
          to="/"
          sx={tabStyle}/>
        <Tab label="Watchlist" component={Link} to="/watchlist" sx={tabStyle}/>
        <Tab label="Cameras" component={Link} to="/cameras" sx={tabStyle}/>
        <Tab label="Users" component={Link} to="/users" sx={tabStyle}/>
      </Tabs>
    </AppBar>
  );
};

export default Header;
