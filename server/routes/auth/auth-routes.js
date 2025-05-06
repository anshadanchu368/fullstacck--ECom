const express=require("express");
const {RegisterUser, loginUser, logout, authMiddleware ,forgotPassword, resetPassword} = require("../../controllers/auth/auth-controller")

const router= express.Router();

router.post('/register',RegisterUser)
router.post('/login',loginUser)
router.delete('/logout',logout)
router.get('/check-auth',authMiddleware, (req,res)=>{
      const user =req.user;
      res.status(200).json({
        success:true,
        message :'authenticated user!',
        user
      })
})

router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);


module.exports= router