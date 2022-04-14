const db = require('../models/BFLL.js');
const AppError = require('../util/AppError');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));


const propertiesController = {};

/**
 * @requires latitude to exist on res.locals
 * @requires longitude to exist on res.locals
 * Stores new property on res.locals
 */
propertiesController.addProperty = async (req, res, next) => {
  const { street_num, street, city, state, zip_code, landlord_id } = req.body;
  const query = {
    text: `INSERT INTO properties (street_num, street, city, state, zip_code, landlord_id, latitude, longitude) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;`,
    values: [street_num, street, city, state, zip_code, landlord_id, res.locals.latitude, res.locals.longitude]
  };

  try {
    const { rowCount, rows: [newProperty] } = await db.query(query);

    if (rowCount === 0) {
      return next(new AppError(new Error('Property failed to save for unknown reason'), 'propertiesController', addProperty));
    }

    res.locals.property = { ...newProperty };

    return next();

  } catch (error) {
    return next(new AppError(error, 'propertiesController', 'addProperty'));
  }
};

propertiesController.getAllProperties = async (req, res, next) => {

  const query = `SELECT p.*, u.first_name as landlord_first_name, u.last_name as landlord_last_name 
    FROM properties p
    LEFT JOIN users u ON u._id = p.landlord_id`;


  try {
    const { rows } = await db.query(query);

    res.locals.properties = rows;
    return next();
  } catch (error) {
    return next(new AppError(error, 'propertiesController', 'getProperty', 500));
  }

};

propertiesController.getProperty = async (req, res, next) => {
  const query = {
    text: `SELECT p.*, u.first_name as landlord_first_name, u.last_name as landlord_last_name 
    FROM properties p
    LEFT JOIN users u ON u._id = p.landlord_id
    WHERE p._id = $1;`,
    values: [req.params.propertyId]
  };


  try {
    const { rowCount, rows: [property] } = await db.query(query);

    if (rowCount === 0) {
      return res.sendStatus(404);
    }

    res.locals.property = { ...property };
    return next();
  } catch (error) {
    return next(new AppError(error, 'propertiesController', 'getProperty', 500));
  }
};

/**
 * Stores an array of unique cities on res.locals.cities
 */
propertiesController.getUniqueCities = async (req, res, next) => {
  const queryString = 'SELECT DISTINCT city FROM properties;';

  try {
    const results = await db.query(queryString);
    res.locals.cities = results.rows.map(el => el.city);
    return next();
  } catch (error) {
    return next(new AppError(error, 'propertiesController', 'getUniqueCities', 500));
  }
};

propertiesController.geocodeAddress = async (req, res, next) => {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=
            ${req.body.street_num}
            +${req.body.street.replaceAll(' ', '+')},
            +${req.body.city.replaceAll(' ', '+')},
            +${req.body.state}&key=${process.env.GOOGLE_API_KEY}`
  );
  const geoCode = await response.json();
  // strip coordinates off the response from google
  [res.locals.latitude, res.locals.longitude] = [
    geoCode.results[0].geometry.location.lat,
    geoCode.results[0].geometry.location.lng,
  ];


  return next();
};



module.exports = propertiesController;