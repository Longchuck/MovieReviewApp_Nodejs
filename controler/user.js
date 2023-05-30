const User = require("../models/user")

exports.Create = async (req, res) => {
    // console.log(req.body);
    const {name, email, password} = req.body;

    const oldUser = await User.findOne({email});

    if (oldUser) {
        return res.status(401).json({err : 'this email is already existed'});
    }
    
    const newUser = new User({name, email, password});
    await newUser.save();
    res.status(201).json({ user: newUser });
    
    
    
};