const express = require("express");
require('dotenv').config();
require("express-async-errors")
require("./db");
const userRouter = require("./routes/user");
const { errorHandler } = require("./middlewares/errorhandler");
const app = express();

//accept the json data
app.use(express.json());
app.use('/api/user', userRouter);
app.use(errorHandler)



//------------test-------------------
// app.post("/sign-in", 
// (req, res, next) => {
//     const {email, password} = req.body;
//     if(!email || !password){
//         return res.status(401).json({error : "email/password is missing"});
//     }
//     next();
// },
// (req, res) => {
//     res.send("<h1> long dep trai o home ne </h1>");
// })

//---------------------------------------------------
app.listen(3000, () => {
    console.log("the port is listening on port 3000");
})