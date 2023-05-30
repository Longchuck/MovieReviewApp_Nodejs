const nodemailer = require("nodemailer");
const User = require("../models/user");
const EmailVerificationToken = require("../models/emailVerificationToken");

exports.Create = async (req, res) => {
  // console.log(req.body);
  const { name, email, password } = req.body;

  const oldUser = await User.findOne({ email });

  if (oldUser) {
    return res.status(401).json({ err: "this email is already existed" });
  }
  const newUser = new User({ name, email, password });
  await newUser.save();

  // generate 6 digit token
  let OTP = "";
  for (let i = 0; i <= 5; i++) {
    const randomValue = Math.round(Math.random() * 9);
    OTP += randomValue;
  }

  // store OTP inside out db
  const newEmailVerificationToken = new EmailVerificationToken({
    owner: newUser._id,
    token: OTP,
  });

  await newEmailVerificationToken.save();

  // send that OTP to user email
  var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "533e36f04dbc5f",
      pass: "2d04a27ae14e39",
    },
  });

  transport.sendMail({
    from: "verification@reviewapp.com",
    to: newUser.email,
    subject: "Email verification",
    html: `
            <p>Your verification OTP</p>
            <h1>${OTP}</h1>
        `,
  });

  res
    .status(201)
    .json({
      message:
        "please verify your email. OTP has been sent to your email account!!",
    });
};
