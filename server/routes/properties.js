const express = require('express');
const propertiesController = require('../controllers/propertiesController.js');

const router = express.Router();

router.get('/', propertiesController.getAllProperties, (req, res) => {
  return res.status(200).json({ properties: res.locals.properties });
});

router.get('/uniqueCities', propertiesController.getUniqueCities, (req, res) => {
  return res.json({ cities: res.locals.cities });
});


router.get('/:propertyId', propertiesController.getProperty, (req, res) => {
  return res.status(200).json({ property: res.locals.property });
});

router.post('/',
  propertiesController.geocodeAddress,
  propertiesController.addProperty,
  (req, res) => {
    return res.status(200).json({ property: res.locals.property });
  }
);

module.exports = router;