import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';

import Property from './Property';

export default function PropertiesList({ properties, toggleAvailability }) {


  return (
    <Container sx={{ py: 8 }} maxWidth="md">
      {/* End hero unit */}
      <Grid container spacing={4}>
        {properties.map((property) => (
          <Grid item key={property._id} xs={12} sm={6} md={4}>
            <Property property={property} toggleAvailability={toggleAvailability} />
          </Grid>))}
      </Grid>
    </Container>
  );
}
