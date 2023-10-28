const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const woundController = require("../controllers/wound");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Wound Routes
router.get("/newWoundForm/:id", ensureAuth, woundController.getWoundForm);

router.post("/postWoundForm/:id?", ensureAuth, woundController.postWoundForm);

router.get("/allWounds", ensureAuth, woundController.getAllWounds)

router.get("/woundsZtoA", ensureAuth, woundController.getWoundsZtoA)

router.get("/woundsPatient", ensureAuth, woundController.getWoundsByPatient)

router.get("/woundsPatientZtoA", ensureAuth, woundController.getWoundsByPatientZtoA)







module.exports = router;
