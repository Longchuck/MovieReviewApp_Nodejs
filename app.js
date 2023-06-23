const express = require("express");
const cors = require("cors")
const morgan = require("morgan");
require('dotenv').config();
require("express-async-errors")
require("./db");

const userRouter = require("./routes/user");
const actorRouter = require("./routes/actor");
const movieRouter = require("./routes/movie.route");
const reviewRouter = require("./routes/review.route");
const adminRouter = require("./routes/admin.route");

const { errorHandler } = require("./middlewares/error");
const { handleNotFound } = require("./utils/helper");
const app = express();

//accept the json data
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use('/api/user', userRouter);
app.use('/api/actor', actorRouter);
app.use('/api/movie', movieRouter);
app.use('/api/review', reviewRouter);
app.use("/api/admin", adminRouter);
app.use("/*", handleNotFound);

app.use(errorHandler)

app.post("/home",
  (req, res) => {
    res.send("<h1>Hello I am from your backend about</h1>");
  });



//---------------------------------------------------
app.listen(process.env.PORT, () => {
    console.log(`the port is listening on port ${process.env.PORT}`);
})