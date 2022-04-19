const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const AppError = require('./util/AppError');

const sessionController = require('./controllers/sessionController');
const landlordRouter = require('./routes/landlord.js');
const reviewsRouter = require('./routes/reviews.js');
const authRouter = require('./routes/auth.js');
const propertiesRouter = require('./routes/properties.js');
const userRouter = require('./routes/user.js');
// const chatRouter = require('./routes/chat.js');

const app = express();
dotenv.config({ path: path.resolve(__dirname, '../.env') });
const PORT = 3000;

/** 
 * Parse the body and cookies on all http requests
 * */
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(cors());

/** 
 * serve static filse from assets and build folder 
 * */
app.use('/build', express.static(path.join(__dirname, '../build')));
app.use('/images', express.static(path.resolve(__dirname, './images')));


/**
 *  Direct request to appropriate router files
 * */
app.use('/landlords', landlordRouter);
app.use('/reviews', reviewsRouter);
app.use('/auth', authRouter);
app.use('/properties', propertiesRouter);
app.use('/user', userRouter);
// app.use('/chat', chatRouter);

/** 
 *  Serve the home/login-signup page and the main app on these routes 
 * */
app.get('/app', sessionController.checkSession, (req, res) => {
  res.setHeader('Content-Type', 'text/html').sendFile(path.join(__dirname, '../build/app.html'));
});

// catch all handler to send request back to client side to allow refreshes when using react router
app.get('/*', (req, res) => {
  return res.setHeader('Content-Type', 'text/html').sendFile(path.join(__dirname, '../client/public/index.html'));
});

app.use((req, res) => {
  console.log(`Error 404: Bad Request: ${req.method} ${req.url}`);
  return res.sendStatus(404);
})
/** 
 * global error handler 
 * */
app.use((err, req, res, next) => {
  if (!(err instanceof AppError)) return next(err);

  const defaultErr = {
    serverLog: 'Express err handler caught an unknown middleware error',
    status: 500,
    messagE: 'An unkown error occurred'
  };

  const errObj = Object.assign(defaultErr, err);

  console.error(errObj.serverLog, err);

  return res.status(errObj.status).json(errObj.message);

});


// start server
app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

module.exports = app;
