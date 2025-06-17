const mongoose = require("mongoose");

const PatientImgsSchema = new mongoose.Schema({
        Image: {
           type: String,
           required: true,
       },
       CloudinaryId: {
           type: String,
           required: true,
       },
       Patient: {
           type: String,
           required: true,
       },
       user: {
           type: mongoose.Schema.Types.ObjectId,
           ref: "User", //user id created from user.js 
       },
       
   },{
       timestamps: true,
     });

module.exports = mongoose.model("PatientImgs", PatientImgsSchema)