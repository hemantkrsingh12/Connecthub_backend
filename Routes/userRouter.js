const requireuser = require("../Middleware/requireuser");
const userController=require("../Controller/Usercontroller");
const router= require("express").Router();

router.post("/follow",requireuser,userController.followUnfollowController);
router.get("/getpost",requireuser,userController.getpostoffollowing);
router.get("/getmypost",requireuser,userController.getmypostcontroller);
router.post("/getuserpost",requireuser,userController.getUserpost)
router.delete("/deleteprofile",requireuser,userController.deleteprofile);
router.get("/getmyinfo",requireuser,userController.getmyinfo)
router.put("/updateprofile",requireuser,userController.updateProfile);
router.post("/getuserprofile",requireuser,userController.getuserProfile);

module.exports = router;