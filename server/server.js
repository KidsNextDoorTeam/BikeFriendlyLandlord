const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');

const sessionController = require('./controllers/sessionController');
const apiRouter = require('./routes/api.js');
const landlordRouter = require('./routes/landlord.js');
const reviewsRouter = require('./routes/reviews.js');

const app = express();
const PORT = 3000;

/** 
 * Parse the body and cookies on all http requests
 * */
app.use(express.json());
app.use(cookieParser());

/** 
 * serve static filse from assets and build folder 
 * */
app.use('/build', express.static(path.join(__dirname, '../build')));


/**
 *  Direct request to appropriate router files
 * */
app.use('/api', apiRouter);
app.use('/landlords', landlordRouter);
app.use('/reviews', reviewsRouter);

/** 
 *  Serve the home/login-signup page and the main app on these routes 
 * */
app.get('/app', sessionController.checkSession, (req, res) => {
  res.setHeader("Content-Type", "text/html").sendFile(path.join(__dirname, '../build/app.html'));
});
app.get('/', (req, res) => {
  return res.setHeader("Content-Type", "text/html").sendFile(path.join(__dirname, '../build/index.html'));
});

/** 
 * Catch all  route handler 
 * */
app.use('*', (req, res) => {
  return res.status(404).send('Error');
});

/** 
 * global error handler 
 * */
app.use((err, req, res, next) => {
  const defaultError = {
    log: 'Express error handler caught unknown middleware error',
    status: 400,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign(defaultError, err);
  console.log(`Error: ${errorObj.log}`);
  return res.status(errorObj.status).send(JSON.stringify(errorObj.message));
});


// start server
app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

module.exports = app;
