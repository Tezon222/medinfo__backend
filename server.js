const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const cookieParser = require("cookie-parser")
// const {connectSQLdb} = require("./database/mySQLdb")
const connectMongodb = require("./database/mongodb")
const messageRoute = require("./Routes&Controllers/Message/messageRoute")
const dailyTipsRoute = require("./Routes&Controllers/Dailytips/dailyTipsRouter.js")
const doctorRoute = require("./Authentication/Doctor/doctorRouter")
const patientRoute = require("./Authentication/Patient/patientRouter")
const postRoute =  require("./Routes&Controllers/Messageboard/messageBoardRoute.js")
const diseasesRoute = require("./Routes&Controllers/Ailment Archive/ailmentArchiveRouter.js")
const forgotPasswordRoute = require("./Authentication/ForgotPassword")
const passport = require("passport")
const paths = require("path")
const {sendEmail} = require("./utils/sendEmail.js")
const session = require("express-session")
require("dotenv").config()
const {app, server} = require("./utils/socket.io.js")
const port = process.env.PORT


app.use(express.json())//JSON middleware
app.use(express.urlencoded({extended: false}))
app.use(cors())
app.use(session({
  secret: 'suii',
  resave: false,
  saveUninitialized: true,
  }))
  app.use(cookieParser())
  app.use(passport.authenticate('session'))
  app.use(passport.initialize())
  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });
  app.use('/posts', postRoute)
  app.use('/dailyTips', dailyTipsRoute)
  app.use('/doctor', doctorRoute)
  app.use('/message', messageRoute)
  app.use('/patient', patientRoute)
  app.use('/diseases', diseasesRoute)
  app.use('/forgotpassword', forgotPasswordRoute)
// connectSQLdb()
connectMongodb()

app.get("/login", (req, res)=>{
    //  res.send("welcome")
     res.redirect("https://medical-info.vercel.app/signin?type=patient")
})
app.get("/", (req,res)=>{
  res.send("Medinfo Server")
})

require('./utils/googleAuthenticate.js')
app.get('/auth/google',passport.authenticate('google', { scope:[ 'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/user.gender.read' ] }));
app.get('/auth/google/callback', 
passport.authenticate('google', {
    failureRedirect: '/login'
  }), (req,res)=>{
    res.redirect(`https://medical-info.vercel.app/patient`)
  })
//catch errors middleware
app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({message: 'something broke', error: err});
});

server.listen(port, ()=>{
    console.log(`App running on port ${port}`)
})
