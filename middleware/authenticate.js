// authentication.js

// Middleware function to check if the user is authenticated
function authenticate(req, res, next) {
    if (req.session && req.session.user) {
      // User is authenticated, proceed to the next middleware or route handler
      next();
    } else {
      // User is not authenticated, redirect to the login page or send an error response
      res.status(401).json({ error: "Unauthorized" });
    }
  }
  
  module.exports = authenticate;
  