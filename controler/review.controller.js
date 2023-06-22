const mongoose = require("mongoose");
const Movie = require("../models/movie.model");
const Review = require("../models/review");
const { isValidObjectId } = require("mongoose");
const { sendError } = require("../utils/helper");

exports.addNewReview = async (req, res) => {
  const { movieId } = req.params;
  const { content, rating } = req.body;
  const userId = req.user._id;
  if (!isValidObjectId(movieId)) return sendError(res, "Invalid movie id");

  const movie = await Movie.findOne({ _id: movieId, status: "public" });
  if (!movie) return sendError(res, "Movie not found", 404);

  const isAlreadyReview = await Review.findOne({
    owner: userId,
    parentMovie: movieId,
  });
  if (isAlreadyReview)
    return sendError(res, "You have already reviewed this movie");

  const newReview = new Review({
    owner: userId,
    parentMovie: movieId,
    content,
    rating,
  });

  //updating movie review
  movie.reviews.push(newReview._id);
  await movie.save();

  //saving new review
  await newReview.save();

  res.status(201).json({
    message: "Review added successfully",
    review: newReview,
  });
};

exports.updateReview = async (req, res) => {
  const { reviewId } = req.params;
  const { content, rating } = req.body;
  const userId = req.user._id;

  if (!isValidObjectId(reviewId)) return sendError(res, "Invalid review id");

  const review = await Review.findOne({ owner: userId, _id: reviewId });
  if (!review) return sendError(res, "Review not found", 404);

  review.content = content;
  review.rating = rating;
  await review.save();

  res.status(200).json({
    message: "Review update successfully",
    review: review,
  });
};

exports.RemoveReview = async (req, res) => {
  const { reviewId } = req.params;
  const userId = req.user._id;

  if (!isValidObjectId(reviewId)) return sendError(res, "Invalid review id");

  const review = await Review.findOne({ owner: userId, _id: reviewId });
  if (!review) return sendError(res, "Review not found", 404);

  const movie = await Movie.findById(review.parentMovie).select("reviews");
  movie.reviews = movie.reviews.filter((rId) => rId.toString() !== reviewId);

  await Review.findByIdAndDelete(reviewId);
  await movie.save();

  res.json({
    message: "Review delete successfully",
  });
};
exports.getReviewByMovie = async (req, res) => {
  const { movieId } = req.params;
  const userId = req.user._id;

  if (!isValidObjectId(movieId)) return sendError(res, "Invalid review id");

  const movie = await Movie.findById(movieId)
    .populate({
      path: "reviews",
      populate: {
        path: "owner",
        select: "name",
      },
    })
    .select("reviews");
  if (!movie) return sendError(res, "Movie not found", 404);

  const reviews = movie.reviews.map((r) => {
    const { _id: reviewId, owner, content, rating } = r;
    const { _id: ownerId, name } = owner;

    return {
      id: reviewId,
      content,
      rating,
      owner: {
        id: ownerId,
        name,
      },
    };
  });

  res.status(200).json(reviews);
};
