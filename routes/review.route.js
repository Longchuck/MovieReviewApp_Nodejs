const router = require("express").Router();
const {
  addNewReview,
  updateReview,
  RemoveReview,
  getReviewByMovie,
} = require("../controler/review.controller");
const { isAuth } = require("../middlewares/auth");
const { validateRating, validate } = require("../middlewares/validator");

router.post("/add/:movieId", isAuth, validateRating, validate, addNewReview);
router.patch("/:reviewId", isAuth, validateRating, validate, updateReview);
router.delete("/:reviewId", isAuth, RemoveReview);
router.get("/get-reviews-by-movie/:movieId", getReviewByMovie);

module.exports = router;
