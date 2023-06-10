const Actor = require('../models/actor')
const cloudinary = require('cloudinary');
const {isValidObjectId} = require('mongoose');
const {sendError} = require('../utils/helper');
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET, 
    // secure = true;
  });

exports.createActor = async (req,res) => {
    const {name, about, gender} = req.body; 
    const {file} = req;

    const newActor = await Actor({name, about, gender});
    // console.log(file);
    // console.log(req);
    const {secure_url, public_id} = await cloudinary.uploader.upload(file.path);
    newActor.avatar = {url: secure_url, public_id};

    await newActor.save();
    res.status(201).send({
      id: newActor._id,
      name: name,
      about: about,
      gender: gender,
      avatar: newActor.avatar?.url,
    });
}

exports.updateActor = async (req,res) => {
  const {name, about, gender} = req.body; 
  const {file} = req;
  const {id} = req.params;

  if(!isValidObjectId(id)) return sendError(res,"invalid id request!");
  const actor = await Actor.findById(id);
  if(!actor) return sendError(res,'Actor not found');

  const public_id = actor.avatar?.public_id;

  //remove old avatar if there was one!
  if(public_id && file) {
    const {result} = await cloudinary.uploader.destroy(public_id);
    if(result != 'ok') {
      return sendError(res,'could not remove old avatar');
    }
  }
  //upload new avatar if there is one!
  if(file) {
    const {secure_url, public_id} = await cloudinary.uploader.upload(file.path);
    actor.avatar = {url: secure_url, public_id};
  }
  actor.name = name;
  actor.about = about;
  actor.gender = gender;
  await actor.save();
  res.status(200).send({
    id: actor._id,
    name: actor.name,
    about: actor.about,
    gender: actor.gender,
    avatar: actor.avatar?.url,});


}
