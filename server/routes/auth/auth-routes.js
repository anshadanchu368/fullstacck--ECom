const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const jwt = require("jsonwebtoken");
const express = require("express");
const { RegisterUser, loginUser, logout, authMiddleware, forgotPassword, resetPassword, findOrCreateUser } = require("../../controllers/auth/auth-controller");

const router = express.Router();

router.post('/register', RegisterUser);
router.post('/login', loginUser);
router.delete('/logout', logout);
router.get('/check-auth', authMiddleware, (req, res) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    message: 'authenticated user!',
    user
  });
});

router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

router.post('/google-login', async (req, res) => {
  
  try {
    const { token } = req.body;

    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, email, name } = payload;  // sub = googleId

    // Lookup or create user in your DB
    const userData = { googleId: sub, email, name };

    // Assuming findOrCreateUser function is defined
    const user = await findOrCreateUser(userData);  // Implement this function

    // Create a session or send a cookie (like normal login)
    const jwtToken = jwt.sign(
      { id: user._id, role: user.role, email: user.email, userName: user.userName },
      process.env.JWT_SECRET,
      { expiresIn: "60m" }
    );

    res.status(200).json({
      success: true,
      message: 'Google login successful',
      token: jwtToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        userName: user.userName,
      },
    });

  } catch (error) {
    console.error('Google token verification failed:', error);
    res.status(401).json({ success: false, message: 'Invalid Google token' });
  }
});

module.exports = router;
