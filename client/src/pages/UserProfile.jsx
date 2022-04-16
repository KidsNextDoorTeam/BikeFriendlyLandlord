import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import { Review } from '../components/Review.jsx';

import '../index.css'

export function UserProfile(props) {
  const { userData, setUserData, setIsLoggedIn, setAuthDisplay } = props;
  const [reviews, setReviews] = useState([]);
  const [currentTab, setCurrentTab] = useState(0);
  let navigate = useNavigate();
  // let [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    // fetch('/auth/check', {
    //   method: 'POST',
    // })
    //   .then((res) => {
    //     if (res.status === 401) {
    //       setIsLoggedIn(false);
    //       setAuthDisplay(true);
    //       navigate('/');
    //     }
    //   })
    //   .catch((err) => {
    //     console.log('Error check login -->', err);
    //   });
    if (userData._id) {
      fetch(`/reviews/${userData._id}`)
        .then((res) => {
          // if the user is not authenticated, navigate them back to the hamepage and prompt them to login
          if (res.status === 401) {
            setIsLoggedIn(false);
            setAuthDisplay(true);
            navigate('/');
          } else {
            return res.json();
          }
        })
        .then((json) => {
          setReviews(json.reviews);
        })
        .catch((err) => {
          console.log('Error fenching users reviews -->', err);
        });
    }
  }, [userData]);

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
      <h1 id="userProfileTitle" style={{}}>Your Account</h1>
      <h2> Hello {userData.full_name + ","}</h2>
      <Box sx={{ marginTop: '20px', marginBottom: '25px'}}>
      <Tabs textColor="inherit" TabIndicatorProps={{style: { backgroundColor: "#D97D54" }}} value={currentTab} onChange={handleTabChange}>
        <Tab label="Profile" />
        <Tab label="Reviews" />
        <Tab label="Saved Landlords" />
      </Tabs>
      </Box>
     {currentTab === 1 &&
     <div>
        <h4>Your Reviews</h4>
        {reviews.map((review, index) => {
          return <Review
            userData={userData}
            username={review.username}
            title={review.title}
            overall_rating={review.overall_rating}
            respect_rating={review.respect_rating}
            responsiveness_rating={review.responsiveness_rating}
            bike_rating={review.bike_rating}
            pet_friendly_rating={review.pet_friendly}
            description={review.description}
            key={index}
          />;
        })}
      </div> }
      </Typography>
    </div> 
  );
}
