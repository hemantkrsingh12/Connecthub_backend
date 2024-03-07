
var ta = require('time-ago')
const mapOutput = (post, userid) => {
    return {
      _id: post?._id,
      image: post?.image,
      caption:post?.caption,
      owner: {
        _id: post?.owner._id,
        name: post?.owner.name,
        avatar: post?.owner.avatar,
      },     
      likecount: post.likes.length,
      isliked: post.likes.includes(userid),
      timeAgo:ta.ago(post?.createdAt)
    };
  };
  
  module.exports = { mapOutput };
  