const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const db = require('../models/BFLL');
const bcrypt = require('bcryptjs');
const session = require('express-session');

const SQLLiteStore = require('connect-sqlite3')(session);

const userController = require('../controllers/userController');
const sessionController = require('../controllers/sessionController');

const router = express.Router();

router.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  store: new SQLLiteStore({ db: 'sessions.db' })
}));
router.use(passport.authenticate('session'));

// TODO: Move this to a config file
passport.use(new LocalStrategy(async (username, password, cb) => {
  try {
    const { rows: [user] } = await db.query('SELECT _id as id, password as hash, username, email FROM users where username = $1;', [username]);
    if (!user.id) {
      return cb(null, false, { message: 'Incorrect username or password' });
    }
    const match = await bcrypt.compare(password, user.hash);

    if (match) return cb(null, {
      id: user._id,
      username: user.username,
      email: user.email
    });

    return cb(null, false, { message: 'Incorrect username or password' });
  } catch (error) {
    console.log('ERROR: Could not find user when creating a passport strategy');
    return cb(error);
  }

}));

passport.serializeUser((user, done) => {
  console.log('user', user);
  process.nextTick(() => {
    done(null, user);
  });
});

passport.deserializeUser((user, cb) => {
  console.log('deserialize');
  process.nextTick(() => {
    try {
      // const { rows: [{ id, hash, username }] } = await db.query('SELECT _id as id, password as hash FROM users where id = $1;', [id]);
      // cb(null, { id, username, password: hash });
      cb(null, user);
    } catch (error) {
      console.log('error deserializing');
      return cb(error);
    }
  });
});


// Adds a serialized user object to the request. So when user authenticates we can use the data 
// in route handlers
router.use(passport.initialize());
router.use(passport.session());


// post -> login
router.post(
  '/login',
  // userController.verifyUser,
  passport.authenticate('local'),
  // sessionController.startSession,
  (req, res) => {
    const response = res.locals.user;
    res.status(200).json(response);
  }
);

// post -> signup
router.post(
  '/signup',
  userController.createUser,
  sessionController.startSession,
  (req, res) => {
    const response = res.locals.user;
    res.status(200).json(response);
  }
);

// post -> logout
router.post(
  '/logout',
  sessionController.endSession,
  (req, res) => {
    res.status(200).send();
  }
);

// just if the user is logged in
router.post('/check', sessionController.checkSession, (req, res) => {
  res.sendStatus(200);
});

module.exports = router;

