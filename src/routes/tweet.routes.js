import { Router } from "express";
import { createTweet, deleteTweet, getUserTweets, updateTweet } from "../controllers/tweet.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.route("/user/:userId").get(getUserTweets)
router.route("/createtweet").post(verifyJWT, createTweet)
router.route("/updatetweet/:tweetId").patch(verifyJWT, updateTweet)
router.route("/deletetweet/:tweetId").delete(verifyJWT, deleteTweet)


export default router;