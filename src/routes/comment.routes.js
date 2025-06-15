import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { addComment, deleteComment, updateComment } from "../controllers/comment.controller.js";
const router = Router()

router.route("/addcomment/:videoId").post(verifyJWT, addComment)
router.route("/updatecomment/:commentId").patch(verifyJWT, updateComment)
router.route("/deletecomment/:commentId").delete(verifyJWT, deleteComment)
export default router;