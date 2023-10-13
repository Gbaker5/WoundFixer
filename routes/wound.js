const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const woundController = require("../controllers/wound");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Wound Routes
router.get("/newWoundForm", ensureAuth, woundController.getWoundForm);







module.exports = router;