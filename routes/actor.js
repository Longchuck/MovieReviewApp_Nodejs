const express = require("express");
const { createActor, updateActor } = require("../controler/actor.controler");
const { uploadImage } = require("../middlewares/multer");
const { actorInfoValidate, validate } = require("../middlewares/validator");
const router = express.Router();

router.post(
  "/create",
  uploadImage.single("avatar"),
  actorInfoValidate,
  validate,
  createActor
);
router.post(
  "/update/:id",
  uploadImage.single("avatar"),
  actorInfoValidate,
  validate,
  updateActor
);

module.exports = router;
