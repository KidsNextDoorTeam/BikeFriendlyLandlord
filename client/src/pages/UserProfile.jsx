import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Review } from '../components/Review.jsx';
import UserContext from '../hooks/userContext.js';

import axios from 'axios';

export default function UserProfile() {
  const { user } = useContext(UserContext);

  const [reviews, setReviews] = useState([]);
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
      if (err?.repsonse?.status === 401) {
        navigate('/');
      } else {
        console.error('Error fetching users reviews -->', err);
      }
    }
  };

  useEffect(() => {
    getReviews();
    return () => () => mounted.current = false;
  }, [user]);

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
        Hello {user.first_name} {user.last_name},
      </h3>
      <div>
        <h4>Your Reviews</h4>
        {reviews?.map((review, index) => {
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
      </div>
    </div>
  );
}
