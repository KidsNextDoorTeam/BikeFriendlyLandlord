const db = require('../models/BFLL.js');
const AppError = require('../util/AppError');

const landlordController = {};

landlordController.getById = async (req, res, next) => {
  const landlordQuery = {
    text: `SELECT l.*, u.first_name, u.last_name, u.username, u.email, u.description, u.profile_pic 
    FROM landlords l LEFT JOIN users u ON u._id = l._id WHERE l._id = $1`,
    values: [req.params.landlordId]
  };

  const propertiesQuery = {
    text: 'SELECT * FROM properties WHERE landlord_id = $1 ORDER BY _id;',
    values: [req.params.landlordId]
  };

  const reviewsQuery = {
    text: `SELECT r._id, r.title, u.username, r.overall_rating, r.respect_rating, r.responsiveness_rating, 
    r.description, r.user_id, r.created_at, r.pet_friendly, bike_friendly FROM reviews r LEFT JOIN users u ON u._id = r.user_id WHERE r.landlord_id = $1;`,
    values: [req.params.landlordId],
  };

  try {
    const { rows: [landlord] } = await db.query(landlordQuery);
    const { rows: properties } = await db.query(propertiesQuery);
    const { rows: reviews } = await db.query(reviewsQuery);

    res.locals.landlord = {
      ...landlord,
      reviews,
      properties,
    };

    return next();
  } catch (error) {
    return next(new AppError(error, 'landlordController', 'getById', 500));
  }
};

landlordController.getAllLandlords = async (req, res, next) => {
  const landlordQuery = `SELECT l.*, u.first_name, u.last_name, u.username, u.email, u.profile_pic 
    FROM landlords l LEFT JOIN users u ON u._id = l._id;`;

  // TODO: Do we want to send review and property information here? 

  try {
    const { rows: landlords } = await db.query(landlordQuery);
    res.locals.landlords = landlords;
    return next();
  } catch (error) {
    return next(new AppError(error, 'landlordController', 'getAllLandlords', 500));
  }
};

// TODO: Make this generic
landlordController.getTopFour = async (req, res, next) => {
  // Reformatted join to account for landlords with multiple properties
  // before if a top landlord had multiple properties they would appear twice in the list
  const queryString = `
  SELECT l.*, p.city, p.state, u.first_name, u.last_name, u.profile_pic FROM landlords l 
    LEFT JOIN (
      SELECT DISTINCT ON (landlord_id) landlord_id, city, state FROM properties
    ) p 
	  ON l._id = p.landlord_id
	  LEFT JOIN users u ON u._id = l._id
    where l.overall_rating != 'NaN'
    ORDER BY l.overall_rating desc
    LIMIT 4; `;

  try {
    const results = await db.query(queryString);
    res.locals.topLandlords = results.rows;
    return next();
  } catch (error) {
    return next(new AppError(error, 'landlordController', 'getTopFour', 500));
  }
};


// TODO: How is this info being used? Can the same be accomplished by searching properties and sending 
// landlord ids with it?
landlordController.searchLandlords = async (req, res, next) => {
  const { city, bike_friendly = true, pet_friendly = true } = req.body;
  const queryString = {
    text: `
    SELECT l.* , 
    p.street_num, p.street, p.city, p.state, p.zip_code, 
    u.first_name, u.last_name, u.profile_pic FROM landlords l
    INNER JOIN (
      SELECT DISTINCT ON (landlord_id) landlord_id, street_num, street, city, state, zip_code FROM properties
      WHERE city = $1
    ) p 
    ON p.landlord_id = l._id
    LEFT JOIN users u ON u._id = l._id
    ${bike_friendly || pet_friendly ? 'WHERE' : ''}
    ${bike_friendly ? 'bike_friendly = true' : ''}
    ${bike_friendly && pet_friendly ? 'AND' : ''}
    ${pet_friendly ? 'pet_friendly = true' : ''}
    ;`,
    values: [city]
  };

  try {
    const { rows: landlordData } = await db.query(queryString);

    res.locals.landlords = landlordData;
    return next();
  } catch (error) {
    return next(new AppError(error, 'landlordController', 'searchLandlords', 500));
  }
};


/**
 * Adds existing users as landlords
 * @requires userId to exist in re
 */
landlordController.addLandlord = async (req, res, next) => {
  // New landlords do not have a rating and are unverfied by default
  // we just need to know pet and bike friendliness
  const { userId, } = req.params;
  const { bike_friendly = true, pet_friendly = true } = req.body;

  const userQuery = {
    text: 'SELECT count(*) from users where _id = $1;',
    values: [userId]
  };

  try {

    const { rows: [result] } = await db.query(userQuery);
    if (result === 0) {
      return res.status(404).send(`User: ${userId} not found`);
    }

    const landlordQuery = {
      text: 'INSERT INTO landlords (_id, pet_friendly, bike_friendly) VALUES ($1, $2, $3)',
      values: [userId, pet_friendly, bike_friendly],
    };

    await db.query(landlordQuery);
    return next();
  } catch (error) {
    return next(new AppError(error, 'landlordController', 'addLandlord', 500));
  }


};

module.exports = landlordController;
