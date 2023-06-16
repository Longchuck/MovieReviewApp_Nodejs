const Actor = require("../models/actor");
const cloudinary = require("cloudinary").v2;
const { isValidObjectId } = require("mongoose");
const { sendError, fomatActor } = require("../utils/helper");
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  // secure = true;
});

exports.createActor = async (req, res) => {
  const { name, about, gender } = req.body;
  const { file } = req;

  const newActor = await Actor({ name, about, gender });
  // console.log(file);
  // console.log(req);
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    file.path,
    { gravity: "face", height: 500, width: 500, crop: "thumb" }
  );
  newActor.avatar = { url: secure_url, public_id };

  await newActor.save();
  res.status(201).send(fomatActor(newActor));
};

exports.updateActor = async (req, res) => {
  const { name, about, gender } = req.body;
  const { file } = req;
  const { id } = req.params;

  if (!isValidObjectId(id)) return sendError(res, "invalid id request!");
  const actor = await Actor.findById(id);
  if (!actor) return sendError(res, "Actor not found");

  const public_id = actor.avatar?.public_id;

  //remove old avatar if there was one!
  if (public_id && file) {
    const { result } = await cloudinary.uploader.destroy(public_id);
    if (result != "ok") {
      return sendError(res, "could not remove old avatar");
    }
  }
  //upload new avatar if there is one!
  if (file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      { gravity: "face", height: 500, width: 500, crop: "thumb" }
    );
    actor.avatar = { url: secure_url, public_id };
  }
  actor.name = name;
  actor.about = about;
  actor.gender = gender;
  await actor.save();
  res.status(200).send(fomatActor(actor));
};

//export function delete actor
exports.removeActor = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  if (!isValidObjectId(id)) return sendError(res, "invalid id request!");

  const actor = await Actor.findById(id);
  if (!actor) return sendError(res, "Actor not found");

  const public_id = actor.avatar?.public_id;

  //remove old avatar if there was one!
  if (public_id) {
    const { result } = await cloudinary.uploader.destroy(public_id);
    console.log(result);
    if (result != "ok") {
      return sendError(res, "could not remove old avatar");
    }
  }

  //remove actor if there was one
  await Actor.findByIdAndDelete(id);
  res.json({ Message: "record deleted successfully" });
  
};

exports.searchActor = async (req, res) => {
  const { query } = req;
  console.log(query);
  const results = await Actor.find({$text : {$search: `"${query.name}"`}});

  const actors = results.map(actor => fomatActor(actor));
  res.json(actors);
};

//get the latest actor
exports.getLatestActor = async (req, res) => {
  const results = await Actor.find().sort({ createdAt: -1 }).limit(12);

  const actors = results.map(actor => fomatActor(actor));
  res.json(actors);
};

//get single actor
exports.getSingleActor = async (req, res) => {
  const {id} = req.params;
  if(!isValidObjectId(id)) return sendError(res,"Invalid request id");

  const actor = await Actor.findById(id);
  if(!actor) return sendError(res,"not found actor",404);
  res.json(fomatActor(actor));
}