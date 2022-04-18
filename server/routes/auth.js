const express = require('express');
const passport = require('passport');

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

// post -> login
router.post(
  '/login',
  passport.authenticate('local'),
  (req, res) => {
    return res.status(200).json({ user: req.user });
  }
);

// post -> signup
router.post(
  '/signup',
  userController.createUser,
  (req, res) => {
    req.login(res.locals.user, (err) => {
      // log the error only. the user will need to login but registration did not fail
      if (err) console.log('Failed to login after signup.', err);
      return res.status(200).json({ user: res.locals.user });
    });
  }
);

router.post('/logout', (req, res) => {
  req.logout(); // passport logout
  return res.status(200).send();
});

// Send back information about the logged in user if they are currently authenticated. 
router.get('/', authController.isAuthenticated, (req, res) => {
  // passport creates a user object on the request if they are currently logged in. 
  return res.status(200).json({ user: req.user });
});

module.exports = router;

