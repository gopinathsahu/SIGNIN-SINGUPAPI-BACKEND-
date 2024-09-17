const express=require('express');
const router= express.Router();
const{home, signup, signin, getUser, logout, forgotpassword}=require('../Controller/Controller.js');
const middleware=require('../middleware/middleware.js');
router.get('/',home);
router.post('/signup',signup);
router.post('/signin',signin);
router.get('/getuser',middleware,getUser);
router.get('/logout',middleware,logout);
router.post('/forgetpasswpord',forgotpassword);
module.exports=router;