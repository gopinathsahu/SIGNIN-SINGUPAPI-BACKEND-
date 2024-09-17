require('dotenv').config();
const express=require('express');
const app= express();
const connectedtoDB= require('./Database/database.js');
connectedtoDB();
const cookieparser=require('cookie-parser');
app.use(cookieparser());
app.use(express.json());
const useRouter=require('./Router/router.js');
app.get('/',(req,res)=>{
    res.send(" we are starting the signinand signup page ..!");
 })
 app.use('/api/auth',useRouter);
module.exports=  app;
