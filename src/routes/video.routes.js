import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getVideoById, PublishVideo, togglePublishStatus, updateVideo } from "../controllers/video.controller.js";


const router = Router()

router.route("/publishVideo").post(
    verifyJWT,
    upload.fields([
        {
            name: "videoFile",
            maxCount: 1
        },
        {
            name: "thumbnail",
            maxCount: 1
        }
    ]),
    PublishVideo
)

router.route("/v/:videoId").get(getVideoById)
router.route("/update-video/:videoId").patch(verifyJWT, upload.single("thumbnail"), updateVideo)
router.route("/togglestatus/:videoId").patch(verifyJWT, togglePublishStatus)
export default router