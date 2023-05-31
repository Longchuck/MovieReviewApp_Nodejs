const express = require("express");
const {Create, verifyEmail, resendEmailVerificationToken, forgetPassword} = require("../controler/user");
const { userValidator, validate } = require("../middlewares/validator");

const router = express.Router();

router.post("/create",userValidator, validate, Create);
router.post("/verify-email",verifyEmail);
router.post("/resend-email-verification-token",resendEmailVerificationToken);
router.post("/foget-password",forgetPassword);

module.exports = router;