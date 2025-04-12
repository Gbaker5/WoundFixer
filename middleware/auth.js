const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Adjust path as needed
const  JWT_SECRET = process.env.JWT_SECRET; // Store secret in environment variables





module.exports = {
  ensureAuth: (req, res, next) => {
    const token = req.cookies.token;

  if (!token) {
    //return res.status(401).redirect("/login"); // or show a flash error
    return res.status(401).json({message:"no token"})
  }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded.user; // attach the payload
      next();
    } catch (err) {
      res.status(401).json({ message: "Token is not valid" });
    }
  }, 

  // Ensure the user is a guest (not logged in)
  ensureGuest: function (req, res, next) {
    const token = req.headers["authorization"] || req.cookies.token;

    if (token) {
      // If there's a token, try to verify it
      jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (!err && decoded) {
          return res.redirect("/dashboard"); // Already logged in, redirect to dashboard
        }
      });
    }

    return next();
  },

  // Add more roles or other functionality as needed...
};


//module.exports = {
//  ensureAuth: function (req, res, next) {
//    if (req.isAuthenticated()) {
//      return next();
//    } else {
//      res.redirect("/");
//    }
//  },
//  ensureGuest: function (req, res, next) {
//    if (!req.isAuthenticated()) {
//      return next();
//    } else {
//      res.redirect("/dashboard");
//    }
//  },
//  //roles
//};
