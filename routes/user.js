const express = require("express");
const {Create, verifyEmail, resendEmailVerificationToken, forgetPassword, sendResetPasswordTokenStatus, resetPassword} = require("../controler/user");
const { userValidator, validate, validatePassword } = require("../middlewares/validator");
const { isValidPassResetToken } = require("../middlewares/user");

const router = express.Router();

router.post("/create",userValidator, validate, Create);
router.post("/verify-email",verifyEmail);
router.post("/resend-email-verification-token",resendEmailVerificationToken);
router.post("/foget-password",forgetPassword);
router.post(
  "/verify-pass-reset-token",
  isValidPassResetToken,
  sendResetPasswordTokenStatus
);
router.post(
  "/reset-password",
  validatePassword,
  validate,
  isValidPassResetToken,
  resetPassword
);


module.exports = router;