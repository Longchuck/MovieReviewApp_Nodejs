const express = require("express");
const { createActor, updateActor, removeActor } = require("../controler/actor.controler");
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
router.delete('/:id',
  // validate,
  removeActor);

module.exports = router;
