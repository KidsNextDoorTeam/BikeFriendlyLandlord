import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import UserContext from '../hooks/userContext';

// import MUI components
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import { ThemeProvider } from '@mui/material/styles';

// import theme
import tomatopalette from '../components/tomatopalette';

export default function ReviewPage() {
  const mounted = useRef(true);
  const { user } = useContext(UserContext);
  const { landlord_id } = useParams();

  const [landlordName, setlandlordName] = useState('');
  const [title, setTitle] = useState(''); // (limit 100)
  const [respect, setRespect] = useState(null);
  const [response, setResponse] = useState(null);
  const [bike, setBike] = useState(false);
  const [pet, setPet] = useState(false);
  const [description, setDescription] = useState(''); // limit 1000

  const navigate = useNavigate();

  useEffect(async () => {
    const { status, data } = await axios.get(`/landlords/${landlord_id}`);

    if (status === 200) {
      if (mounted.current) {
        setlandlordName(data.landlord.first_name + ' ' + data.landlord.last_name);
      }
    } else {
      console.error(data);
    }
    return () => () => mounted.current = false;
  }, []);

  // calculate overall rating
  const overallCalc = (...values) => {
    const arr = [...values];
    const newArr = arr.filter((val) => val !== null);
    if (newArr.length === 0) return 0;
    return newArr.reduce((a, b) => a + b) / newArr.length;
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleBikeChange = (e) => {
    setBike(!bike);
  };

  const handlePetChange = (e) => {
    setPet(!pet);
  };

  const handleDescChange = (e) => {
    setDescription(e.target.value);
  };

  // method to handle form submission
  const sendReview = async () => {
    // build req body
    const formBody = {
      title,
      description,
      landlord_id,
      user_id: user._id,
      overall_rating: overallCalc(respect, response),
      respect_rating: respect,
      responsiveness_rating: response,
      bike_friendly: bike,
      pet_friendly: pet,
    };

    try {
      const { status, data } = await axios.post(`/reviews/${landlord_id}`, {
        ...formBody,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (status === 200) {
        navigate(`/landlord/${landlord_id}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ThemeProvider theme={tomatopalette}>
      <div className="reviewPageGlobalContainer">
        <Container className="reviewMainContainer" maxwidth="sm" sx={{ p: 2 }}>
          <Box className="reviewformContainer" sx={{ p: 2 }}>
            <h2>Review of {landlordName}</h2>
            <TextField
              fullWidth
              required
              label="Title"
              value={title}
              onChange={handleTitleChange}
              inputProps={{ maxLength: 100 }}
              helperText="Max 100 Characters"
              sx={{ mb: 2, mt: 2 }}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <h3 className="reviewLabel">Overall Rating</h3>
              </Grid>
              <Grid item xs={6}>
                <Rating
                  required
                  size="large"
                  style={{ color: 'tomato' }}
                  precision={0.5}
                  value={overallCalc(respect, response)}
                  readOnly
                />
              </Grid>
              <Grid item xs={6}>
                <h3 className="reviewLabel">Respectfulness</h3>
              </Grid>
              <Grid item xs={6}>
                <Rating
                  required
                  size="large"
                  style={{ color: 'tomato' }}
                  precision={0.5}
                  value={respect}
                  onChange={(e, val) => setRespect(val)}
                />
              </Grid>
              <Grid item xs={6}>
                <h3 className="reviewLabel">Responsiveness</h3>
              </Grid>
              <Grid item xs={6}>
                <Rating
                  required
                  size="large"
                  style={{ color: 'tomato' }}
                  precision={0.5}
                  value={response}
                  onChange={(e, val) => setResponse(val)}
                />
              </Grid>
              <Grid item xs={6}>
                <h3 className="reviewLabel">Bike Friendly?</h3>
              </Grid>
              <Grid item xs={6}>
                <Checkbox
                  checked={bike}
                  onChange={handleBikeChange}
                  size="medium"
                  style={{ paddingTop: 4, paddingLeft: 0 }}
                />
              </Grid>
              <Grid item xs={6}>
                <h3 className="reviewLabel">Pet Friendly?</h3>
              </Grid>
              <Grid item xs={6}>
                <Checkbox
                  checked={pet}
                  onChange={handlePetChange}
                  size="medium"
                  style={{ paddingTop: 4, paddingLeft: 0 }}
                />
              </Grid>
            </Grid>
            <TextField
              fullWidth
              required
              label="Additional Comments"
              multiline
              rows={4}
              inputProps={{ maxLength: 1000 }}
              helperText="Max 1000 Characters"
              value={description}
              onChange={handleDescChange}
              sx={{ mb: 2, mt: 2 }}
            />
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                onClick={() => navigate(`/landlord/${landlord_id}`)}
              >
                Cancel
              </Button>
              <Button variant="contained" onClick={sendReview}>
                Submit
              </Button>
            </Stack>
          </Box>
        </Container>
      </div>
    </ThemeProvider >
  );
}
