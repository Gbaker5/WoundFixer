const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const woundController = require("../controllers/wound");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Wound Routes
router.get("/newWoundForm/:id", ensureAuth, woundController.getWoundForm);

//router.post("/postWoundForm", ensureAuth, woundController.postWoundForm);






module.exports = router;
