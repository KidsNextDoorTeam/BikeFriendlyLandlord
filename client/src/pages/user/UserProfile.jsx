import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Review } from "../../components/Review.jsx";
import "./userprofile.css";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import AddIcon from '@mui/icons-material/Add';

export function UserProfile(props) {
  const { userData, setUserData, setIsLoggedIn, setAuthDisplay } = props;
  const [reviews, setReviews] = useState([]);
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
            navigate("/");
          } else {
            return res.json();
          }
        })
        .then((json) => {
          setReviews(json.reviews);
        })
        .catch((err) => {
          console.log("Error fenching users reviews -->", err);
        });
    }
  }, [userData]);

  return (
    <div id="userProfile">
      <h1 id="userProfileTitle">Your Account</h1>
      <h2>
        Hello {userData.full_name}
        {","}
      </h2>
      <div>
        <h3>Your Reviews</h3>

        <Button variant="contained" margin-bottom= "5px">Add Review<AddIcon></AddIcon></Button>

        {reviews.map((review, index) => {
          return (
            <Review
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
            />
          );
        })}
      </div>
    </div>
  );
}
