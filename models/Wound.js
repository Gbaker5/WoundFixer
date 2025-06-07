const mongoose = require("mongoose");
const { any } = require("../middleware/multer");

const WoundInfoSchema = new mongoose.Schema({
  Location: {
    type: String,
    required: true,
  },
  Type: {
    type: String,
    required: true,
  },
  Length: {
    type: Number,
    required: true,
  },
  Width: {
    type: Number,
    required: true,
  },
  Depth: {
    type: Number,
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
  NotifyDon: {
    type: String,
    
    default: 'no',
  },
  NotifyPCP: {
    type: String,
    
    default:'no',
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  patient: {
    type: String,
  },
},{
  timestamps: true,
});

module.exports = mongoose.model("woundInfo", WoundInfoSchema);
