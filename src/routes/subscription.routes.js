import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getAllsubscribersList, toggleSubscription } from "../controllers/subscription.controller.js";

const router = Router()

router.route("/getsubscribers/:channelId").get(verifyJWT, getAllsubscribersList)
router.route("/togglesubscription/:channelId").post(verifyJWT, toggleSubscription)

export default router