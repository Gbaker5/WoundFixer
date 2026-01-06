const mongoose = require("mongoose");

const FacilitySchema = new mongoose.Schema({
    facilityName: {
        type: String,
        required:true,
    },
    facilityAddress: {
        type: String,
        required:true,
    },
    facilityPhone: {
        type: String,
        required:true,
    },
    facilityCity: {
        type: String,
        required:true,
    },
    facilityState: {
        type: String,
        required:true,
    },
    facilityZipcode: {
        type: String,
        required:true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", //user id created from user.js 
    },
    facilityIdCode: {
        type: String,
        required: true,
    },
    //lastName: {
    //    type: String,
    //    required: true,
    //},
},{
       timestamps: true,
     });

module.exports = mongoose.model("Facility", FacilitySchema)