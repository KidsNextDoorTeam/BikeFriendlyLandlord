const authController = {};

authController.isAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.sendStatus(401);
  }
  return next();
};

module.exports = authController;