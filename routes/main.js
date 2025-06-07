const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const homeController = require("../controllers/home");
const woundController = require("../controllers/wound");
const managerialController = require("../controllers/managerial")
const { ensureAuth, ensureGuest } = require("../middleware/auth");
const { confirmActionMiddleware } = require("../middleware/middle");
const { authorizeRoles } = require("../middleware/role");

//Main Routes - simplified for now
router.get("/", homeController.getIndex);
router.get("/profile", ensureAuth, woundController.getProfile);
//router.get("/feed", ensureAuth, woundController.getFeed);
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);
router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);

//Manager routes
router.get("/editRoles", ensureAuth, authorizeRoles("admin", "manager"), managerialController.getroleEdit)
router.put("/updateRoles/:id", ensureAuth, authorizeRoles("admin", "manager"), managerialController.putroleEdit )
router.get("/editUsers", ensureAuth, authorizeRoles("admin"), managerialController.getEditUser )
router.get("/confirmDeleteUser/:id", ensureAuth, authorizeRoles("admin"),managerialController.getConfirmDeleteUser)
router.delete("/deleteUser/:id", ensureAuth, authorizeRoles("admin", "manager"), managerialController.deleteUser )
router.get("/physicianP", ensureAuth, authorizeRoles("admin", "manager"), managerialController.getPhysicianP )
router.get("/physicianP/:id", ensureAuth, authorizeRoles("admin", "manager"), managerialController.getPhysicianPtPage )

//patient
router.get("/newPatient", ensureAuth, woundController.getAddPatient)
router.post("/newPatient", ensureAuth, woundController.postAddPatient)
router.get("/confirmDelete/:id", ensureAuth, woundController.getConfirmDeletePatient)
router.delete("/deletePatient/:id", ensureAuth, woundController.deletePatient)
router.get("/patientpage/:id",ensureAuth, woundController.getPatientPage)
//wound;

//router.get("/newWoundForm", ensureAuth, woundController.getWoundForm);

//router.post("/postWoundForm", ensureAuth, woundController.postWoundForm);


module.exports = router;
