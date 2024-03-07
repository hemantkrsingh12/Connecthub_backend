const router= require("express").Router();
const postcontroller= require("../Controller/PostController")
const verifymiddleware= require("../Middleware/requireuser");

router.post("/",verifymiddleware, postcontroller.createpostController);
router.post("/likeUnlike",verifymiddleware, postcontroller.likeUnlikePost)
router.post("/updatepost",verifymiddleware, postcontroller.updatePostcontroller);
router.post("/deletepost",verifymiddleware,postcontroller.deletepost);
module.exports = router;