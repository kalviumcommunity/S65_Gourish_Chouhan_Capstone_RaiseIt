const express = require('express');
const { register, login } = require('../controllers/authController');
const passport = require("../config/passport");
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    // Redirect to frontend with JWT and user info as query params
    const { token, user } = req.user;
    const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
    res.redirect(
      `${clientUrl}/auth/google/success?token=${token}&name=${encodeURIComponent(
        user.name
      )}&email=${encodeURIComponent(user.email)}&id=${encodeURIComponent(user._id)}`
    );
  }
);

module.exports = router;
