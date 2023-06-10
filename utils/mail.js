const nodemailer = require("nodemailer");
exports.generateOTP = (otpLength = 6) => {
  // generate 6 digit token
  let OTP = "";
  for (let i = 1; i <= otpLength; i++) {
    const randomValue = Math.round(Math.random() * 9);
    OTP += randomValue;
  }
  console.log("otp 1: "+OTP);
  return OTP;
};

exports.generateMailTransporter = () =>
  nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.MAIL_TRAP_USER,
      pass: process.env.MAIL_TRAP_PASSWORD,
    },
  });
