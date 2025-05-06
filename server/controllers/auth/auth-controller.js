const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const crypto = require('crypto');
const sendEmail = require("../../helpers/sendEmail");


const RegisterUser = async (req, res) => {
  console.log("Incoming request body:", req.body);
  const { userName, email, password } = req.body;

  try {
    const checkUser = await User.findOne({ email });

    if (checkUser) {
      return res.json({
        success: false,
        message: "User already exists with same email",
      });
    }

    const hashPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      userName,
      email,
      password: hashPassword,
    });

    try {
      await newUser.save();
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: 'Email or username already exists',
        });
      }
      throw error;
    }

    // ✅ Generate token just like in login
    const token = jwt.sign(
      {
        id: newUser._id,
        role: newUser.role,
        email: newUser.email,
        userName: newUser.userName,
      },
      "CLIENT_SECRET_KEY",
      { expiresIn: "60m" }
    );

    // ✅ Set cookie and return user
    res.cookie("token", token, { httpOnly: true, secure: false }).json({
      success: true,
      message: "Registration successful and logged in",
      user: {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
        userName: newUser.userName,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};


// const loginUser = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const checkUser = await User.findOne({ email });

//     if (!checkUser)
//       return res.json({
//         success: false,
//         message: " User doesnt exists please register first",
//       });

//     const checkPassswordMatch = await bcrypt.compare(
//       password,
//       checkUser.password
//     );

//     if (!checkPassswordMatch)
//       return res.json({
//         success: false,
//         message: "Incorrect password! please try again",
//       });

//     const token = jwt.sign(
//       {
//         id: checkUser._id,
//         role: checkUser.role,
//         email: checkUser.email,
//         userName: checkUser.userName
//       },
//       "CLIENT_SECRET_KEY",
//       { expiresIn: "60m" }
//     );

//     res.cookie("token", token, { httpOnly: true, secure: false }).json({
//       success: true,
//       message: "Logged in successfully",
//       user: {
//         email: checkUser.email,
//         role: checkUser.role,
//         id: checkUser._id,
//         userName: checkUser.userName

//       },
//     });
//   } catch (e) {
//     console.log(e);
//     res.status(500).json({
//       success: false,
//       message: "login failed",
//     });
//   }
// };

const logout = async (req, res) => {
  res.clearCookie("token").json({
    success: true,
    message: "logged out successfully",
  });
  console.log("logout hit");
};

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token)
    return res.status(401).json({
      success: false,
      message: "Unauthorized token",
    });

  try {
    const decoded = jwt.verify(token, "CLIENT_SECRET_KEY");
    req.user = decoded;
    next();
  } catch (e) {
    res.status(401).json({
      success: false,
      message: "Unauthorized user!",
    });
  }
};

const getUserCount = async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.status(200).json({
      success: true,
      userCount: count,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Failed to get user count",
    });
  }
};


const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: 'No user found with that email.',
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save({ validateBeforeSave: false });

    const resetURL = `http://localhost:5173/auth/reset-password/${resetToken}`;
    const emailContent = `
      <p>Hello ${user.userName},</p>
      <p>You requested a password reset. Click the link below to set a new password:</p>
      <a href="${resetURL}" target="_blank">Reset Password</a>
      <p>This link will expire in 10 minutes.</p>
    `;

    await sendEmail({
      to: email,
      subject: "Password Reset",
      html: emailContent,
    });

    res.json({
      success: true,
      message: 'Password reset link sent to your email.',
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: 'Error sending reset password email.',
    });
  }
};

// Update these functions in your auth controller file

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("Login attempt for email:", email);
    const checkUser = await User.findOne({ email });

    if (!checkUser) {
      console.log(`User with email ${email} not found in database`);
      return res.json({
        success: false,
        message: "User doesn't exist, please register first",
      });
    }

    console.log(`User found in database: ${checkUser.email}, ID: ${checkUser._id}`);
    
    const checkPasswordMatch = await bcrypt.compare(
      password, 
      checkUser.password
    );

    console.log(`Password match result: ${checkPasswordMatch}`);

    if (!checkPasswordMatch) {
      return res.json({
        success: false,
        message: "Incorrect password! please try again",
      });
    }

    const token = jwt.sign(
      {
        id: checkUser._id,
        role: checkUser.role,
        email: checkUser.email,
        userName: checkUser.userName
      },
      "CLIENT_SECRET_KEY",
      { expiresIn: "60m" }
    );

    res.cookie("token", token, { httpOnly: true, secure: false }).json({
      success: true,
      message: "Logged in successfully",
      user: {
        email: checkUser.email,
        role: checkUser.role,
        id: checkUser._id,
        userName: checkUser.userName
      },
    });
  } catch (e) {
    console.log("Login error:", e);
    res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    
    console.log("Attempting to find user with reset token");
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }, // Not expired
    });

    if (!user) {
      console.log("Reset token invalid or expired.");
      return res.status(400).json({
        success: false,
        message: 'Token is invalid or has expired.',
      });
    }

    console.log("Found user for password reset:", user.email, "User ID:", user._id);

    // Hash the new password
    const hashPassword = await bcrypt.hash(password, 12);
    
    // Update user document
    user.password = hashPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    
    // Save the updated user
    await user.save();

    console.log("Reset complete. Updated user:", await User.findById(user._id));
    
    // Return the email in the response
    res.json({
      success: true,
      message: 'Password has been reset successfully.',
      email: user.email // Include email in response
    });
  } catch (error) {
    console.error("Error during password reset:", error);
    res.status(500).json({
      success: false,
      message: 'Error resetting password.',
    });
  }
};

module.exports = { 
  RegisterUser, 
  loginUser, 
  logout, 
  authMiddleware, 
  getUserCount, 
  forgotPassword, 
  resetPassword 
};
