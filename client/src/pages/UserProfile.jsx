import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import axios from 'axios';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';


import { Review } from '../components/Review.jsx';

import '../index.css';

export function UserProfile(props) {
  const { userData, setUserData, setIsLoggedIn, setAuthDisplay } = props;
  const [reviews, setReviews] = useState([]);
  const [currentTab, setCurrentTab] = useState(0);
  let navigate = useNavigate();
  // let [searchParams, setSearchParams] = useSearchParams();
  const mounted = useRef(true);
  const getReviews = async () => {
    if (!userData._id) return;
    try {
      const { status, data } = await axios.get(`/user/${userData._id}/reviews`);
      if (status >= 200 && status < 300) {
        if (mounted.current)
          setReviews(data.reviews);
      }
      else if (status === 401) {
        // TODO: Move this to protected components
        // if the user is not authenticated, navigate them back to the hamepage and prompt them to login
        setIsLoggedIn(false);
        setAuthDisplay(true);
        navigate('/');
      }
    } catch (err) {
      console.error('Error fetching users reviews -->', err);
    }
  };

  useEffect(() => {
    getReviews();
    return () => () => mounted.current = false;
  }, [userData]);

  const onReviewDelete = () => {
    getReviews();
  };

  const onReviewSave = () => {
    getReviews();
  };

  const handleTabChange = (e, newValue) => {
    setCurrentTab(newValue);
  } 

  return (
    <div id="userProfile">
        <Typography
              variant="h6"
              component="div"
              style={{ fontFamily: 'Nunito' }}
        >
      <div style={{display:'flex'}}>
      <div>
      <h1 id="userProfileTitle">Your Account</h1>
      <h2> Hello {userData.first_name} {userData.last_name},</h2> </div>
      <div>
      <Avatar alt="User picture" src={`/images/${userData.profile_pic}`} sx={{ width: 56, height: 56 }}/>
      </div>
      </div>
      <Box sx={{ marginTop: '20px', marginBottom: '25px'}}>
      <Tabs textColor="inherit" TabIndicatorProps={{style: { backgroundColor: "#df4f35ea" }}} value={currentTab} onChange={handleTabChange}>
        <Tab label="Profile" />
        <Tab label="Reviews" />
        <Tab label="Saved Landlords" />
      </Tabs>
      </Box>
      {currentTab === 0 &&
      <Card sx={{ backgroundColor: 'rgba(0, 0, 0, 0.5)'}} >
      <div>
      <Box component="span" sx={{ display: 'block' }}>{userData.profile_pic}</Box>
      <Box component="span" sx={{ display: 'block' }}>First Name  {userData.first_name}</Box>
      <Box component="span" sx={{ display: 'block' }}>Last Name   {userData.last_name}</Box>
      <Box component="span" sx={{ display: 'block' }}>Username   {userData.username}</Box>
      <Box component="span" sx={{ display: 'block' }}>Email  {userData.email}</Box>
      <Box component="span" sx={{ display: 'block' }}>Description  {userData.description}</Box>
      </div> 
      </Card>}
     {currentTab === 1 &&
     <div>
        <h4>Your Reviews</h4>
        {reviews.map((review, index) => {
          return <Review
            userData={userData}
            username={userData.username}
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
      </div> }
      {currentTab === 2 &&
      <div>
      <h2> You don't have any saved landlords yet</h2>
      </div>}
      </Typography>
    </div> 
  );
}
