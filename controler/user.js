const nodemailer = require("nodemailer");
const User = require("../models/user");
const EmailVerificationToken = require("../models/emailVerificationToken");

const {isValidObjectId} = require("mongoose");
const { generateOTP, generateMailTransporter } = require("../utils/mail");
const { sendError } = require("../routes/helper");

exports.Create = async (req, res) => {
  // console.log(req.body);
  const { name, email, password } = req.body;

  const oldUser = await User.findOne({ email });

  if (oldUser) {
    return sendError(res,"this email is already existed");
  }
  const newUser = new User({ name, email, password });
  await newUser.save();

  // generate 6 digit token
  let OTP = generateOTP();

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

exports.verifyEmail = async (req, res) => {
  const { userId, OTP } = req.body;

  if(!isValidObjectId(userId)) return sendError(res,"invalid user!"); 

  const user = await User.findById(userId);
  if(!user) return sendError(res,"not found user!");

  if(user.isVerified) return res.json({ error: "user already verified!"});

  const token = await EmailVerificationToken.findOne({owner: userId});
  if(!token) return res.json({error: "not found token!"});

  const isMatchedToken = await token.compaireToken(OTP);
  if(!isMatchedToken) return sendError(res,"please submit a valid OTP!!");

  user.isVerified = true;
  await user.save();

  await EmailVerificationToken.findByIdAndDelete(token._id);

  var transport = generateMailTransporter();

  transport.sendMail({
    from: "verification@reviewapp.com",
    to: user.email,
    subject: "Welcome Email",
    html: `
            <p>Welcome to our app and thank for choosing us.</p>
        `,
  });
  res.json({message : "your email is verified"});

}

exports.resendEmailVerificationToken = async (req, res) => {
    const {userId} = req.body;

    const user = await User.findById(userId);
    if(!user) return res.json({error: "not found user!"});

    if(user.isVerified) return res.json({error: "this email id is already verified"});

    const tokenAlreadyUsed = await EmailVerificationToken.findOne({owner: userId});
    if(tokenAlreadyUsed) return res.json({error : "Only after one hour you can request for another OTP"});

    // generate 6 digit token
    let OTP = generateOTP

    // store OTP inside our db
    const newEmailVerificationToken = new EmailVerificationToken({
        owner: user._id,
        token: OTP,
    });

    await newEmailVerificationToken.save();

    // send that OTP to user email
    var transport = generateMailTransporter();

    transport.sendMail({
        from: "verification@reviewapp.com",
        to: user.email,
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
            "New OTP has been sent to your email account!!",
        });
}
