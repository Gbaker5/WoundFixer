const cloudinary = require("../middleware/cloudinary");
const WoundInfo = require("../models/Wound");
const newPatient = require("../models/Patient");
const User = require("../models/User")
const WoundDoc = require("../models/WoundImg")
const validator = require("validator");
const passport = require("passport");
const axios = require("axios")
const jwt = require("jsonwebtoken")


exports.getroleEdit = async (req,res) => {
    try{
      const users = await User.find()
      console.log(req.user.role)
      
   if(req.user.role === "manager"){
   console.log("Welcome manager")
   }else if(req.user.role === "admin"){
    console.log("Welcome Admin")
   }else console.log("Welcome User")
  
  res.render("roleEdit.ejs", {user: users})
} catch (err) {
  console.log(err);
}
}

exports.putroleEdit = async (req,res) => {
    try{
        
        //console.log(req.body.newRole)
        //console.log(req.params.id)
        
        await User.findOneAndUpdate(
            {_id: req.params.id},
            {$set: {role: req.body.newRole}}

        )

        // 1. Fetch the updated user
        const updatedUser = await User.findById(req.params.id);

        // 2. Create a new payload
        const payload = {
          user: {
            id: updatedUser._id,
            email: updatedUser.email,
            role: updatedUser.role,
          },
        };

        // 3. Sign new token
        const newToken = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });

        // 4. Set the new token in the cookie
        res.cookie("token", newToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 3600000,
        });

        // Optional: Redirect to refresh page or confirm update
        console.log("Role updated")
        //res.redirect("/editRoles"); // or res.json({ message: "Role updated" });



        res.redirect("/editRoles")
    }catch (err){
        console.log(err)
    }
}

exports.getEditUser = async (req,res) => {
    try{
        
        const users = await User.find()

        res.render("deleteUsers.ejs", {user: users})
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


        res.render("physicianpage.ejs", {patients: sortedPatients})
    }catch(err){
        console.log(err)
    }
}

exports.getPhysicianPtPage = async(req,res) => {
    try{

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

        console.log(sortedPatients);

        //Im going to create a snapshot with each edit. The info will be stored within the image document


        /////////////Patient Name
        const currentPatient = await newPatient.findById(req.params.id)
        ////////////List of Wounds for patient

        const patientWounds = await WoundInfo.find({patient: req.params.id}).sort({createdAt: "asc"})
        console.log(patientWounds)

    
        res.render("physicianpagePatientProfile.ejs", {patients: sortedPatients, wounds:patientWounds, patient: currentPatient})
    }catch(err){
        console.log(err)
    }
}


exports.getEditWounds = async(req,res) => {
    try{




    
        res.redirect("/physicianP")
    }catch(err){
        console.log(err)
    }
}

exports.updateWounds = async(req,res) => {
    try{
        await WoundDoc.create({
            
        })



    
        res.redirect("/physicianP")
    }catch(err){
        console.log(err)
    }
}