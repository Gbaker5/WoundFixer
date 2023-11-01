const cloudinary = require("../middleware/cloudinary");
const WoundInfo = require("../models/Wound");
const newPatient = require("../models/Patient");
const User = require("../models/User")
const validator = require("validator");
const passport = require("passport");
const axios = require("axios")

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
      const patient = await newPatient.findOne({ _id: req.params.id })
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
      //console.log(req.body)
      //console.log(req.params)
      //const patient = await newPatient.findOne({ _id: req.params.id })
      //console.log(patient)

      //const patient = await newPatient.find();


      /////Validator for missing data in form
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

      const patient = await newPatient.find({_id: req.params.id})
      //console.log(patient)
      const Pname = patient[0].firstName
      //console.log(Pname)
      const user = await User.findOne(req.user)
      //console.log(user)
      //console.log(user.userName)


      

      /////Send Email
      function sendEmail (name, email, subject, message) {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.set('Authorization', 'Basic ' + btoa('bb1bfa5362e3033e9d31ed0998b5cb54'+":" +'baa1c5b9dcafbe464660c4f3e5e3a45d'));
      
        const data = JSON.stringify({
          "Messages": [{
            "From": {"Email": "gjarred23@gmail.com", "Name": `"${user.userName}"`},
            "To": [{"Email": email, "Name": name}],
            "Subject": subject,
            "TextPart": message
          }]
        });
      
        const requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: data,
        };
      
        fetch("https://api.mailjet.com/v3.1/send", requestOptions)
          .then(response => response.text())
          .then(result => console.log(result))
          .catch(error => console.log('error', error));
      }


      const string = JSON.stringify(req.body)
      const spaces = string.split(',').join('\n')
      

      if(req.body.DON == "Yes"){
        const name = Pname
        const email = "gjarred23@gmail.com" 
        const subject = Pname 
        const message = spaces;
        console.log('Email activated')
        //implement your spam protection or checks.
        sendEmail(Pname,email,subject,message);
      }

      if(req.body.PCP == "Yes"){
        const name = Pname
        const email = "gjarred23@gmail.com" 
        const subject = Pname 
        const message = spaces;
        console.log('Email activated')
        //implement your spam protection or checks.
        sendEmail(Pname,email,subject,message);
      }
      //console.log(JSON.stringify(req.body))
      //console.log(spaces)


      /////Model to send to database
      await WoundInfo.create({
        Type: req.body.type,
        Location: req.body.location,
        Length: req.body.length,
        Width: req.body.width,
        Depth: req.body.depth,
        Odor: req.body.odor,
        Description: req.body.description,
        Intervention: req.body.intervention,
        NotifyDon: req.body.DON,
        NotifyPCP: req.body.PCP,
        patient: req.params.id,
        user: req.user.id,
        
      });
      console.log("Wound Info Created")
      res.redirect("/profile")
    }catch (err) {
      console.log(err);
    }
  },
  getAllWounds: async (req,res) => { //createdAt newest to oldest 
    try{
      const wounds = await WoundInfo.find().sort({createdAt: "desc"})
      const patient = await newPatient.find()
      let patientsidArr = []

      for(let i=0;i<wounds.length;i++){
        patientsidArr.push(wounds[i].patient) //extracts objectid from wound which is the patient id into array
      }
      //console.log(patientsidArr)
      

      //NAMES
      let firstNamesArr = [];
      let lastNamesArr = [];
      for(let j=0;j<wounds.length;j++){
       const patientName = await newPatient.find({_id: patientsidArr[j]}) //search through patient collection by object ids from first array
       //console.log(patientName)
       const fName = patientName[0].firstName //cycle through and capture first names 
       console.log(fName)
       const lName = patientName[0].lastName //cycle through and capture last names
       console.log(lName)
       firstNamesArr.push(fName) //put names into new array
       lastNamesArr.push(lName) 
       
      }
      console.log(firstNamesArr)
      console.log(lastNamesArr)
      //console.log(wounds)
      res.render("allwounds.ejs", {wounds: wounds, firstNames: firstNamesArr, lastNames:lastNamesArr})
    }catch (err) {
      console.log(err);
    }
  },
  getWoundsZtoA: async (req,res) => { //createdAt oldest to newest
    try{
      const wounds = await WoundInfo.find().sort({createdAt: "asc"})
      const patient = await newPatient.find()
      let patientsidArr = []

      for(let i=0;i<wounds.length;i++){
        patientsidArr.push(wounds[i].patient) //extracts objectid from wound which is the patient id into array
      }
      //console.log(patientsidArr)
      

      //NAMES
      let firstNamesArr = [];
      let lastNamesArr = [];
      for(let j=0;j<wounds.length;j++){
       const patientName = await newPatient.find({_id: patientsidArr[j]}) //search through patient collection by object ids from first array
       //console.log(patientName)
       const fName = patientName[0].firstName //cycle through and capture first names 
       console.log(fName)
       const lName = patientName[0].lastName //cycle through and capture last names
       console.log(lName)
       firstNamesArr.push(fName) //put names into new array
       lastNamesArr.push(lName) 
       
      }
      console.log(firstNamesArr)
      console.log(lastNamesArr)
      //console.log(wounds)

      res.render("allwoundscreatedztoa.ejs", {wounds: wounds, firstNames: firstNamesArr, lastNames:lastNamesArr})
    }catch (err) {
      console.log(err);
    }
  },
  getWoundsByPatient: async (req,res) => { //patient A to Z
    try {
      const wounds = await WoundInfo.find();
    
      // Retrieve patient data and sort by last name in descending order
      const patients = await newPatient.find().sort({ lastName: "desc" });
    
      // Create a map to quickly access patient data by ID
      const patientsMap = new Map(patients.map(patient => [patient._id.toString(), patient]));
      //console.log(patientsMap)
    
      // Sort the wounds array based on patient last names
      wounds.sort((a, b) => {
        const lastNameA = patientsMap.get(a.patient.toString()).lastName;
        const lastNameB = patientsMap.get(b.patient.toString()).lastName;
        return lastNameA.localeCompare(lastNameB);
      });
      console.log(wounds)
    
      // Extract patient names
      const firstNamesArr = wounds.map(wound => patientsMap.get(wound.patient.toString()).firstName);
      const lastNamesArr = wounds.map(wound => patientsMap.get(wound.patient.toString()).lastName);
    
      console.log(firstNamesArr);
      console.log(lastNamesArr);


      res.render("allwoundspatient.ejs", {wounds: wounds, firstNames: firstNamesArr, lastNames:lastNamesArr})
    }catch (err) {
      console.log(err);
    }
  },
  getWoundsByPatientZtoA: async (req, res) =>{
    try {
      const wounds = await WoundInfo.find();
    
      // Retrieve patient data and sort by last name in descending order
      const patients = await newPatient.find().sort({ lastName: "desc" });
    
      // Create a map to quickly access patient data by ID
      const patientsMap = new Map(patients.map(patient => [patient._id.toString(), patient]));
      //console.log(patientsMap)
    
      // Sort the wounds array based on patient last names
      wounds.sort((a, b) => {
        const lastNameA = patientsMap.get(a.patient.toString()).lastName;
        const lastNameB = patientsMap.get(b.patient.toString()).lastName;
        return lastNameB.localeCompare(lastNameA);
      });
      console.log(wounds)
    
      // Extract patient names
      const firstNamesArr = wounds.map(wound => patientsMap.get(wound.patient.toString()).firstName);
      const lastNamesArr = wounds.map(wound => patientsMap.get(wound.patient.toString()).lastName);
    
      console.log(firstNamesArr);
      console.log(lastNamesArr);
    
      // Render the view with sorted data
      res.render("allwoundspatientztoa.ejs", { wounds, firstNames: firstNamesArr, lastNames: lastNamesArr });
    } catch (err) {
      console.log(err);
    }
    
  }
  






  
 
  
};
