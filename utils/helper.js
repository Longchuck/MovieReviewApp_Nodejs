const crypto = require("crypto");
exports.sendError = (res, error, statusCode = 401) => {
  res.status(statusCode).json({ error });
};

exports.generateRandomByte = () => {
  //generate unit token but random all the time!
  return new Promise((resolve, reject) => {
    crypto.randomBytes(30, (err, buff) => {
      if (err) reject(err);
      const buffString = buff.toString("hex");

      resolve(buffString);
    });
  });
};

exports.handleNotFound = (req, res) => {
  this.sendError(res, "Not found", 404);
};

exports.fomatActor = (actor) => {
  const {name, gender, about, _id, avatar} = actor;
  return {
    id: _id,
    name: name,
    about: about,
    gender: gender,
    avatar: avatar?.url,
  }
}