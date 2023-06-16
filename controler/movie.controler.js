const moongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const { sendError } = require("../utils/helper");
const Movie = require("../models/movie.model");
const { isValidObjectId } = require("mongoose");
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  // secure = true;
});

//upload video trailer to cloudinary
exports.uploadTrailer = async (req, res) => {
  try {
    const { file } = req;
    if (!file) return sendError(res, "video not found");
    const { url, public_id } = await cloudinary.uploader.upload(file.path, {
      resource_type: "video",
    });
    res.status(201).json({ url, public_id });
  } catch (error) {
    res.status(500).json(error);
  }
};
exports.uploadMovie = async (req, res) => {
  const { file, body } = req;
  const {
    title,
    storyLine,
    director,
    releseDate,
    status,
    type,
    genres,
    tags,
    cast,
    writers, 
    trailer,
    language,
  } = body;
  // console.log(req.body);

  const newMovie = new Movie({
    title,
    storyLine,
    releseDate,
    status,
    type,
    genres,
    tags,
    cast,
    trailer,
    language,
  });
  if (director) {
    if (!isValidObjectId(director))
      return sendError(res, "Invalid director id");
    newMovie.director = director;
  }
  if (writers) {
    for (let writerId in writers) {
      if (!isValidObjectId(writerId))
        return sendError(res, "Invalid writer id");
    }
    newMovie.writers = writers;
  }
  //uploading poster
  if (!file) return sendError(res, "poster image not found");

  const {
    secure_url: url,
    public_id,
    responsive_breakpoints,
  } = await cloudinary.uploader.upload(file.path, {
    transformation: {
      width: 1280,
      height: 720,
    },
    responsive_breakpoints: {
      create_derived: true,
      max_width: 640,
      max_images: 3,
    },
  });
  const finalPoster = { url, public_id, responsive: [] };

  const { breakpoints } = responsive_breakpoints[0];
  if (breakpoints.length) {
    for (let imgObj of breakpoints) {
      const { secure_url } = imgObj;
      finalPoster.responsive.push(secure_url);
    }
  }
  newMovie.poster = finalPoster;

  await newMovie.save();

  res.status(201).json({
    movie: {
      id: newMovie._id,
      title,
    },
  });
};
