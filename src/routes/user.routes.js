import { Router } from "express";
import registerUser from "../controllers/user.controller.js";

const router = Router();

// if request comes from post /users from app.js is the request is users/register it calls the function registerUser from controller user.controller.js
router.route("/register").post(registerUser);

export default router;