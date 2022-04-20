import React, { useEffect, useState } from 'react';
import { Collapse, IconButton, makeStyles } from '@mui/material';
import { CssBaseline } from '@mui/material';
import Box from '@mui/material/Box';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Link as Scroll } from 'react-scroll';

import HomeCards from '../components/HomeCards';

const axios = require('axios');

export default function Home() {
  const [topFour, setTopFour] = useState([]);

  useEffect(async () => {
    let mounted = true;

    try {

      const response = await axios.get('/landlords/topFour');
      if (response.status >= 200 && response.status < 300) {
        if (mounted) setTopFour(response.data.landlords);
      } else {
        console.error(response.data);
      }
    } catch (error) {
      console.error(error);
    }

    return () => () => mounted = false;
  }, []);

  return (
    <div className='home'>
      <Box className='homeBanner'
        display='flex'
        justifyContent='center'
        alignItems='center'
      >
        <CssBaseline />
        <div
          className='homeTitle'
          data-aos='fade-up'
          data-aos-duration='1000'
          data-aos-mirror={true}
        >
          <h1>
            Welcome to <br />
            <span className='homeTitleText'>Bike Friendly Landlord</span>
          </h1>
          <Scroll to='homeCards' smooth={true}>
            <IconButton>
              <KeyboardArrowDownIcon
                className='homeTitleIcon'
                style={{ fontSize: 40 }}
              />
            </IconButton>
          </Scroll>
        </div>
      </Box>
      <HomeCards topFour={topFour} />

    </div >
  );
}
