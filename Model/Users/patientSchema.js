const mongoose = require("mongoose")
const Schema = mongoose.Schema
const Patients = new Schema({
    googleId:{
        type: String,
    },
    picture:{
        type: String,
    },
    firstName:{
        type: String,
        required: [true, "Please enter your Name"]
    },
    lastName:{
        type: String,
        required: [true, "Please enter your Full Name"]
    },
    gender:{
        type: String,
        required: [true, 'Please specify gender'],
        enum: ["Male", "Female"]
    },
    email:{
        type: String,
        required: [true, "Please enter your Email"]
    },
    password:{
        type: String,
        required: [true, "Please enter your Password"]
    },
    dob:{
        type: String,
    },
    country:{
        type: String,
    },
    role:{
        type: String, 
        default: "Patient"
    },
    haveAppointment:{
        type: Boolean,
        default: false
    },
    appointments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Appointments'
        }
    ],
    otp:{
        
    }, 
    accessToken:{
        type: String
    }
},{
    timestamps: true
})

const Patient = mongoose.model("Patients", Patients)
module.exports = Patient 