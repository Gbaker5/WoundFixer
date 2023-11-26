const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const homeController = require("../controllers/home");
const woundController = require("../controllers/wound");
const { ensureAuth, ensureGuest } = require("../middleware/auth");
const { confirmActionMiddleware } = require("../middleware/middle");

//Main Routes - simplified for now
router.get("/", homeController.getIndex);
router.get("/profile", ensureAuth, woundController.getProfile);
//router.get("/feed", ensureAuth, woundController.getFeed);
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);
router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);

//patient
router.get("/newPatient", ensureAuth, woundController.getAddPatient)
router.post("/newPatient", ensureAuth, woundController.postAddPatient)
router.get("/confirmDelete/:id", ensureAuth, woundController.getConfirmDeletePatient)
router.delete("/deletePatient/:id", ensureAuth, woundController.deletePatient)
//wound;

//router.get("/newWoundForm", ensureAuth, woundController.getWoundForm);

//router.post("/postWoundForm", ensureAuth, woundController.postWoundForm);


module.exports = router;
