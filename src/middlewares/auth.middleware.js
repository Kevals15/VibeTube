import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
export const verifyJWT = asyncHandler(async (req, res, next) => {
    // It may be possible that user can send a custom header if not accessToken
    try {
        const token = req.cookies?.accessToken || req.heaer("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(400, "Unauthorized request")
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken._id).select("-password -refreshToken")

        if (!user) {
            throw new ApiError(401, "Not Valid Token")
        }

        req.user = user
        next()

    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token")
    }
})