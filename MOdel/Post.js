const mongoose = require("mongoose");
const PostSchema = mongoose.Schema({
  image: {
    Publicid: String,
    url: String,
  },
  caption: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
},
  likes: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
},{
  timestamps:true
});

module.exports = mongoose.model("Post", PostSchema);
