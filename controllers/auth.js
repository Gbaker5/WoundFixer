const jwt = require("jsonwebtoken")
const passport = require("passport");
const bcrypt = require("bcryptjs")
const validator = require("validator");
const User = require("../models/User");
const axios = require("axios")


///LOGIN
exports.getLogin = (req, res) => {
  if (req.user) {
    return res.redirect("/profile");
  }
  res.render("login", {
    title: "Login",
  });
};

///LOGIN
exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;

  // ✅ 1. Normalize and validate email
  const normalizedEmail = validator.normalizeEmail(email, {
    gmail_remove_dots: false,
  });

  if (!validator.isEmail(normalizedEmail)) {
    return res.status(400).json({ message: "Invalid email address" });
  }

  try {
    // ✅ 2. Find user by email
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // ✅ 3. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // ✅ 4. Create and send JWT
    const payload = {
      user: {
        id: user._id,
        role: user.role, // if you're using role-based access
        userName: user.userName,
        email: user.email,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h", // or "7d", depending on your preference
    });

     // Set token as an HTTP-only cookie
     res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000, // 1 hour
    });

    // Redirect to profile
    res.redirect("/profile");
  } catch (err) {
    next(err);
  }
};

///LOGOUT
exports.logout = (req, res) => {
  res.clearCookie("token")
    console.log('User has logged out.')
  
 //req.session.destroy((err) => {
 //  if (err)
 //    console.log("Error : Failed to destroy the session during logout.", err);
 //  req.user = null;
    res.redirect("/");
  
};

///SIGNUP
exports.getSignup = (req, res) => {
  if (req.user) {
    return res.redirect("/profile");
  }
  res.render("signup", {
    title: "Create Account",
  });
};

///SIGNUP
exports.postSignup = async (req, res, next) => {
  //check for validation errors first
  const validationErrors = [];
  if (!validator.isEmail(req.body.email))
    validationErrors.push({ msg: "Please enter a valid email address." });
  if (!validator.isLength(req.body.password, { min: 8 }))
    validationErrors.push({
      msg: "Password must be at least 8 characters long",
    });
  if (req.body.password !== req.body.confirmPassword)
    validationErrors.push({ msg: "Passwords do not match" });

  if (validationErrors.length) {
    req.flash("errors", validationErrors);
    return res.redirect("../signup");
  }
  

  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  // Check for existing user first

  //User.findOne(
  //  { $or: [{ email: req.body.email }, { userName: req.body.userName }] },
  //  async (err, existingUser) => {
  //    if (err) return next(err);
//
  //    if (existingUser) {
  //      req.flash("errors", {
  //        msg: "Account with that email address or username already exists.",
  //      });
  //      return res.redirect("../signup");
  //    }
  try {
  const existingUser = await User.findOne({
    $or: [{ email: req.body.email }, { userName: req.body.userName }],
  });

  if (existingUser) {
    req.flash("errors", {
      msg: "Account with that email address or username already exists.",
    });
    return res.redirect("../signup");
  }

      
        // 🔒 Hash the password before saving
        const hashedPassword = await bcrypt.hash(req.body.password, 12);

        const user = new User({
          userName: req.body.userName,
          email: req.body.email,
          password: hashedPassword,
          //role is default 'user'
        });

        await user.save();

        // ✅ 5. Create and send JWT token
        const payload = {
          user: {
            id: user._id,
            role: user.role,
            email: user.email,
            userName: user.userName,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000, // 1 hour
    });

    console.log(`✅ New user "${user.userName}" created and JWT token sent`);

    return res.redirect("/profile");
  } catch (err) {
    return next(err);
  }
};

