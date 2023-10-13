const mongoose = require("mongoose");

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
  Type: {
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
  NotifyDon: {
    type: String,
    required: true,
    default: 'no',
  },
  NotifyPCP: {
    type: String,
    required: true,
    default:'no',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  image: {
    type: String,
    require: true,
  },
  cloudinaryId: {
    type: String,
    require: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("WoundInfo", WoundInfoSchema);
