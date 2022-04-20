const path = require('path');

const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

const session = require('express-session');
const SQLLiteStore = require('connect-sqlite3')(session);

const passport = require('passport');
require('./auth/passport')(passport);

const AppError = require('./util/AppError');
const SqlError = require('./util/SqlError');
const authRouter = require('./routes/auth.js');
const landlordRouter = require('./routes/landlord.js');
const reviewsRouter = require('./routes/reviews.js');
const propertiesRouter = require('./routes/properties.js');
const userRouter = require('./routes/user.js');

const app = express();
const PORT = 3000;

/** 
 * Parse the body and cookies on all http requests
 * */
app.use(express.json());
app.use(cors());
app.use(cookieParser());

/** 
 * serve static filse from assets and build folder 
 * */
app.use('/build', express.static(path.join(__dirname, '../build')));
app.use('/images', express.static(path.resolve(__dirname, './images')));

// Configure session
app.use(session({
  // TODO: Expire these sessions
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: new SQLLiteStore({ db: 'server/data/sessions.db' })
}));

app.use(passport.authenticate('session'));

// Adds a serialized user object to the request. So when user authenticates we can use the data 
// in route handlers
app.use(passport.initialize());
app.use(passport.session());

/**
   *  Direct request to appropriate router files
   * */
app.use('/auth', authRouter);
app.use('/landlords', landlordRouter);
app.use('/reviews', reviewsRouter);
app.use('/properties', propertiesRouter);
app.use('/user', userRouter);

/** 
   *  Serve the home/login-signup page and the main app on these routes 
   * */
app.get('/app', (req, res) => {
  res.setHeader('Content-Type', 'text/html').sendFile(path.join(__dirname, '../build/app.html'));
});

// catch all handler to send request back to client side to allow refreshes when using react router
app.get('/*', (req, res) => {
  return res.setHeader('Content-Type', 'text/html').sendFile(path.join(__dirname, '../client/public/index.html'));
});

app.use((req, res) => {
  console.log(`Error 404: Bad Request: ${req.method} ${req.url}`);
  return res.sendStatus(404);
});

/** 
   * global error handler 
   * */
app.use((err, req, res, next) => {
  if (!(err instanceof AppError) && !(err instanceof SqlError)) return next(err);
  const defaultErr = {
    serverLog: 'Express err handler caught an unknown middleware error',
    status: 500,
    message: 'An unkown error occurred'
  };
  const errObj = Object.assign(defaultErr, err);

  console.error(errObj.serverLog, err);

  return res.status(errObj.status).json(errObj.msg);

});


// start server
app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

module.exports = app;
