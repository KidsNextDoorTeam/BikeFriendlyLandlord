import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';

import Property from './Property';
import { useAlert } from '../hooks/alertContext';

export default function PropertiesList({ properties }) {
  const { setAlert, setAlertSeverity } = useAlert();


  const toggleAvailability = async (id, available) => {
    try {
      const { status } = await axios.put('/property/id', {
        is_available: available
      });

      if (status >= 200) {
        setAlert('Great Sucess. Very nice');
        setAlertSeverity('success');
      }
    } catch (err) {
      if (err?.response?.status === 401) {
        setAlert('Go login bruh');
        setAlertSeverity('error');
      }
    }
    
  };

  return (
    <Container sx={{ py: 8 }} maxWidth="md">
      {/* End hero unit */}
      <Grid container spacing={4}>
        {properties.map((property, i) => (
          <Grid item key={i} xs={12} sm={6} md={4}>
            <Property property={property} />
          </Grid>))}
      </Grid>
    </Container>
  );
}
