import React from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/material';
import Rating from '@mui/material/Rating';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import Icon from '@mui/material/Icon';
import { createTheme } from '@mui/material/styles';

import '../index.css';
import { ThemeProvider } from '@emotion/react';

const theme = createTheme({
  typography: {
    fontFamily: ['Nunito']
  },
});

export function LandlordInfoCard(props) {
  return (
    <ThemeProvider theme={theme}>
      <Card sx={{ bgcolor: 'transparent' }}>
        <Stack>
          <Typography
            variant='h3'
            sx={{ m: 1, width: 'auto', justifyContent: 'space-between', fontSize: '30px' }}
          >
          </Typography>
          {/* <Link to={`/reviews/$/`}><Button variant='contained' sx={{m: 3}}>Is this you?</Button></Link> */}
        </Stack>
        <Stack
          spacing={5}
          direction='row'
          sx={{ m: 3, width: 'auto', justifyContent: 'space-between' }}
        >
          <Typography variant='h5'>Overall Rating</Typography>
          <Rating
            style={{ color: 'tomato' }}
            required
            size='large'
            precision={0.5}
            value={Number(props.overall_rating)}
            readOnly
          ></Rating>
        </Stack>
        <Stack
          spacing={5}
          direction='row'
          sx={{ m: 3, width: 'auto', justifyContent: 'space-between' }}
        >
          <Typography variant='h5'>Respectful</Typography>
          <Rating
            style={{ color: 'tomato' }}
            required
            size='large'
            precision={0.5}
            value={Number(props.respect_rating)}
            readOnly
          />
        </Stack>
        <Stack
          spacing={5}
          direction='row'
          sx={{ m: 3, width: 'auto', justifyContent: 'space-between' }}
        >
          <Typography variant='h5'>Responsiveness</Typography>
          <Rating
            style={{ color: 'tomato' }}
            required
            size='large'
            precision={0.5}
            value={Number(props.responsiveness_rating)}
            readOnly
          />
        </Stack>
        <Stack
          spacing={5}
          direction='row'
          sx={{ m: 3, width: 'auto', justifyContent: 'space-between' }}
        >
          <Typography variant='h5'>Bike Friendly</Typography>
          <Icon>
            {props.bike_friendly ? (
              <CheckIcon
                style={{ color: 'green', fontSize: '30px' }}
              ></CheckIcon>
            ) : (
              <ClearIcon style={{ color: 'tomato', fontSize: '30px' }} />
            )}
          </Icon>
        </Stack>
        <Stack
          spacing={5}
          direction='row'
          sx={{ m: 3, width: 'auto', justifyContent: 'space-between' }}
        >
          <Typography variant='h5'>Pet Friendly </Typography>
          <Icon>
            {props.pet_friendly ? (
              <CheckIcon
                style={{ color: 'limeGreen', fontSize: '30px' }}
              ></CheckIcon>
            ) : (
              <ClearIcon style={{ color: 'tomato', fontSize: '30px' }} />
            )}
          </Icon>
        </Stack>
      </Card>
    </ThemeProvider>
  );
}
