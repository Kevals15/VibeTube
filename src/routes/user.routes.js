import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js"
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
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
);

export default router;