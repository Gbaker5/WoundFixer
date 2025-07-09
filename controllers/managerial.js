const cloudinary = require("../middleware/cloudinary");
const WoundInfo = require("../models/Wound");
const newPatient = require("../models/Patient");
const User = require("../models/User")
const WoundDoc = require("../models/WoundImg")
const PatientImg = require("../models/PatientImg")
const PatientProfile = require("../models/PatientProfile")
const validator = require("validator");
const passport = require("passport");
const axios = require("axios")
const jwt = require("jsonwebtoken");
const WoundImg = require("../models/WoundImg");


exports.getroleEdit = async (req,res) => {
    try{

      const pageUser = await User.findById(req.user.id)
      


      const users = await User.find().sort({userName: "asc"})
      console.log(req.user.role)
      
   if(req.user.role === "manager"){
   console.log("Welcome manager")
   }else if(req.user.role === "admin"){
    console.log("Welcome Admin")
   }else console.log("Welcome User")
  
  res.render("roleEdit.ejs", {user: users, thisUser:pageUser})
} catch (err) {
  console.log(err);
}
}

exports.putroleEdit = async (req,res) => {
  try {
    const { updates } = req.body;

    for (let { userId, newRole } of updates) {
      await User.findByIdAndUpdate(userId, { role: newRole });

      // Optionally re-issue new JWTs if the current user is updated
      // (Not done here unless needed for live re-auth)
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Role update error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

exports.getEditUser = async (req,res) => {
    try{
        const pageUser = await User.findById(req.user.id)
        console.log(pageUser)

        const users = await User.find()

        res.render("deleteUsers.ejs", {user: users, thisUser: pageUser})
    }catch(err){
        console.log(err)
    }

}

exports.getConfirmDeleteUser = async (req,res) => {
    try{
        const users = await User.findById(req.params.id)

        res.render("confirmDeleteUser.ejs",{user: users})
    }catch(err){
        console.log(err)
    }
}

exports.deleteUser = async (req,res) => {
    try{
        const user = await User.findById(req.params.id)
        console.log(`DELETED <----Username:${user.userName} ------- email:${user.email}!----->`)
        //const deletedUser = await User.deleteOne({_id: req.params.id})
     
        res.redirect("/editUsers")
    }catch(err){
        console.log(err)
    }

}

//figure a way to allow documentation to exist without an author

exports.getPhysicianP = async(req,res) => {
    try{

      const thisUser = await User.findById(req.user.id)

      /////////Getting List of patients with wounds 

        // 1. Get all wounds
        const wounds = await WoundInfo.find().lean(); // lean() for better performance if you just want data

        // 2. Extract all patient IDs and remove duplicates
        const patientIds = [...new Set(wounds.map(w => w.patient.toString()))];

        // 3. Fetch all unique patients in one query
        const patients = await newPatient.find({ _id: { $in: patientIds } }).lean();

        // 4. Sort by last name
        const sortedPatients = patients.sort((a, b) => {
          const lastA = a.lastName.toUpperCase();
          const lastB = b.lastName.toUpperCase();
          return lastA.localeCompare(lastB);
        });

        console.log(sortedPatients);

        //Im going to create a snapshot with each edit. The info will be stored within the image document


        res.render("physicianpage.ejs", {patients: sortedPatients, user: thisUser})
    }catch(err){
        console.log(err)
    }
}

exports.getPhysicianPtPage = async(req,res) => {
    try{
      const thisUser = await User.findById(req.user.id)

        /////////loading Pt Image
        const ptImage = await PatientImg.find({ Patient: req.params.id });

        /////////Getting List of patients with wounds (Left side list)

        // 1. Get all wounds
        const wounds = await WoundInfo.find().lean(); // lean() for better performance if you just want data

        // 2. Extract all patient IDs and remove duplicates
        const patientIds = [...new Set(wounds.map(w => w.patient.toString()))];

        // 3. Fetch all unique patients in one query
        const patients = await newPatient.find({ _id: { $in: patientIds } }).lean();

        // 4. Sort by last name
        const sortedPatients = patients.sort((a, b) => {
          const lastA = a.lastName.toUpperCase();
          const lastB = b.lastName.toUpperCase();
          return lastA.localeCompare(lastB);
        });

        //console.log(sortedPatients);



        //Im going to create a snapshot with each edit. The info will be stored within the image document


        /////////////Patient Name
        const currentPatient = await newPatient.findById(req.params.id)
        ////////////List of Wounds for patient

        const patientWounds = await WoundInfo.find({patient: req.params.id, active: true}).populate('creator').sort({createdAt: "asc"})
        //console.log(patientWounds)

        ///Wound Docs related to Patient (arr)
        const woundImgs = await WoundDoc.find({Patient: req.params.id}).populate('user').sort({createdAt: "desc"})
        //console.log(woundImgs)

        //Wound Docs associated with each wound of patient
        // Group woundDocs by originalWoundId
        const woundDocsByWound = {};
        woundImgs.forEach(doc => {
          const id = doc.originalWoundId?.toString();
          if (!woundDocsByWound[id]) {
            woundDocsByWound[id] = [];
          }
          woundDocsByWound[id].push(doc);
        });

        //////////////Inactive wounds

        const inactiveWounds = await WoundInfo.find({ patient: req.params.id, active: false });
       
        /////Patient Profile
        const PtProfile = await PatientProfile.find({patient: req.params.id})
        console.log(PtProfile)

        res.render("physicianpagePatientProfile.ejs", {
            user: thisUser,
            patients: sortedPatients, 
            wounds:patientWounds, 
            inactive: inactiveWounds,
            patient: currentPatient, 
            woundDocsByWound,
            messages: req.flash(),
            ptImg: ptImage.length ? ptImage[0] : null,
            profileInfo: PtProfile.length ? PtProfile[0] : null,
        })
    }catch(err){
        console.log(err)
    }
}




exports.updateWounds = async(req,res) => {
    try{

         /////Validator for missing data in form
         const validationErrors = [];
        
         if (validator.isEmpty(req.body.Length)) {
           validationErrors.push({ param: "Length", msg: "Length requires input" });
         } else if (!validator.isNumeric(req.body.Length)) {
           validationErrors.push({ param: "Length", msg: "Length must be a number" });
         }
         
         if (validator.isEmpty(req.body.Width)) {
           validationErrors.push({ param: "Width", msg: "Width requires input" });
         } else if (!validator.isNumeric(req.body.Width)) {
           validationErrors.push({ param: "Width", msg: "Width must be a number" });
         }
         
         if (validator.isEmpty(req.body.Depth)) {
           validationErrors.push({ param: "Depth", msg: "Depth requires input" });
         } else if (!validator.isNumeric(req.body.Depth)) {
           validationErrors.push({ param: "Depth", msg: "Depth must be a number" });
         }
   
         if(validator.isEmpty(req.body.Description))validationErrors.push({ param: "Description", msg: "Description Requires Input"});
         if(validator.isEmpty(req.body.Intervention))validationErrors.push({ param: "Intervention", msg: "Intervention Requires Input"});
         if (!req.file) {
            validationErrors.push({ param: "woundImg", msg: "Wound Image Requires File" });
          }
          
         if (validationErrors.length) {
           //console.log(validationErrors)
           req.flash("errors", JSON.stringify({
            woundId: req.body.woundId,
            errors: validationErrors
          }));
          req.flash("showFormWoundId", req.body.woundId);

           return res.redirect(`/physicianP/${req.params.id}`);
         }



        //console.log("Cloudinary loaded:", cloudinary.config);
        //console.log("req.file:", req.file);
        //console.log("req.body:", req.body);
        
       
        const result = await cloudinary.uploader.upload(req.file.path);

        await WoundDoc.create({

            Type: req.body.Type ,
            Location: req.body.Location,
            Length: req.body.Length,
            Width: req.body.Width,
            Depth: req.body.Depth,
            Odor: req.body.Odor,
            Description: req.body.Description,
            Intervention: req.body.Intervention,
            Image: result.secure_url,
            CloudinaryId: result.public_id,
            Patient: req.body.Patient,
            originalWoundId:req.body.woundId,
            user: req.user.id,


        })



    
        res.redirect(`/physicianP/${req.params.id}`)
    }catch(err){
        console.log(err)
    }
}

exports.getUpdatePtProfileImg = async(req,res) => {
    try{

        const thisUser = await User.findById(req.user.id)

        const currentPatient = await newPatient.findById(req.params.id)

        const ptImage = await PatientImg.find({ Patient: req.params.id });

        res.render("editPtProfileImg.ejs", {
          user: thisUser,
          patient: currentPatient,
          ptImg: ptImage.length ? ptImage[0] : null
        });
        
    }catch(err){
        console.log(err)
    }
}

exports.putUpdatePtProfileImg = async(req,res) => {
    try{

        //////Validation Error for image upload
        const validationErrors = [];

        const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
        
        if (!req.file) {
          validationErrors.push({ param: "ptImg", msg: "Wound Image Requires File" });
        } else if (!allowedMimeTypes.includes(req.file.mimetype)) {
          validationErrors.push({ param: "ptImg", msg: "Invalid file type. Only JPG, PNG, or WEBP allowed." });
        }
        
        if (validationErrors.length) {
          req.flash("errors", validationErrors);
          return res.redirect(`/physicianP/${req.params.id}/updatePtProfileImg`);
        }
        
        // If no validation errors, continue with Cloudinary upload and DB logic
        
        const result = await cloudinary.uploader.upload(req.file.path);

        /////////Database Update for Pt Image
        await PatientImg.findOneAndUpdate(
            { Patient: req.params.id },
            { $set: {
                Image:result.secure_url,
                CloudinaryId:result.public_id,
                Patient:req.params.id,
                user:req.user.id,
            } },
            { upsert: true }
        )
        console.log("Image updated!")

    
        res.redirect(`/physicianP/${req.params.id}`)
    }catch(err){
        console.log(err)
    }
}

exports.getEditPtProfile = async(req,res) => {
  try{
    const thisUser = await User.findById(req.user.id)
    const currentPatient = await newPatient.findById(req.params.id)
    const ptImage = await PatientImg.find({ Patient: req.params.id });
    const ptInfo = await PatientProfile.find({patient: req.params.id})


    res.render("editPtProfile.ejs", {
      patient: currentPatient, 
      ptImg: ptImage.length ? ptImage[0] : null,
      profileInfo: ptInfo.length ? ptInfo[0] : null,
      user: thisUser,
    },
    )
  }catch(err){
        console.log(err)
    }
}

exports.putEditPtProfile = async (req, res) => {
  try {
    const updateFields = {};

    // Check each field before adding it
    if (req.body.age) updateFields.age = req.body.age;
    if (req.body.gender) updateFields.gender = req.body.gender;
    if (req.body.race) updateFields.race = req.body.race;
    if (req.body.height) updateFields.height = req.body.height;
    if (req.body.weight) updateFields.weight = req.body.weight;
    if (req.body.allergies) updateFields.allergies = req.body.allergies;
    if (req.body.mobility) updateFields.mobility = req.body.mobility;
    if (req.body.smoker) updateFields.smoker = req.body.smoker;

    // Always set these
    updateFields.patient = req.params.id;
    updateFields.user = req.user.id;

    await PatientProfile.findOneAndUpdate(
      { patient: req.params.id },
      { $set: updateFields },
      { upsert: true, new: true }
    );

    console.log("Pt Profile updated!");

    res.redirect(`/physicianP/${req.params.id}`);
  } catch (err) {
    console.log(err);
  }
};


exports.toggleActive = async(req,res) => {
  try{

    await WoundInfo.findByIdAndUpdate(
      req.params.id, {
      active: req.body.active
    });

    res.status(200).json({ message: "Active status updated successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
}