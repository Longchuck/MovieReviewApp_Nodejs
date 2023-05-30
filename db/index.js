const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/movie_review_app")
.then(() => {
    console.log("db is connected");
})
.catch((ex)=>{
    console.log("db is connected failed: ", ex);
})