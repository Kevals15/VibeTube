import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { Video } from "../models/video.models.js";
import { ApiError } from "../utils/ApiError.js";
import { Subscription } from "../models/subscription.models.js";
import Apiresponse from "../utils/ApiResponse.js";
import mongoose from "mongoose";
const getChannelStats = asyncHandler(async (req, res) => {

    // Steps
    // 1. extract user for which you want stats
    // 2. check if user exist
    // 3. if exist get all videos
    // 4. calculate total views and likes

    const userId = req.user?._id

    const user = await User.findById(userId)

    if (!user) {
        throw new ApiError(400, "user not found")
    }

    const videos = await Video.aggregate([
        {
            $match: { owner: new mongoose.Types.ObjectId(userId) }
        },
        {
            $group: {
                _id: null,
                totalvideos: {
                    $sum: 1
                },
                totallikes: {
                    $sum: "$likes"
                },
                totalviews: {
                    $sum: "$views"
                }
            }
        }
    ])

    const stats = videos[0] || {
        totalvideos: 0,
        totallikes: 0,
        totalviews: 0
    }

    const totalSubscribers = await Subscription.countDocuments({
        channel: userId
    })


    return res
        .status(200)
        .json(
            new Apiresponse(200, {
                totalvideos: stats.totalvideos,
                totalviews: stats.totalviews,
                totallikes: stats.totallikes,
                totalSubscribers,
                channel: {
                    fullname: user.fullname,
                    username: user.username,
                    avatar: user.avatar,
                    coverImage: user.coverImage,
                }
            }, "Channel Stats Fetched")
        )
})

const getChannelVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query
    const userId = req.user?._id

    if (!userId) {
        throw new ApiError(403, "Not authorized")
    }

    const pageNum = Math.max(Number(page), 1)
    const limitNum = Math.max(Number(limit), 1)
    const skip = (pageNum - 1) * limitNum

    const totalVideos = await Video.countDocuments({ owner: userId })

    const videos = await Video.find({ owner: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .populate("owner", "username avatar")

    return res.status(200).json(
        new Apiresponse(200, {
            totalVideos,
            currentpage: pageNum,
            totalPages: Math.ceil(totalVideos / limitNum),
            videos
        }, videos.length ? "Videos fetched" : "No videos found for this channel")
    )
})



export {
    getChannelStats,
    getChannelVideos
}