const express = require("express");
const router = express.Router();
const gamesController = require("../controllers/gamesController");

router.get("/games", gamesController.index);
router.post("/games", gamesController.create);

module.exports = router;
