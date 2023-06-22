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
  check("releseDate").isDate(),
  check("status")
    .isIn(["public", "private"])
    .withMessage("status must be public or private"),
  check("genres")
    .isArray()
    .withMessage("genres must be array of strings")
    .custom((value) => {
      for (let g of value) {
        if (!genres.includes(g)) throw Error("genres must include");
      }
      return true;
    }),
  check("tags")
    .isArray({ min: 1 })
    .withMessage("tags must be array of strings")
    .custom((tags) => {
      for (let tag of tags) {
        if (typeof tag !== "string")
          throw Error("tags must be array of strings");
      }
      return true;
    }),
  check("cast")
    .isArray()
    .withMessage("cast must be array of objects")
    .custom((cast) => {
      for (let c of cast) {
        if (!isValidObjectId(c.actor))
          throw Error("invalid object id inside cast");
        if (!c.roleAs?.trim()) throw Error("invalid roleAs inside cast");
        if (typeof c.leadActor !== "boolean")
          throw Error("only accepted boolean values inside cast");
      }
      return true;
    }),
  check("trailer")
    .isObject()
    .withMessage("trailer must be an objects with url and public_id")
    .custom(({ url, public_id }) => {
      try {
        const result = new URL(url);
        if (!result.protocol.includes("http")) {
          throw Error("invalid trailer url not have http ");
        }

        const array = url.split("/");
        const publicId = array[array.length - 1].split(".")[0];
        if (public_id !== publicId) throw Error("invalid trailer public_id");
        return true;
      } catch (error) {
        throw Error("invalid trailer url");
      }
    }),
  // check("poster").custom((_, { req }) => {
  //   if (!req.file) throw Error("missing file posters");
  //   return true;
  // }),
];

exports.validateRating = check(
  "rating",
  "rating must be a number between 0 and 10"
).isFloat({ min: 0, max: 10 });

exports.validate = (req, res, next) => {
  const error = validationResult(req).array();
  if (error.length) {
    return res.status(500).json({ error: error });
  }
  next();
};
