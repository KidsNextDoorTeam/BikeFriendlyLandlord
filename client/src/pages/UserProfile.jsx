import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Review } from '../components/Review.jsx';

import '../index.css';

export function UserProfile(props) {
  const { userData, setUserData, setIsLoggedIn, setAuthDisplay } = props;
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();
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

  return (
    <div id="userProfile">
      <h1 id="userProfileTitle">Your Account</h1>
      <h3>
        Hello {userData.first_name} {userData.last_name},
      </h3>
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
      </div>
    </div>
  );
}
