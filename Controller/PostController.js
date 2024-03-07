const { success, error } = require("../Utils/Request");
const User = require("../MOdel/User");
const Post = require("../MOdel/Post");
const cloudinary = require("cloudinary");
const { mapOutput } = require("../Utils/Utiles");
const createpostController = async (req, res) => {
  try {
    const { img, caption } = req.body;
    if (!img) {
      return res.send(error(404, "Add image for post"));
    }
    if (!caption) {
      return res.send(error(404, "Add Caption for post"));
    }
    const owner = req._id;
    const user = await User.findById(owner);
    const cloudImg = await cloudinary.uploader.upload(img, {
      folder: "Postimg",
    });

    const post = await Post.create({
      owner,
      caption,
      image: {
        url: cloudImg.url,
        PublicId: cloudImg.public_id,
      },
    });
    user.posts.push(post._id);
    await user.save();

    return res.send(success(200, post));
  } catch (e) {
    res.send(error(500, e.message));
  }
};

const likeUnlikePost = async (req, res) => {
  try {
    const { postid } = req.body;
    const curuser = req._id;
    const post = await Post.findById(postid).populate("owner");
    if (!post) {
      return res.send(error(404, "Post not found"));
    }
    if (post.likes.includes(curuser)) {
      const index = post.likes.indexOf(curuser);
      post.likes.splice(index, 1);
      await post.save();
      return res.send(success(200, { post: mapOutput(post, req._id) }));
    } else {
      post.likes.push(curuser);
      await post.save();
      return res.send(success(200, { post: mapOutput(post, req._id) }));
    }
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const updatePostcontroller = async (req, res) => {
  try {
    const { postid, caption } = req.body;
    const curuserid = req._id;
    const post = await Post.findById(postid);
    if (!post) {
      return res.send(error(500, " Post Not found "));
    }
    console.log("owner", post.owner.toString());
    console.log("userid", curuserid);

    if (post.owner.toString() !== curuserid) {
      return res.send(error(403, "User can only Update themselves"));
    }

    if (caption) {
      post.caption = caption;
      await post.save();
      return res.send(success(200, post));
    }
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const deletepost = async (req, res) => {
  try {
    const { postid } = req.body;
    const curuserid = req._id;

    const post = await Post.findById(postid);
    const curuser = await User.findById(curuserid);
    if (!post) {
      return res.send(error(404, "Post not found"));
    }

    if (post.owner.toString() !== curuserid) {
      return res.send(error(404, "User can delete only thier post not other"));
    } else {
      const index = curuser.posts.indexOf(postid);
      console.log(index);
      curuser.posts.splice(index, 1);
      await curuser.save();
      await Post.deleteOne({ _id: postid });

      return res.send(success(200, "Post deleted successfully"));
    }
  } catch (e) {
    console.log(e);
    return res.send(error(500, e.message));
  }
};

module.exports = {
  createpostController,
  likeUnlikePost,
  updatePostcontroller,
  deletepost,
};
