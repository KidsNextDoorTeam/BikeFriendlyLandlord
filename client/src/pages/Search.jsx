import React, { Component, useEffect, useRef, useState } from 'react';
import axios from 'axios';
// import { Link } from 'react-router-dom'

// import MUI components
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import { ThemeProvider } from '@mui/material/styles';

import ResultDisplay from '../components/resultDisplay';
import tomatopalette from '../components/tomatopalette';

export default function Search() {
  // handle search results
  const [searchResults, setSearchResults] = useState([]);

  // handle city input
  const [city, setCity] = useState('');

  // handle bike / pet friendly
  const [bikeR, setBikeR] = useState(false);
  const handleBikeRChange = (e) => {
    setBikeR(!bikeR);
  };

  const [petR, setPetR] = useState(false);
  const handlePetRChange = (e) => {
    setPetR(!petR);
  };

  const mounted = useRef(true);

  // Request to get values (NEED ALL ADDRESSES -> ALL CITIES)
  const [options, setOptions] = useState([]);

  useEffect(async () => {
    try {
      const response = await axios.get('/properties/uniqueCities');
      if (response.status >= 200 && response.status < 300) {
        if (mounted.current) setOptions(response.data.cities);
      }
    } catch (error) {
      console.error(error);
    }

    return () => () => (mounted.current = false);
  }, []);

  // method to handle search :fetch request using all fields
  const handleSearch = async () => {
    // build req body
    const formBody = {
      city: city,
      bike_friendly: bikeR,
      pet_friendly: petR,
    };

    //send request
    try {
      const response = await axios.post('/landlords/search', {
        ...formBody,
      });
      if (response.status >= 200 && response.status < 300) {
        if (mounted.current) setSearchResults(response.data.landlords);
      } else {
        console.error(response.data.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ThemeProvider theme={tomatopalette}>
      <div
        className='searchPageMain'
        sx={{
          margin: 0,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed',
        }}
      >
        <Container
          className='searchMainContainer'
          maxwidth='sm'
          sx={{
            p: 2,
            textDecoration: 'none',
            fontFamily: 'Nunito',
            color: 'rgb(68, 67, 67)',
          }}
        >
          <Box
            className='searchContainer'
            sx={{ p: 2, background: 'rgba(241, 241, 241, 0.4)' }}
          >
            <Stack
              className='searchFields'
              direction='column'
              spacing={3}
              justifyContent='center'
              alignItems='center'
            >
              <Stack
                direction='row'
                spacing={10}
                justifyContent='center'
                alignItems='center'
              >
                <Stack
                  direction='row'
                  spacing={1}
                  justifyContent='center'
                  alignItems='center'
                >
                  <h2>City</h2>
                  <Autocomplete
                    disablePortal
                    clearOnEscape
                    options={options}
                    sx={{ width: 300 }}
                    renderInput={(params) => (
                      <TextField {...params} label='Select a City' />
                    )}
                    value={city}
                    onChange={(e, newVal) => {
                      setCity(newVal);
                    }}
                  />
                </Stack>
                <Stack
                  direction='row'
                  spacing={1}
                  justifyContent='center'
                  alignItems='center'
                >
                  <h2>Bike Friendly</h2>
                  <Checkbox
                    checked={bikeR}
                    onChange={handleBikeRChange}
                    size='large'
                  />
                </Stack>
                <Stack
                  direction='row'
                  spacing={1}
                  justifyContent='center'
                  alignItems='center'
                >
                  <h2>Pet Friendly</h2>
                  <Checkbox
                    checked={petR}
                    onChange={handlePetRChange}
                    size='large'
                  />
                </Stack>
              </Stack>
              <Button
                variant='contained'
                // fullWidth
                onClick={handleSearch}
              >
                Search
              </Button>
            </Stack>
            <ResultDisplay resultsArr={searchResults} />
          </Box>
        </Container>
      </div>
    </ThemeProvider>
  );
}
