import React from "react";
import HomeCard from "./HomeCard.jsx";
import "../index.css";

export default function homeCards({topFour}) {
  return (
    <div className="homeCardsWrapper">
      <div className="homeCards" data-aos="fade-up" data-aos-duration="1000" id="homeCards">
        {topFour.map((landlordObj, index) => <HomeCard landlord={landlordObj} key={index}/>)}
      </div>
      <div className="homeCardsUserFeedbackWrapper" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="250">
        <div className="homeCardsUserFeedback">
          <p className="feedbackDesc">
            I found the perfect place for my family and our bikes in record
            time!
          </p>
          <p className="feedbackUser">- Michael Snyder</p>
        </div>
        <div className="homeCardsUserFeedback">
          <p className="feedbackDesc">
            I can't believe I finally found a way to search for bike-friendliness AHEAD OF TIME! What an amazing resource!
          </p>
          <p className="feedbackUser">- Evan McNeely</p>
        </div>
      </div>
    </div>
  );
}
