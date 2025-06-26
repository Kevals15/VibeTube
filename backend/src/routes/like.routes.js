import { Router } from "express";
import { getAllLikedVideos, toggleCommentLike, toggleTweetLike, toggleVideoLike } from "../controllers/like.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router()

router.route("/togglelikevideo/:videoId").patch(verifyJWT, toggleVideoLike)
router.route("/togglelikecomment/:commentId").patch(verifyJWT, toggleCommentLike)
router.route("/toggleliketweet/:tweetId").patch(verifyJWT, toggleTweetLike)
router.route("/getlikedvideos").get(verifyJWT, getAllLikedVideos)


export default router;