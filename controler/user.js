const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const PasswordResetToken = require("../models/passwordResetToken");
const EmailVerificationToken = require("../models/emailVerificationToken");

const {isValidObjectId} = require("mongoose");
const { generateOTP, generateMailTransporter } = require("../utils/mail");
const { sendError, generateRandomByte } = require("../utils/helper");
const { body } = require("express-validator");

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
  var transport = generateMailTransporter();

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

  const isMatchedToken = await token.compareToken(OTP);
  if(!isMatchedToken) return sendError(res,"please submit a valid OTP!!");

  user.isVerified = true;
  await user.save();

  await EmailVerificationToken.findByIdAndDelete(token._id);

  const transport = generateMailTransporter();

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
    const transport = generateMailTransporter();

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

exports.forgetPassword = async (req,res) => {
  const {email} = req.body;

  if(!email) return sendError(res,"please send invalid email!!");

  const user = await User.findOne({email});
  if(!user) return sendError(res,"not found user!!",404);

  const alreadyExistToken = await PasswordResetToken.findOne({owner: user._id});
  if (alreadyExistToken) return res.json({error : "Only after one hour you can request for another OTP"});

  const token = await generateRandomByte();
  const newPasswordResetToken = await PasswordResetToken({owner: user._id, token});
  await newPasswordResetToken.save();

  const resetPasswordUrl = `http://localhost:3000/reset-password?token=${token}&id=${user._id}`;

  const transport = generateMailTransporter();

  transport.sendMail({
      from: "verification@reviewapp.com",
      to: user.email,
      subject: "Email verification",
      html: `
              <p>Your verification OTP</p>
              <a href = "${resetPasswordUrl}">Change password </a>
          `,
  });

  res.json({meesage: "link sent to your email"});

}

exports.sendResetPasswordTokenStatus = (req,res) => {
  res.json({ valid: true });
}
exports.resetPassword = async (req,res) => {
  const { newPassword, userId} = req.body;

  const user = await User.findById(userId);
  const isMatchedPassword = await user.comparePassword(newPassword);
  if(isMatchedPassword) return sendError(res, "The new password must be different from the old one!");

  user.password = newPassword;
  await user.save();

  await PasswordResetToken.findByIdAndDelete(req.resetToken._id);

  const transport = generateMailTransporter();

  transport.sendMail({
      from: "sercurity@reviewapp.com",
      to: user.email,
      subject: "Password reset successfully",
      html: `
              <h1>Password Reset Successfully</h1>
              <p> Now you can use new password </p>
          `,
  });

  res.json({meesage: "Password reset successfully!"});
}

exports.signIn = async (req, res) => {
  const {email, password} = req.body;

  const user = await User.findOne({ email });
  if(!user) sendError(res, "not found user", 404);

  const isMatchedPassword = await user.comparePassword(password);
  if(!isMatchedPassword) sendError(res, "wrong password");

  const {_id, name} = user;

  const jwtToken= jwt.sign(
    {userId: _id},
    "DayLaReviewAppCuaLong12345"
  )
  res.json({user: {id: user._id, name, email, token: jwtToken}})

}