const express = require("express");
const {
  createActor,
  updateActor,
  removeActor,
  searchActor,
  getLatestActor,
  getSingleActor,
} = require("../controler/actor.controler");
const { uploadImage } = require("../middlewares/multer");
const { actorInfoValidate, validate } = require("../middlewares/validator");
const { isAuth, isAdmin } = require("../middlewares/auth");
const router = express.Router();

router.post(
  "/create",
  isAuth,
  isAdmin,
  uploadImage.single("avatar"),
  actorInfoValidate,
  validate,
  createActor
);
router.post(
  "/update/:id",
  isAuth,
  isAdmin,
  uploadImage.single("avatar"),
  actorInfoValidate,
  validate,
  updateActor
);
router.delete("/:id", isAuth, isAdmin, removeActor);
router.get("/search", isAuth, isAdmin, searchActor);
router.get("/latest-uploads", isAuth, isAdmin, getLatestActor);
router.get("/single/:id", getSingleActor);

module.exports = router;
