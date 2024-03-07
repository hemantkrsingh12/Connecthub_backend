const User = require("../MOdel/User");
const Post = require("../MOdel/Post");
const { error, success } = require("../Utils/Request");
const cloudinary = require("cloudinary");
const { mapOutput } = require("../Utils/Utiles");
const followUnfollowController = async (req, res) => {
  try {
    const { idtofollow } = req.body;
    const curuserid = req._id;
    const usertofollow = await User.findById(idtofollow);
    const curuser = await User.findById(curuserid);

    if (!usertofollow) {
      return res.send(error(404, "User not found"));
    }

    if (idtofollow === curuserid) {
      return res.send(error(409, "User can't follow themselves"));
    }

    if (curuser.following && curuser.following.includes(idtofollow)) {
      const followingindex = curuser.following.indexOf(idtofollow);
      const followerindex = usertofollow.follower.indexOf(curuserid);
      curuser.following.splice(followingindex, 1);
      usertofollow.follower.splice(followerindex, 1);
      await curuser.save();
      await usertofollow.save();
      return res.send(success(200, { usertofollow, info: "User unfollowed" }));
    } else {
      curuser.following.push(idtofollow);
      usertofollow.follower.push(curuserid);
      await curuser.save();
      await usertofollow.save();
      return res.send(success(200, { usertofollow, info: "User followed" }));
    }
  } catch (e) {
    console.log(e);
    return res.send(error(500, e.message));
  }
};

const getpostoffollowing = async (req, res) => {
  try {
    const curuserid = req._id;
    const curuser = await User.findById(curuserid).populate("following");
    const fullpost = await Post.find({
      owner: {
        $in: curuser.following,
      },
    }).populate("owner");
    const posts = fullpost.map((item) => mapOutput(item, curuserid)).reverse();
    const followingids = curuser.following.map((item) => item._id);
    followingids.push(curuserid);

    const suggestions = await User.find({
      _id: {
        $nin: followingids,
      },
    });
    //  const notfollowing = await User.find({
    //   _id:{
    //     $nin: curuser.following
    //   }
    //  })
    //  const suggestion=  await notfollowing?.map(item=>mapOutput(item,req._id));

    return res.send(success(200, { ...curuser._doc, suggestions, posts }));
  } catch (e) {
    console.log(e);
    return res.send(error(500, e.message));
  }
};

const getmypostcontroller = async (req, res) => {
  try {
    const curuserid = req._id;

    const post = await Post.find({ owner: curuserid });

    return res.send(success(200, { post }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const getUserpost = async (req, res) => {
  try {
    const { userid } = req.body;

    const posts = await Post.find({
      owner: userid,
    });
    return res.send(success(200, { posts }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const deleteprofile = async (req, res) => {
  try {
    const curuserid = req._id;
    const curuser = await User.findById(curuserid);

    //deleting all the posts
    await Post.deleteMany({
      owner: curuserid,
    });

    //deleting user from the follower of the other

    curuser.following.forEach(async (element) => {
      const followeduser = await User.findById(element);
      const index = followeduser.follower.indexOf(curuserid);
      followeduser.follower.splice(index, 1);
      await followeduser.save();
    });

    //deleteing following of the other user

    curuser.follower.forEach(async (element) => {
      const followeruser = await User.findById(element);
      const index = followeruser.following.indexOf(curuserid);
      followeruser.following.splice(index, 1);
      await followeruser.save();
    });

    //Deleteing likes from all the posts;
    const post = await Post.find();
    post.forEach(async (element) => {
      const index = element.likes.indexOf(curuserid);
      element.likes.splice(index, 1);
      await element.save();
    });

    await User.deleteOne({
      _id: curuserid,
    });

    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
    });
    return res.send(success(200, "Profile deleted successfully"));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const getmyinfo = async (req, res) => {
  try {
    const user = await User.findById(req._id).populate("posts");
    return res.send(success(200, { user }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};
const updateProfile = async (req, res) => {
  try {
  
    const { img, name, bio } = req.body;
    const curuserId = req._id;
    const user = await User.findById(curuserId);

    if (name !== undefined) {
      user.name = name;
    }

    if (img) {
      if (user.avatar && user.avatar.PublicId) {
        await cloudinary.uploader.destroy(user.avatar.PublicId);
      }

      const cloudImg = await cloudinary.uploader.upload(img, {
        folder: "ProfileImg",
      });

      user.avatar = {
        PublicId: cloudImg.public_id,
        url: cloudImg.secure_url,
      };

    }

    if (bio !== undefined) {
      user.bio = bio;
    }

    await user.save();

    return res.send(success(200, { user }));
  } catch (e) {
    return res.send(error(e.message));
  }
};

const getuserProfile = async (req, res) => {
  try {
    const { userid } = req.body;
    const user = await User.findById(userid).populate({
      path: "posts",
      populate: {
        path: "owner",
      },
    });

    const fullpost = user.posts;
    const posts = await fullpost
      .map((item) => mapOutput(item, userid))
      .reverse();

    return res.send(success(200, { ...user._doc, posts }));
  } catch (e) {
    return res.send(error(e.message));
  }
};

module.exports = {
  followUnfollowController,
  getpostoffollowing,
  getmypostcontroller,
  getUserpost,
  deleteprofile,
  getmyinfo,
  updateProfile,
  getuserProfile,
};
