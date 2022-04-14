const db = require('../models/BFLL.js');
const AppError = require('../util/AppError');

const reviewsController = {};

reviewsController.addReview = async (req, res, next) => {
  const { landlordId } = req.params;
  const {
    title,
    overall_rating,
    respect_rating,
    responsiveness_rating,
    bike_friendly,
    pet_friendly,
    description,
    user_id,
  } = req.body;

  // Start a transaction so that we can also update total landlord review scores
  const client = await db.connect();
  const insertQuery = {
    text: `
        INSERT INTO reviews (title, overall_rating, respect_rating, responsiveness_rating, 
        bike_friendly, pet_friendly, description, user_id, landlord_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING _id;
    `,
    values: [
      title, overall_rating, respect_rating, responsiveness_rating,
      bike_friendly, pet_friendly, description, user_id, landlordId,
    ],
  };

  try {
    await client.query('BEGIN');
    const { rowCount } = await db.query(insertQuery);

    if (rowCount === 0) {
      throw new Error('Failed to add review');
    }

    // Update landlord respect and responsiveness review totals. 
    // Update overall_rating to be the average of these two
    const updateRatingsQuery = {
      text: `UPDATE landlords l SET 
      respect_rating = (SELECT ROUND(AVG(respect_rating)::numeric, 2) from reviews where landlord_id = $1),
      responsiveness_rating = (SELECT ROUND(AVG(responsiveness_rating)::numeric, 2) from reviews where landlord_id = $1),
      overall_rating = (SELECT ROUND(AVG(overall_rating)::numeric, 2) from reviews where landlord_id = $1),
      bike_friendly = (
        (SELECT COUNT(*) from reviews where landlord_id = $1 AND bike_friendly = true) > 
        ((SELECT COUNT(*) from reviews where landlord_id = $1) / 2) 
        ), 
      pet_friendly = (
        (SELECT COUNT(*) from reviews where landlord_id = $1 AND pet_friendly = true) > 
        ((SELECT COUNT(*) from reviews where landlord_id = $1) / 2) 
        ) 
      WHERE l._id = $1`,
      values: [landlordId]
    };

    await client.query(updateRatingsQuery);

    await client.query('COMMIT');
    return next();
  } catch (error) {
    await client.query('ROLLBACK');
    return next(new AppError(error, 'reviewsController', 'addReview', 500));
  } finally {
    client.release();
  }
};

reviewsController.getReviewById = async (req, res, next) => {
  try {
    const { reviewId } = req.params;

    const query = 'SELECT * FROM reviews WHERE _id = $1;';

    const { rows: [review] } = await db.query(query, [reviewId]);
    res.locals.review = review;
    next();
  } catch (error) {
    return next(new AppError(error, 'reviewsController', 'getReviews', 500));
  }
};

reviewsController.getAllReviews = async (req, res, next) => {
  // TODO: Support query strings to filter/sort results
  const query = 'SELECT * FROM reviews;';

  try {
    const result = await db.query(query);
    res.locals.reviews = result.rows;
    return next();
  } catch (error) {
    return next(new AppError(error, 'reviewsController', 'getReviews', 500));
  }
};

reviewsController.updateReview = async (req, res, next) => {
  // TODO: Add utilcontroller to allow updates of any fields. 
  const { reviewId } = req.params;
  const { title, description } = req.body;

  const queryString = 'UPDATE reviews SET title = $2, description = $3 WHERE _id = $1;';

  try {
    await db.query(queryString, [reviewId, title, description]);

    return next();
  } catch (error) {
    return next(new AppError(error, 'reviewsController', 'updateReview', 500));
  }
};

reviewsController.deleteReview = async (req, res, next) => {
  const { reviewId } = req.params;
  const queryString = 'DELETE FROM reviews WHERE _id = $1 RETURNING landlord_id;';
  const client = await db.connect();

  try {
    await client.query('BEGIN');
    const { rows: [landlord] } = await client.query(queryString, [reviewId]);
    console.log(landlord);
    // Landlord is bike friendly if at least half of their reviews indicate they are bike friendly
    const updateRatingsQuery = {
      text: `UPDATE landlords l SET 
      respect_rating = (SELECT ROUND(AVG(respect_rating)::numeric, 2) from reviews where landlord_id = $1),
      responsiveness_rating = (SELECT ROUND(AVG(responsiveness_rating)::numeric, 2) from reviews where landlord_id = $1),
      overall_rating = (SELECT ROUND(AVG(overall_rating)::numeric, 2) from reviews where landlord_id = $1),
      bike_friendly = (
        (SELECT COUNT(*) from reviews where landlord_id = $1 AND bike_friendly = true) > 
        ((SELECT COUNT(*) from reviews where landlord_id = $1) / 2) 
        ), 
      pet_friendly = (
        (SELECT COUNT(*) from reviews where landlord_id = $1 AND pet_friendly = true) > 
        ((SELECT COUNT(*) from reviews where landlord_id = $1) / 2) 
        ) 
      WHERE l._id = $1`,
      values: [landlord.landlord_id]
    };

    await client.query(updateRatingsQuery);
    await client.query('COMMIT');
    return next();
  } catch (error) {
    await client.query('ROLLBACK');
    return next(new AppError(error, 'reviewsController', 'deleteReview', 500));
  } finally {
    client.release();
  }
};

module.exports = reviewsController;
