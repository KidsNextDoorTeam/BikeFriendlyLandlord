import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Avatar from '@mui/material/Avatar';
import { Button, Grid, TextField, Input } from '@material-ui/core';

import { Review } from '../components/Review';
import { stringAvatar } from '../common/styling.js';
import { useAuth } from '../hooks/authContext';

export default function UserProfile() {
  const {user, setUser } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [currentTab, setCurrentTab] = useState(0);
  const [updateMode, setUpdateMode] = useState(false);
  const [updateUser, setUpdateUser] = useState(false);

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
      if (status >= 200 && status < 300 && mounted.current) setReviews(data.reviews);
    } catch (err) {
      if (err?.response?.status === 401) {
        navigate('/');
      } else {
        console.error('Error fetching users reviews -->', err);
      }
    }
  };

  const getUserData = async () => {
    if (!user._id) {
      navigate('/'); // user needs to sign in
      return;
    }
    try {
      const result = await axios.get(`/user/${user._id}/getUser`);
      setUser(result.data);
    } catch (err) {
      if (err?.response?.status === 401) {
        navigate('/');
      } else {
        console.error('Error fetching user info -->', err);
      }
    }
  };


  useEffect(() => {
    getReviews();
    getUserData();
    return () => () => mounted.current = false;
  }, [updateUser]);

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
    setUpdateUser(false);
    axios.put(`/user/${user._id}/updateUserInfo`, {
      firstname:firstname,
      lastname:lastname,
      description: description, 
      email: email,
      profilePic: profilePic,
    }).then((response) => {
      if (response) {
        setUpdateUser(true);
      }
    });

  };

  return (
    <div
      id='userProfile'
      sx={{
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
      }}
    >
      <Typography variant='h6' component='div' style={{ fontFamily: 'Nunito' }}>
        <Grid container spacing={1}>
          <Grid item xs={3} >
            <div style={{ display: 'flex' }}>
              {user.profile_pic ?
                <Avatar
                  alt="User picture"
                  src={`/images/${user.profile_pic}`}
                  sx={{
                    width: 200,
                    height: 200,
                    minWidth: 20,
                    minHeight: 20,
                    my: 2.5,
                  }} />
                : <Avatar
                  alt="User picture"
                  {...stringAvatar(`${user.first_name} ${user.last_name}`)}
                />}
            </div>
            {updateMode ?
              <Box>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }} >
                  {/* TODO: Hanlde form updates and submission */}
                  <TextField
                    label='First Name'
                    variant='outlined'
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
                    label='Bio'
                    variant='outlined'
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
                    </Button><br></br>{profilePic}
                  </label>
                </div>
                <button
                  style={{
                    padding: '7px 15px',
                    borderRadius: '10px',
                    border: '1px solid tomato',
                    color: 'tomato',
                    backgroundColor: 'transparent',
                    marginRight: '10px',
                    cursor: 'pointer',
                    marginTop: '10px',
                  }}
                  onClick={() => {
                    setProfilePic('');
                    setUpdateMode(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  style={{
                    padding: '7px 15px',
                    borderRadius: '10px',
                    border: 'none',
                    color: 'white',
                    backgroundColor: 'tomato',
                    marginRight: '10px',
                    cursor: 'pointer',
                  }}
                  onClick={userProfileChange}
                >
                  Save
                </button>
              </Box > :
              <Box>
                <div style={{ marginBottom: '10px', color: '#333' }}>
                  <h2> {user.first_name} {user.last_name}</h2>
                  <span> {user.username} </span>
                </div>
                <Button
                  variant="contained"
                  style={{
                    width: '80%',
                    backgroundColor: 'tomato',
                    color: 'white'
                  }}
                  onClick={() => { setUpdateMode(true); }}
                >
                  Edit Profile
                </Button>
              </Box>
            }
          </Grid >
          <Grid item xs={9} >
            <Tabs
              textColor="inherit"
              variant="fullWidth"
              TabIndicatorProps={{
                style: {
                  backgroundColor: '#df4f35ea'
                }
              }}
              value={currentTab}
              onChange={handleTabChange}
            >
              <Tab label="Overview" />
              <Tab label="Reviews" />
              <Tab label="Saved Landlords" />
            </Tabs>
            {currentTab === 0 &&
              <div id="userDetails">
                {user.description
                  ? <span
                    style={{ marginTop: '2em' }}
                  >
                    {user.description}
                  </span>
                  : <span
                    style={{
                      textAlign: 'center',
                      marginTop: '2em'
                    }}
                  >
                    Welcome to Bike Friendly Landlord.<br></br>
                    Edit your profile, add a bio and explore!
                  </span>}
              </div>}
            {currentTab === 1 && <div>
              {reviews.length === 0 &&
                <h3
                  style={{
                    textAlign: 'center',
                    marginTop: '2em'
                  }}
                >
                  You have no reviews yet
                </h3>}
              {reviews.map((review, index) => {
                return <Review
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
                />;
              })}
            </div>}
            {currentTab === 2 &&
              <div
                style={{
                  marginTop: '50px',
                  textAlign: 'center'
                }}
              >
                <h3> You don&apos;t have any saved landlords yet</h3>
              </div>}
          </Grid>
        </Grid >
      </Typography >
    </div >
  );
}
