const mongoose =  require("mongoose")
const Schema = mongoose.Schema
const appointmentSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please specify name'],
    },
    email: {
        type: String,
        required: [true, 'Please specify email'],
    },
    dob: {
        type: Date,
        required: [true, 'Please specify date of birth'],//YYYY-MM-DD
    },
    gender: {
        type: String,
        required: [true, 'Please specify gender'],
        enum: ["Male", "Female"]
    },
    phoneNumber: {
        type: Number,
        required: [true, 'Please specify phone number'],
    },
    reason: {
        type: String,
        required: [true, 'Please specify symptoms'],
    },
    dateOfAppointment: {
        type: Date,
        required: [true, 'Please specify date of appointmnt'],//YYYY-MM-DD
    },
    medicalConditions: {
        type: String 
    },
    allergies: {
        type: String
    },
    healthInsurance:{
        type: String, 
        required: [true, 'Please add Insurance state'],
        enum: ["Yes", "No"]
    }, 
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patients'
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctors'
    }
})

const Appointment = mongoose.model("Appointments", appointmentSchema)
module.exports = Appointment 