const express = require("express");
const {Create} = require("../controler/user");

const router = express.Router();

router.post("/create", Create)

module.exports = router;