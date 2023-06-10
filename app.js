const express = require("express");
const cors = require("cors")
const morgan = require("morgan");
require('dotenv').config();
require("express-async-errors")
require("./db");

const userRouter = require("./routes/user");
const actorRouter = require("./routes/actor");
const { errorHandler } = require("./middlewares/error");
const { handleNotFound } = require("./utils/helper");
const app = express();

//accept the json data
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use('/api/user', userRouter);
app.use('/api/actor', actorRouter);
app.use("/*", handleNotFound);

app.use(errorHandler)


//---------------------------------------------------
app.listen(process.env.PORT, () => {
    console.log(`the port is listening on port ${process.env.PORT}`);
})