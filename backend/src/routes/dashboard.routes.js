import { Router } from "express";
import { getChannelStats, getChannelVideos } from "../controllers/dashboard.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.get("/getchannelstats", verifyJWT, getChannelStats)
router.get("/getchannelvideos", verifyJWT, getChannelVideos)

export default router