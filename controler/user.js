const User = require("../models/user")

exports.Create = async (req, res) => {
    // console.log(req.body);
    const {name, email, password} = req.body;
    
    const newUser = new User({name, email, password});
    await newUser.save();
    res.json({ user: newUser });
};