const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const emailVerificationTokenSchema = mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createAt: {
    type: Date,
    exprires: 3600,
    default: Date.now(),
  },
});

//hashing token
emailVerificationTokenSchema.pre("save", async function (next) {
  if (this.isModified("token")) {
    this.token = await bcrypt.hash(this.token, 10);
  }
  next();
});

//compare token with hash token in dbs
emailVerificationTokenSchema.methods.compaireToken = async function(token) {
  const result = await bcrypt.compare(token, this.token);
  return result;
}

module.exports = mongoose.model(
  "EmailVerificationToken",
  emailVerificationTokenSchema
);


