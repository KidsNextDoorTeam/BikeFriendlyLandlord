import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Avatar from '@mui/material/Avatar';
import { Button, Grid, TextField } from '@mui/material';

import { Review } from '../components/Review';
import { stringAvatar } from '../common/styling.js';
import { useAuth } from '../hooks/authContext';
import { useAlert } from '../hooks/alertContext';
import PropertiesList from '../components/ProperitesList';

// for landlord selecting
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function UserProfile() {
  const {user, getUser } = useAuth();
  const [properties, setProperties] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [firstname, setFirstName] = useState(user.first_name);
  const [lastname, setLastName] = useState(user.last_name);
  const [userDescription, setDescription] = useState(user.description);
  const [userEmail, setEmail] = useState(user.email);
  const [profilePic, setProfilePic] = useState(user.profile_pic);
  const [currentTab, setCurrentTab] = useState(0);
  const [updateMode, setUpdateMode] = useState(false);
  const { setAlert, setAlertSeverity } = useAlert();

  //Todo for landlord fetching
  //1. import use navigation to route to review page with landlord ID
  //2.create getLandlords function and invoke function in useEffect underneath getreviews()
  //3.create handleChange when button is clicked for

  // state for addReview onclick leading to landlord selection
  const [addReview, setAddReview] = useState(false);

  //state for landlord, set landlord state **DOES THIS NEED TO BE A STRING OR ARRAY**?
  const [landLords, setLandlords] = React.useState([]);

  //state represents which landlord is selected
  const [selectedLandlord, setSelectedLandlord] = useState('');

  //for changing landlord state
  const handleChange = (event) => {
    setSelectedLandlord(event.target.value);
  };

  //routing for landlord review page
  const handleReview = (e) => {
    navigate(`/review/${landlordId}/`);
  };
  //landlord params
  const { landlord_id: landlordId } = useParams();

  const navigate = useNavigate();
  // let [searchParams, setSearchParams] = useSearchParams();
  const mounted = useRef(true);

  const getReviews = async () => {
    if (!user._id) {
      navigate('/'); // user needs to sign in
      return;
    }
    try {
      const { status, data } = await axios.get(`/user/${user._id}/reviews`);
      if (status >= 200 && status < 300 && mounted.current)
        setReviews(data.reviews);
    } catch (err) {
      if (err?.response?.status === 401) {
        navigate('/');
      } else {
        console.error('Error fetching users reviews -->', err);
      }
    }
  };

  const getLandlordInfo = async () => {
    if (!user._id) {
      navigate('/'); // user needs to sign in
      return;
    }
    try {
      const { status, data } = await axios.get(`/landlords/${user._id}`);
      if (status >= 200 && status < 300 && mounted.current) setProperties(data.landlord.properties);
    } catch (err) {
      if (err?.response?.status === 401) {
        navigate('/');
      } else {
        console.error('Error fetching landlordProperties -->', err);
      }
    }
  };

  //create function for axios get request to /landlords path
  const getLandlords = async () => {
    try {
      const { status, data } = await axios.get('/landlords');
      if (status >= 200 && status < 300 && mounted.current) console.log(data);
      setLandlords(data.landlords);
    } catch (err) {
      if (err?.response?.status === 401) {
        navigate('/');
      } else {
        console.error('Error fetching landlordProperties -->', err);
      }
    }
  };

  const toggleAvailability = async (id, available) => {
    try {
      const { status } = await axios.put(`/properties/${id}`, {
        is_available: available
      });

      if (status >= 200) {
        setAlert('Great Success. Very nice');
        setAlertSeverity('success');
        getLandlordInfo();
      }
    } catch (err) {
      if (err?.response?.status === 401) {
        setAlert('Go login bruh');
        setAlertSeverity('error');
      }
    }
    
  };

  useEffect(() => {
    getReviews();
    getLandlords();
    if (user.roles?.includes('landlord')) {
      getLandlordInfo();
    }

    return () => () => (mounted.current = false);
  }, [user]);

  const onReviewDelete = () => {
    getReviews();
  };

  const onReviewSave = () => {
    getReviews();
  };

  const handleTabChange = (e, newValue) => {
    setCurrentTab(newValue);
  };

  const userProfileChange = () => {
    setUpdateMode(false);
    axios.put(`/user/${user._id}/updateUserInfo`, {
      firstname:firstname,
      lastname:lastname,
      description: userDescription, 
      email: userEmail,
      profilePic: profilePic,
    }).then((response) => {
      if (response) {
        getUser();
      }
    });

  };

  return (
    <div
      id="userProfile"
      sx={{
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
      }}
    >
      <Typography variant="h6" component="div" style={{ fontFamily: 'Nunito' }}>
        <Grid container spacing={1}>
          <Grid item xs={3}>
            <div style={{ display: 'flex' }}>
              {user.profile_pic ? (
                <Avatar
                  alt="User picture"
                  src={`/images/${profilePic}`}
                  sx={{
                    width: 200,
                    height: 200,
                    minWidth: 20,
                    minHeight: 20,
                    my: 2.5,
                  }}
                />
              ) : (
                <Avatar
                  alt="User picture"
                  {...stringAvatar(`${user.first_name} ${user.last_name}`)}
                />
              )}
            </div>
            {updateMode ? (
              <Box>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  {/* TODO: Hanlde form updates and submission */}
                  <TextField
                    label="First Name"
                    variant="outlined"
                    onChange={(e) => setFirstName(e.target.value)}
                    size="small"
                  />
                  <TextField
                    label='Last Name'
                    variant='outlined'
                    onChange={(e) => setLastName(e.target.value)}
                    size="small"
                  />
                  <TextField
                    label='Email'
                    variant='outlined'
                    onChange={(e) => setEmail(e.target.value)}
                    size="small"
                  />
                  <TextField
                    label="Bio"
                    variant="outlined"
                    multiline
                    rows={4}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <input
                    style={{ display: 'none' }}
                    id="contained-button-file"
                    type="file"
                    onChange={(e) => setProfilePic(e.target.files[0].name)}
                  />
                  <label htmlFor="contained-button-file">
                    <Button variant="contained" color="primary" component="span">
                    Update Picture
                    </Button>
                  </label>
                </div>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setFirstName(user.first_name);
                    setLastName(user.last_name);
                    setProfilePic(user.profile_pic);
                    setDescription(user.description);
                    setEmail(user.email);
                    setUpdateMode(false);
                  }}
                  sx={{ mt: 1, mr: 2, textTransform: 'none' }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={userProfileChange}
                  sx={{ mt:1, textTransform: 'none' }}
                >
                  Save
                </Button>
              </Box>
            ) : (
              <Box>
                <div style={{ marginBottom: '10px', color: '#333' }}>
                  <h2>
                    {' '}
                    {user.first_name} {user.last_name}
                  </h2>
                  <span> {user.username} </span>
                </div>
                <Button
                  variant="contained"
                  style={{
                    width: '80%',
                    backgroundColor: 'tomato',
                    color: 'white',
                  }}
                  onClick={() => {
                    setUpdateMode(true);
                  }}
                >
                  Edit Profile
                </Button>
              </Box>
            )}
          </Grid>
          <Grid item xs={9}>
            <Tabs
              textColor="inherit"
              variant="fullWidth"
              TabIndicatorProps={{
                style: {
                  backgroundColor: '#df4f35ea',
                },
              }}
              value={currentTab}
              onChange={handleTabChange}
            >
              <Tab label="Overview" />
              <Tab label="Reviews" />
              <Tab label="Saved Landlords" />
              {user.isLandlord && <Tab label="My Properties" />}
            </Tabs>
            {currentTab === 0 && (
              <div id="userDetails" style={{ marginTop: '15px', textAlign: 'center' }}>
                {user.description ? (
                  <span>{user.description}</span>
                ) : (
                  <span>
                    Welcome to Bike Friendly Landlord.<br></br>
                    Edit your profile, add a bio and explore!
                  </span>
                )}
              </div>
            )}
            {currentTab === 1 && (
              <div>
                {addReview ? (
                  <Box
                    sx={{
                      minWidth: 120,
                    }}
                  >
                    <FormControl size="small">
                      <InputLabel id="landlord-select-label" sx={{marginTop:'10px'}}> 
                        Select Landlord
                      </InputLabel>
                      <Select
                        MenuProps={{ sx: { '&& .MuiPaper-root': { backgroundColor: 'lightgrey' }}}}
                        sx={{ minWidth: '160px',marginTop: 1.5 ,marginBottom: 1}}
                        labelId="landlord-select-label"
                        id="landlord-select"
                        value={selectedLandlord}
                        label="landlords"
                        onChange={handleChange}
                      >
                        {' '}
                        <MenuItem
                          value={''}
                          sx={{ display: 'block', bgcolor: 'white' }}
                        />
                        {landLords.map((element, index) => (
                          // TODO: .MuiButtonBase-root is setting display: inline-flex on the menu items
                          <MenuItem
                            key={index}
                            value={element._id}
                            sx={{ display: 'block', bgcolor: 'white' }}
                          >
                            {element.first_name} {element.last_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <Button
                      variant="contained"
                      style={{
                        marginTop: 12,
                        marginBottom: 10,
                        marginLeft: 10,
                      }}
                      //  onClick={handleReview} need to select landlord id and send to review page
                      onClick={handleReview}
                    >
                      Create Review
                    </Button>
                  </Box>
                ) : (
                  <Box>
                    {/* adding review button that opens to select which landlord to add review */}

                    <Button
                      variant="contained"
                      style={{
                        width: '20%',
                        backgroundColor: 'tomato',
                        color: 'white',
                        marginTop: 12,
                        marginBottom: 10,
                      }}
                      onClick={() => {
                        setAddReview(true);
                      }}
                    >
                      Add Review
                    </Button>
                  </Box>
                )}
                {reviews.length === 0 && (
                  <h3
                    style={{
                      textAlign: 'center',
                      marginTop: '2em',
                    }}
                  >
                    You have no reviews yet
                  </h3>
                )}
                {reviews.map((review, index) => {
                  return (
                    <Review
                      username={user.username}
                      _id={review._id}
                      title={review.title}
                      overall_rating={review.overall_rating}
                      respect_rating={review.respect_rating}
                      responsiveness_rating={review.responsiveness_rating}
                      bike_rating={review.bike_rating}
                      pet_friendly_rating={review.pet_friendly}
                      description={review.description}
                      key={index}
                      onSave={onReviewSave}
                      onDelete={onReviewDelete}
                    />
                  );
                })}
              </div>
            )}
            {currentTab === 2 && (
              <div
                style={{
                  marginTop: '50px',
                  textAlign: 'center',
                }}
              >
                <h3> You don&apos;t have any saved landlords yet</h3>
              </div>
            )}
            {currentTab === 3 &&
              <PropertiesList properties={properties} toggleAvailability={toggleAvailability} />}
          </Grid>
        </Grid>
      </Typography>
    </div>
  );
}
