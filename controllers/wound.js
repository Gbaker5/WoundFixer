const cloudinary = require("../middleware/cloudinary");
const WoundInfo = require("../models/Wound");

module.exports = {
  getProfile: async (req, res) => {
    try {
      const wound = await WoundInfo.find();
      res.render("profile.ejs", { user: req.user, wound: wound });
    } catch (err) {
      console.log(err);
    }
  },
  getWoundForm: async (req, res) => {
    try {
      const wound = await WoundInfo.find();
      res.render("newWound.ejs", { user: req.user, wound: wound });
    } catch (err) {
      console.log(err);
    }
  },







  
 
  
};
