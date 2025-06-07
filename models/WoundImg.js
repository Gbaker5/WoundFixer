const mongoose = require("mongoose");

const WoundImgSchema = new mongoose.Schema({
    Type: {
        type: String,
        required: true,
    },
    Location: {
        type: String,
        required: true,
    },
    Length: {
        type: String,
        required: true,
    },
    Width: {
        type: String,
        required: true,
    },
    Depth: {
        type: String,
        required: true,
    },
    Odor: {
        type: String,
        required: true,
    },
    Description: {
        type: String,
        required: true,
    },
    Intervention: {
        type: String,
        required: true,
    },
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
    
});

module.exports = mongoose.model("WoundImg", WoundImgSchema)