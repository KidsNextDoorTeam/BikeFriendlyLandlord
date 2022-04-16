import { createTheme } from '@mui/material/styles';

// create our color palette
const tomatopalette = createTheme({
  palette: {
    primary: {
      main: '#ff6347',
      contrastText: '#fff',
    },
  },
  typography: {
    fontFamily: [
      'Nunito'
    ]
  },
});

export default tomatopalette;
