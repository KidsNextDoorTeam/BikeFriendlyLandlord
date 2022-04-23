import { createTheme } from '@mui/material/styles';

// create our color palette
const tomatopalette = createTheme({
  palette: {
    background: {
      paper: 'rgba(241, 241, 241, 0.6)',
    },
    primary: {
      main: '#ff6347',
      contrastText: '#fff',
    },
    // background: '#a1a1a1'
  },
  typography: {
    fontFamily: [
      'Nunito'
    ]
  },
});

export default tomatopalette;
