const express = require("express");
require("./db");
const userRouter = require("./routes/user");


const app = express();

//accept the json data
app.use(express.json());
app.use('/api/user', userRouter);

//------------test-------------------
app.get("/home", (req, res) => {
    res.send("<h1> long dep trai o home ne </h1>");
})

//---------------------------------------------------
app.listen(3000, () => {
    console.log("the port is listening on port 3000");
})