const { check, validationResult } = require("express-validator");

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
    .withMessage("Password must be 8-20 character long!")
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
    .withMessage("Password must be 8-20 character long!")
  ];

exports.actorInfoValidate = [
  check("name").trim().not().isEmpty().withMessage("Name is missing"),
  check("about").trim().not().isEmpty().withMessage("about is missing"),
  check("gender").trim().not().isEmpty().withMessage("gender is missing"),
]

exports.validate = (req,res,next) => {
    const error = validationResult(req).array();
    if (error.length){
        return res.json({ error: error[0].msg });
    }
    next()
}
