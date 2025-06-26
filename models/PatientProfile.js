const mongoose = require("mongoose");

const PatientProfileSchema = new mongoose.Schema({
    age: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    race: {
        type: String,
        required: true,
    },
    height: {
        type: String,
        required: true,
    },
    weight: {
        type: String,
        required: true,
    },
    allergies: {
        type: String,
        required: true,
    },
    mobility: {
        type: String,
        required: true,
    },
    smoker: {
        type: String,
        required: true,
    },
    patient: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", //user id created from user.js 
    },
});

module.exports = mongoose.model("PatientProfiles", PatientProfileSchema)