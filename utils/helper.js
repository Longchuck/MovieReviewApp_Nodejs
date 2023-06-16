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
  const { name, gender, about, _id, avatar } = actor;
  return {
    id: _id,
    name: name,
    about: about,
    gender: gender,
    avatar: avatar?.url,
  };
};

exports.parseData = (req, res, next) => {
  const { genres, tags, cast, writers, trailer } = req.body;

  if(genres) req.body.genres = JSON.parse(genres);
  if(tags) req.body.tags = JSON.parse(tags);
  if(cast) req.body.cast = JSON.parse(cast);
  if(writers) req.body.writers = JSON.parse(writers);
  if(trailer) req.body.trailer = JSON.parse(trailer);
  next();
};
