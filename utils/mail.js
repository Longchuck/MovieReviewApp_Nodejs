const nodemailer = require("nodemailer");
exports.generateOTP = (otpLength = 6) => {
  // generate 6 digit token
  let OTP = "";
  for (let i = 1; i <= otpLength; i++) {
    const randomValue = Math.round(Math.random() * 9);
    OTP += randomValue;
  }
};

exports.generateMailTransporter = () =>
  nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "533e36f04dbc5f",
      pass: "2d04a27ae14e39",
    },
  });
