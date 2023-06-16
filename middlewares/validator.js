const { check, validationResult } = require("express-validator");
const genres = require("../utils/genres");
const { isValidObjectId } = require("mongoose");

exports.userValidator = [
  check("name").trim().not().isEmpty().withMessage("Name is missing"),
  check("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Email is missing"),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("password is missing")
    .isLength({ min: 8, max: 20 })
    .withMessage("Password must be 8-20 character long!"),
];

exports.validatePassword = [
  check("newPassword")
    .trim()
    .not()
    .isEmpty()
    .withMessage("password is missing")
    .isLength({ min: 8, max: 20 })
    .withMessage("Password must be 8-20 character long!"),
];
exports.signInValidator = [
  check("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Email is missing"),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("password is missing")
    .isLength({ min: 8, max: 20 })
    .withMessage("Password must be 8-20 character long!"),
];

exports.actorInfoValidate = [
  check("name").trim().not().isEmpty().withMessage("Name is missing"),
  check("about").trim().not().isEmpty().withMessage("about is missing"),
  check("gender").trim().not().isEmpty().withMessage("gender is missing"),
];

exports.validateMovie = [
  check("title").trim().not().isEmpty().withMessage("title is missing"),
  check("storyLine").trim().not().isEmpty().withMessage("storyLine is missing"),
  check("language").trim().not().isEmpty().withMessage("language is missing"),
  check("type").trim().not().isEmpty().withMessage("type is missing"),
  check("releseDate").isDate().isEmpty().withMessage("releseDate is missing"),
  check("status")
    .isIn(["public", "private"])
    .isEmpty()
    .withMessage("status must be public or private"),
  check("genres")
    .isArray()
    .withMessage("genres must be array of strings")
    .custom((value) => {
      for (let g in value) {
        if (!genres.includes(g)) throw error("genres must include");
      }
      return true;
    }),
  check("tags")
    .isArray({ min: 1 })
    .withMessage("tags must be array of strings")
    .custom((tags) => {
      for (let tag in tags) {
        if (typeof tag !== "string")
          throw error("tags must be array of strings");
      }
      return true;
    }),
  check("cast")
    .isArray()
    .withMessage("genres must be array of objects")
    .custom((cast) => {
      for (let c in cast) {
        if (!isValidObjectId(c.actor))
          throw error("invalid object id inside cast");
        if (!c.roleAs?.trim()) throw error("invalid roleAs inside cast");
        if (typeof c.leadActor !== "boolean")
          throw error("only accepted boolean values inside cast");
      }
      return true;
    }),
  check("trailer")
    .isObject()
    .withMessage("trailer must be an objects with url and public_id")
    .custom((url, public_id) => {
      try {
        const result = URL(url);
        if (!result.protocol.includes("http"))
          throw error("invalid trailer url: " + url);

        const array = url.split("/");
        const publicId = array[length - 1].split(".")[0];

        if (publicId !== public_id)
          throw error("invalid trailer public_id: " + public);

        return true;
      } catch (error) {
        throw error("invalid trailer url: " + url);
      }
    }),
  check("poster").custom((_, req) => {
    if (!req.file) throw error("missing file posters");
    return true;
  }),
];

exports.validate = (req, res, next) => {
  const error = validationResult(req).array();
  if (error.length) {
    return res.json({ error: error[0].msg });
  }
  next();
};
