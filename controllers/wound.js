const cloudinary = require("../middleware/cloudinary");
const WoundInfo = require("../models/Wound");
const WoundDoc = require("../models/WoundImg")
const newPatient = require("../models/Patient");
const User = require("../models/User")
const validator = require("validator");
const passport = require("passport");
const axios = require("axios")
const Mailjet = require('node-mailjet');

module.exports = {
  getProfile: async (req, res) => {
    try {
      
      //how to sort uniquePatArr by lastName property from each object in array
      const patients = await newPatient.find().sort({lastName: "asc"});
      //console.log(patients)

      const wound = await WoundInfo.find(); //All wounds
      //console.log(wound)

      ///////////// Array of all patients from wounds

      let WpatientArr = []
      for(let i=0;i<wound.length;i++){
        WpatientArr.push(wound[i].patient)
      }
      //console.log(WpatientArr) 

      /////////////Array of patients with no duplicates (because there are can be multiple wounds under same name)
      let unique = [];
      function removeDuplicates(arrwound) { 
         
        arrwound.forEach(element => { 
            if (!unique.includes(element)) { 
                unique.push(element); 
            } 
        }); 
        return unique
        
    } 
    removeDuplicates(WpatientArr)
    //console.log(unique)

    ////////////Trying to sort wounds by name (arr of unique names now being sorted by last name?)
    let newArr = []
    let sortedUniquePatArr = [];
    for(let j=0;j<unique.length;j++){
      let uniquePatArr = await newPatient.find({_id:unique[j]});
      //console.log(uniquePatArr)
      newArr.push(uniquePatArr[0])
      
      //console.log(newArr)
  

      let sortedUniquePatArr = newArr.sort((a, b) => {
        const lastNameA = a.lastName.toUpperCase(); // Ignore case
        const lastNameB = b.lastName.toUpperCase(); // Ignore case
        
        if (lastNameA < lastNameB) {
          return -1;
        }
        if (lastNameA > lastNameB) {
          return 1;
        }
        return 0;
      });
    
      
      //console.log(sortedUniquePatArr)

    }

    //console.log('outside' + sortedUniquePatArr)

    for(let k=0;k<sortedUniquePatArr.length;k++){
      //console.log(sortedUniquePatArr[k])
    }

    //console.log(req.user)
    //console.log(req.body)
    

       

    //LIVE CLOCK

    
      res.render("profile.ejs", { user: req.user, wound: newArr, patients: patients});
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
        //console.log(validationErrors)
        req.flash("errors", validationErrors);
        return res.redirect("/newPatient");
      }

      const firstCapArr = req.body.firstName.split('')
      const firstNameCap = firstCapArr[0].toUpperCase()+firstCapArr.join('').substring(1)

      const lastCapArr = req.body.lastName.split('')
      const lastNameCap = lastCapArr[0].toUpperCase()+lastCapArr.join('').substring(1)
      


    await newPatient.create({
      firstName: firstNameCap,
      lastName: lastNameCap,
    });

    
    //console.log()
    console.log(`Patient: ${firstCap} ${lastCap} Created!!!!`)
      res.redirect("/newPatient")
    }catch (err) {
      console.log(err);
    }
  },
  getConfirmDeletePatient: async (req,res) => {
    try{
      const patient = await newPatient.findById(req.params.id)
      //console.log(patient)


      res.render("confirmation.ejs",{patient:patient})
    }catch (err) {
    console.log(err);
  }
  },
  deletePatient: async (req,res) => {
    

  try{
    /////CONFIRM
    
    /////
    const thispatient = await newPatient.findOne({_id:req.params.id})
    //console.log(thispatient)

    const thisPatientWoundsArr = await WoundInfo.find({patient: req.params.id})
    //console.log(thisPatientWoundsArr)

    await WoundInfo.deleteMany({patient: req.params.id})
    await newPatient.deleteOne({_id: req.params.id})

    //for(i=0;i<WoundInfo.length;i++){
      //const thisPatientWounds = await WoundInfo[i].findbyId()
    //}

   

    console.log("!!!!Patient/Wound Info Deleted!!!!")
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
      //console.log(patient)
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

      if (validator.isEmpty(req.body.length)) {
        validationErrors.push({ param: "length", msg: "Length requires input" });
      } else if (!validator.isNumeric(req.body.length)) {
        validationErrors.push({ param: "length", msg: "Length must be a number" });
      }
      
      if (validator.isEmpty(req.body.width)) {
        validationErrors.push({ param: "width", msg: "Width requires input" });
      } else if (!validator.isNumeric(req.body.width)) {
        validationErrors.push({ param: "width", msg: "Width must be a number" });
      }
      
      if (validator.isEmpty(req.body.depth)) {
        validationErrors.push({ param: "depth", msg: "Depth requires input" });
      } else if (!validator.isNumeric(req.body.depth)) {
        validationErrors.push({ param: "depth", msg: "Depth must be a number" });
      }

      if(validator.isEmpty(req.body.description))validationErrors.push({ param: "description", msg: "Description Requires Input"});
      if(validator.isEmpty(req.body.intervention))validationErrors.push({ param: "intervention", msg: "Intervention Requires Input"});
      if (validationErrors.length) {
        console.log(validationErrors)
        req.flash("errors", validationErrors);
        return res.redirect(`/wound/newWoundForm/${req.params.id}`);
      }

      const patient = await newPatient.find({_id: req.params.id})
      //console.log(patient)
      const Pname = patient[0].firstName
      //console.log(Pname)
      const user = await User.findById(req.user.id)
      //console.log(user)
      //console.log(user.userName)

      //api key: 6f5a5acc1e1adb46c07c82a644d2e405
      //secret key: 879c7cbd0da7418cbcb33f127b47d237

      /////Send Email
      
      function sendEmail (SendTo){
        const Mailjet = require('node-mailjet');
        
        const mailjet = new Mailjet({
          apiKey: process.env.MJ_APIKEY_PUBLIC,
          apiSecret: process.env.MJ_APIKEY_SECRET,
         
        });
      
        const request = mailjet
        .post('send', { version: 'v3.1' })
        .request(//{
                 //Messages: 
                 //[
                 //  {
                 //    From: {
                 //      Email: "gjarred23@gmail.com",
                 //      Name: "Mailjet Test"
                 //    },
                 //    To: [
                 //      {
                 //        Email: "gjarred23+swe@gmail.com",
                 //        Name: "Test1"
                 //      }
                 //    ],
                 //    Subject: "Your email flight plan!",
                 //    TextPart: "Dear passenger 1, welcome to Mailjet! May the delivery force be with you!",
                 //    HTMLPart: "<h3>Dear passenger 1, welcome to <a href=\"https://www.mailjet.com/\">Mailjet</a>!</h3><br />May the delivery force be with you!"
                 //  }
                 //]
                 //}
                 SendTo //New object with info from form and message template 
                 )

              request
                 .then((result) => {
                     console.log(result.body)
                     console.log("Email Sent")
                 })
                 .catch((err) => {
                     console.log(err.statusCode)
                 })
                   }

      //sendEmail()

      const emailPt = await newPatient.findById(req.params.id)

      if(req.body.DON === "Yes"){
       const DONEmail = {
          Messages: 
          [
            {
              From: {
                Email: "gjarred23@gmail.com",
                Name: "DON EMAIL"
              },
              To: [
                {
                  Email: "gjarred23+swe@gmail.com",
                  Name: "DON EMAIL"
                }
              ],
              Subject: `New Wound for Pt: ${emailPt.firstName} ${emailPt.lastName}`,
              TextPart: `Hello, This patient ${emailPt.firstName} ${emailPt.lastName} has a new ${req.body.type} located ${req.body.location}, check details in App: WoundFixer`,
              HTMLPart: `Hello, This patient <strong>${emailPt.firstName} ${emailPt.lastName}</strong> has a new <strong>${req.body.type}</strong> located on <strong>${req.body.location}</strong>, check details in App: <a href="http://localhost:2026/physicianP/${req.params.id}">Wound Fixer</a>`,

            }
          ]
        }
        
        sendEmail(DONEmail)
      }

      if(req.body.PCP === "Yes"){
        const PCPEmail = {
           Messages: 
           [
            {
              From: {
                Email: "gjarred23@gmail.com",
                Name: "PCP EMAIL"
              },
              To: [
                {
                  Email: "gjarred23+swe@gmail.com",
                  Name: "PCP EMAIL"
                }
              ],
              Subject: `New Wound for Pt: ${emailPt.firstName} ${emailPt.lastName}`,
              TextPart: `Hello, This patient ${emailPt.firstName} ${emailPt.lastName} has a new ${req.body.type} located, ${req.body.location}, check details in App: WoundFixer`,
              HTMLPart: `Hello, This patient <strong>${emailPt.firstName} ${emailPt.lastName}</strong> has a new <strong>${req.body.type}</strong> located on <strong>${req.body.location}</strong>, check details in App: <a href="http://localhost:2026/physicianP/${req.params.id}">Wound Fixer</a>`,

            }
           ]
         }

         sendEmail(PCPEmail)
       }


      
    


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
        creator: req.user.id,
        
      });
      console.log("Wound Info Created")
      res.redirect("/profile")
    }catch (err) {
      console.log(err);
    }
  },
  getAllWounds: async (req,res) => { //createdAt newest to oldest 
    try{

      const pageUser = await User.findById(req.user.id)

      const wounds = await WoundInfo.find().sort({createdAt: "desc"})

      const timeArr = []

      for(let j=0;j<wounds.length;j++){
        timeArr.push(wounds[j].createdAt.toISOString())
        
      }
      //console.log(timeArr)

      // Split each item in timeArr
      const splitTimeArr = timeArr.map(item => item.split(/[T.]/)); // Assuming createdAt is a string with a comma-separated date/time

      //console.log(splitTimeArr);
      const dateArr = []; //array of first item in each array
      const timeArrTwo = []; //array of secind item in each array
      for(let k=0;k<splitTimeArr.length;k++){
        const date = splitTimeArr[k][0]
        const time = splitTimeArr[k][1]

        dateArr.push(date)
        timeArrTwo.push(time)
      }

      

      //console.log(dateArr)
      //console.log(timeArrTwo)

      
      //////////
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
       //console.log(fName)
       const lName = patientName[0].lastName //cycle through and capture last names
       //console.log(lName)
       firstNamesArr.push(fName) //put names into new array
       lastNamesArr.push(lName) 
       

      }
      //console.log(firstNamesArr)
      //console.log(lastNamesArr)
      //console.log(wounds)
      res.render("allwounds.ejs", {date: dateArr, time:timeArrTwo, wounds: wounds, firstNames: firstNamesArr, lastNames:lastNamesArr, user: pageUser,})
    }catch (err) {
      console.log(err);
    }
  },
  getWoundsZtoA: async (req,res) => { //createdAt oldest to newest
    try{

      const pageUser = await User.findById(req.user.id)

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
       //console.log(fName)
       const lName = patientName[0].lastName //cycle through and capture last names
       //console.log(lName)
       firstNamesArr.push(fName) //put names into new array
       lastNamesArr.push(lName) 
       
      }
      //console.log(firstNamesArr)
      //console.log(lastNamesArr)
      //console.log(wounds)

      res.render("allwoundscreatedztoa.ejs", {wounds: wounds, firstNames: firstNamesArr, lastNames:lastNamesArr, user: pageUser,})
    }catch (err) {
      console.log(err);
    }
  },
  getWoundsByPatient: async (req,res) => { //patient A to Z
    try {

      const pageUser = await User.findById(req.user.id)

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
      //console.log(wounds)
    
      // Extract patient names
      const firstNamesArr = wounds.map(wound => patientsMap.get(wound.patient.toString()).firstName);
      const lastNamesArr = wounds.map(wound => patientsMap.get(wound.patient.toString()).lastName);
    
      //console.log(firstNamesArr);
      //console.log(lastNamesArr);


      res.render("allwoundspatient.ejs", {wounds: wounds, firstNames: firstNamesArr, lastNames:lastNamesArr, user: pageUser,})
    }catch (err) {
      console.log(err);
    }
  },
  getWoundsByPatientZtoA: async (req, res) =>{
    try {

      const pageUser = await User.findById(req.user.id)

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
      //console.log(wounds)
    
      // Extract patient names
      const firstNamesArr = wounds.map(wound => patientsMap.get(wound.patient.toString()).firstName);
      const lastNamesArr = wounds.map(wound => patientsMap.get(wound.patient.toString()).lastName);
    
      //console.log(firstNamesArr);
      //console.log(lastNamesArr);
    
      // Render the view with sorted data
      res.render("allwoundspatientztoa.ejs", { wounds, firstNames: firstNamesArr, lastNames: lastNamesArr , user: pageUser,});
    } catch (err) {
      console.log(err);
    }
    
  },
  getPatientPage: async (req,res) => {
    try{
      const patientWounds = await WoundInfo.find({patient: req.params.id}).sort({createdAt: "asc"})

      const patient = await newPatient.find({_id: req.params.id})
      const thisPatient = patient[0]
      const first = patient[0].firstName
      const last = patient[0].lastName
      const count = await WoundInfo.find({patient: req.params.id}).countDocuments()
      //console.log(patientWounds)
      //console.log(patient)
      //console.log(thisPatient)
      //console.log(count)

     

      ////Recent woundDoc Info
      const allWoundDocs = await WoundDoc.find({ Patient: req.params.id })
      .populate('user') // assuming each doc has a user who updated it
      .sort({ createdAt: -1 }); // newest first
      //console.log(allWoundDocs)
    
    // Group only the first (most recent) doc per wound
    const woundDocsByWound = {};
    for (let doc of allWoundDocs) {
      const woundId = doc.originalWoundId.toString();
      if (!woundDocsByWound[woundId]) {
        woundDocsByWound[woundId] = [doc]; // only save the first one (newest)
      }
    }
    


    res.render("patientpage.ejs", { 
      wounds: patientWounds, 
      firstName: first, 
      lastName: last, 
      count:count, 
      patient: thisPatient,
      woundDocsByWound,
    });
  } catch (err) {
    console.log(err);
  }
  },
  






  
 
  
};
