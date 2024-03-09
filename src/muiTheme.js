// muiTheme.js
import { createTheme } from '@mui/material/styles';

// Define your theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#81A1C1',
      light: '#81b5c1',
      dark: '#5E81AC',
      contrastText: '#20334a',
    },
    secondary: {
      main: '#8FBCBB',
      light: '#88C0D0',
    },
    background: {
      default: '#2E3440',
      paper: '#2E3440',
    },
    success: {
      main: '#a5c58b',
    },
    warning: {
      main: '#eab753',
    },
    error: {
      main: '#ce5863',
    },
  },
  typography: {
    fontFamily: 'Open Sans',
  },
});

export default theme;
