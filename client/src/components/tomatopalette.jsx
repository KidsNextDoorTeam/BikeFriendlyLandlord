import { createTheme } from '@mui/material/styles';

// create our color palette
const tomatopalette = createTheme({
  palette: {
    background: {
      paper: '#f1f1f1',
    },
    primary: {
      main: '#ff6347',
      contrastText: '#fff',
    },
    background: '#a1a1a1'
  },
  typography: {
    fontFamily: [
      'Nunito'
    ]
  },
});

export default tomatopalette;
