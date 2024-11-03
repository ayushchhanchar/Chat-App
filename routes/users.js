const mongoose = require("mongoose");

const plm = require("passport-local-mongoose");

mongoose.connect("mongodb+srv://ayush8388:UO0Ibj3GoKOuhu4Y@cluter2.qfvyl.mongodb.net/?retryWrites=true&w=majority&appName=cluter2");

const userschema = new mongoose.Schema({
  email: String,
  username: String,
  password: String,
  picture:String,
  likes: {
    type: Array,
    default: []
  }
});

userschema.plugin(plm);


module.exports = mongoose.model("user", userschema);
