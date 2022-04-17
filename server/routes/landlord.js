const express = require('express');

const router = express.Router();

const landlordController = require('../controllers/landlordController.js');
const authController = require('../controllers/authController');

router.get('/', landlordController.getAllLandlords, (req, res) => {
  return res.json({ landlords: res.locals.landlords });
});

router.get('/topFour', landlordController.getTopFour, (req, res) => {
  return res.json({ landlords: res.locals.topLandlords });
});

router.get('/:landlordId', landlordController.getById, (req, res) => {
  return res.json({ landlord: res.locals.landlord });
});

router.post('/search', landlordController.searchLandlords, (req, res) => {
  return res.json({ landlords: res.locals.landlords });
});

router.post('/:userId', authController.isAuthenticated, landlordController.addLandlord, (req, res) => {
  res.status(200).send('Successfully set user as landlord');
});
module.exports = router;
