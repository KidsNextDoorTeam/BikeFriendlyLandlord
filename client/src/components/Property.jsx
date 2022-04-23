import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import CameraIcon from '@mui/icons-material/PhotoCamera';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';

export default function Property({ property: {_id, street_num, street, city, state, zip, is_available}, toggleAvailability }) {
  return (
    <Card
      sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <CardMedia
        component="img"
        sx={{
          // 16:9
          // pt: '20.25%',
          p: 1,
        }}
        image="https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
        alt="random"
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="h2">
          {street_num} {street}
        </Typography>
        <Typography>
          {city}, {state} {zip}
        </Typography>
        <Typography sx={{color: is_available ? 'green' : 'red'}}>
          {is_available ? 'Available' : 'Rented'}
        </Typography>
      </CardContent>
      <CardActions>
        {/* TODO: Link to Propety page */}
        <Button color="primary" varsize="small">View</Button>
        <Button size="small" onClick={() => toggleAvailability(_id, !is_available)}>{is_available ? 'Rent' : 'Open'}</Button>
      </CardActions>
    </Card>
  );
}
