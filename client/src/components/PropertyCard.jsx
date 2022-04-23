import React from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/material';
import Button from '@mui/material/Button';
import { NavLink } from 'react-router-dom';

export function PropertyCard(props) {
  return (
    <Card sx={{ bgcolor: 'transparent' }}>
      <Typography
        variant='h3'
        sx={{ m: 1, width: 'auto', justifyContent: 'space-between', fontSize: '30px' }}
      > 
        <Stack>
          <div>
            <h5>{props.city},{props.state}</h5>
            <Typography variant='h6'>
              {props.street_num}{props.street} 
            </Typography>
          </div>
          <div>
            <NavLink
              to='/map'
            >
              <Button sx={{float:'right', fontSize:'20px'}}>Open in Map</Button>
            </NavLink>
          </div>
        </Stack>
      </Typography>

    </Card>
  );
}
