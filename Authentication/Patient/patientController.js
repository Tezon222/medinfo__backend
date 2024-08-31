// const {db} = require("../../database/mySQLdb")
const Patient = require("../../Model/Users/patientSchema")
const { sendCookies } = require("../../utils/cookies")
const emailValidator = require('../../utils/emailValidator')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")


const getPatients = async(req,res)=>{
  try {
    const {accessToken} = req.cookies
    if(!accessToken){
      res.status(401).json({message: 'No access token'})
    }
    const verifyAccessToken = jwt.verify(accessToken, process.env.JWT_SECRET)
    const userId = verifyAccessToken.user_id
    const user = await Patient.findById(userId).select(['-password'])
    if(!user){ res.status(400).json({message: "User does not exist"})}
    res.status(200).json({message: user})
  } catch (error) {
    res.status(400).json({message: error})
  }
}

const getSinglePatient = async(req,res)=>{
  try {
    const {accessToken} = req.cookies
    if(!accessToken){
      res.status(401).json({message: 'No access token'})
    }
    const verifyAccessToken = jwt.verify(accessToken, process.env.JWT_SECRET)
    const userId = verifyAccessToken.user_id
    const user = await Patient.findById(userId).select(['-password'])
    if(!user){ res.status(400).json({message: "User does not exist"})}
    res.status(200).json({message: user})
  } catch (error) {
    res.status(400).json({message: error})
  }
}

// signup Patients
const signupPatient = async(req,res)=>{
    const {firstName, lastName, email, password, country, gender} = req.body
      try {  
          if(!firstName || !lastName || !email || !password || !country || !gender){
                res.status(400).json({message: "Please fill all fields"})  
            } 
    const user =await Patient.findOne({email});
    const emailTrue = emailValidator(email)
    if(!emailTrue){
      res.status(400).json({message:"please enter a valid Email"})
    }
    if(!user){
    const securePassword = await bcrypt.hash(password, 10)
    const user = await Patient.create({firstName, lastName, email, password: securePassword, country, gender})
    res.status(201).json({message: "User Signup Successful", User:{name: user.firstName}} )
    }else if(user){
      res.status(400).json({message:"User already exists"})
    }
        } catch (error) {
            console.log(error)
            res.status(400).json({message:error})
        }
}

// Login patients
const loginPatient = async(req,res) =>{
    const {email, password} = req.body
    try {
        const user = await Patient.findOne({email})
        if(!user){
            res.status(400).json({message:"Invalid username or Password"})
        }else if(!user.password){
          res.status(400).json({message: "User can only signin with Google"})
      }else if(user && await bcrypt.compare(password, user.password)){
        const user_id = user._id
            const accessToken = await jwt.sign({user_id}, process.env.JWT_SECRET, {expiresIn: "30d"})
            sendCookies("accessToken", accessToken, res)
            res.status(200).json({message: `Login Successful, welcome ${user.firstName}`, accessToken})
        }
        
    } catch (error) {
        console.log(error)
        res.status(400).json({message:error})
    }
}

module.exports = {signupPatient, getPatients, getSinglePatient, loginPatient}