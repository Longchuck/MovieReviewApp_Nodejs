const express = require("express");
const {Create} = require("../controler/user");
const { userValidator, validate } = require("./middlewares/validator");

const router = express.Router();

router.post("/create",userValidator, validate, Create)

module.exports = router;