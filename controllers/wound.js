const cloudinary = require("../middleware/cloudinary");
const WoundInfo = require("../models/Wound");
const newPatient = require("../models/Patient");
const validator = require("validator");
const passport = require("passport");

module.exports = {
  getProfile: async (req, res) => {
    try {
      const wound = await WoundInfo.find();
      const patients = await newPatient.find().sort({lastName: "asc"});
      //console.log(patients._id)
      res.render("profile.ejs", { user: req.user, wound: wound, patients: patients});
    } catch (err) {
      console.log(err);
    }
  },
  getAddPatient: async (req,res) => {
    try{
      const patients = await newPatient.find().sort({lastName: "asc"});
      res.render("newPatient.ejs", {patients: patients});
  
    }catch (err) {
      console.log(err);
    }
    
  },
  postAddPatient: async (req,res) => {
    try{

      const validationErrors = [];
      if(validator.isEmpty(req.body.firstName))validationErrors.push({ msg: "First Name Requires Input"});
      if(validator.isEmpty(req.body.lastName))validationErrors.push({ msg: "Last Name Requires Input"});
      if (validationErrors.length) {
        console.log(validationErrors)
        req.flash("errors", validationErrors);
        return res.redirect("/newPatient");
      }

    await newPatient.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    });
    console.log("!!!!Wound Info Created!!!!")
      res.redirect("/newPatient")
    }catch (err) {
      console.log(err);
    }
  },
  getWoundForm: async (req, res) => {
    try {
      console.log(req.params)
      //console.log(req.user)
      const patient = await newPatient.find({ _id: req.params.id })
      console.log(patient)
      //const patientUrl = await newPatient.findById(req.params.id)
      //console.log(patientUrl)
      const wound = await WoundInfo.find();
      res.render("newWound.ejs", { user: req.user, wound: wound, patient: patient });
    } catch (err) {
      console.log(err);
    }
  },
  postWoundForm: async (req, res) => {
    try{
      console.log(req.body)
      console.log(req.params)
      //const patient = await newPatient.find({ _id: req.params.id })
      //console.log(patient)

      //const patient = await newPatient.find();

      const validationErrors = [];
      if(validator.isEmpty(req.body.length))validationErrors.push({ msg: "Length Requires Input"});
      if(validator.isEmpty(req.body.width))validationErrors.push({ msg: "Width Requires Input"});
      if(validator.isEmpty(req.body.depth))validationErrors.push({ msg: "Depth Requires Input"});
      if(validator.isEmpty(req.body.description))validationErrors.push({ msg: "Description Requires Input"});
      if(validator.isEmpty(req.body.intervention))validationErrors.push({ msg: "Intervention Requires Input"});
      if (validationErrors.length) {
        console.log(validationErrors)
        req.flash("errors", validationErrors);
        return res.redirect("/newWoundForm");
      }

      await WoundInfo.create({
        Location: req.body.location,
        Type: req.body.type,
        Length: req.body.length,
        Width: req.body.width,
        Depth: req.body.depth,
        Odor: req.body.odor,
        Description: req.body.description,
        Intervention: req.body.intervention,
        NotifyDon: req.body.don,
        NotifyPCP: req.body.pcp,
        patient: req.params.id,
        user: req.user.id,
        
      });
      console.log("Wound Info Created")
      res.redirect("/profile")
    }catch (err) {
      console.log(err);
    }
  },







  
 
  
};
