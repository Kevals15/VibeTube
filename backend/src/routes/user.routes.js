import { Router } from "express";
import {
    changeCurrentPassword,
    getCurrentUser,
    getUserProfile,
    getWatchHistory,
    loginUser,
    logoutUser,
    refreshAccessToken,
    registerUser,
    updateUserAvatar,
    updateUserCoverImage,
    updateUserDetails
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

// if request comes from post /users from app.js is the request is users/register it calls the function registerUser from controller user.controller.js

// Now to add file we can use middleware 
//  upload is import for file 
// we can use this before post request that means before post or register user we want to do something

router.route("/register").post(
    // we cannot use upload.array it can store images in a single line instead we can use upload.fields which takes array we can use object to give name of image and maxcount for that field
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverimage",
            maxCount: 1
        }
    ]),
    registerUser
);

router.route("/login").post(loginUser)

// secure routes whoever user logged in only they get this routes

// here before calling logoutUser we can first send it to middleware to verifyJWT and then using next() it knows that next in queue for execute is logoutuser

router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-Token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/update-account").patch(verifyJWT, updateUserDetails)
router.route("/update-avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)
router.route("/update-coverimage").patch(verifyJWT, upload.single("coverimage"), updateUserCoverImage)

// for data which we get from url or params give same name as destructured in controller

router.route("/c/:username").get(verifyJWT, getUserProfile)
router.route("/watch-history").get(verifyJWT, getWatchHistory)

export default router;