const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    PublicId: String,
    url: String,
  },
  bio:{
    type: String
  },
  follower: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  following: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  posts: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Post",
    },
  ]
  
},{
  timestamps: true
});
module.exports = mongoose.model("User", UserSchema);
