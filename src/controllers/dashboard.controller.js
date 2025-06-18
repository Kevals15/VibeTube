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
                totalSubscribers
            }, "Channel Stats Fetched")
        )
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel'


    const { page = 1, limit = 10 } = req.query
    const userId = req.user?._id

    const skip = (Number(page) - 1) * Number(limit)

    if (!userId) {
        throw new ApiError(403, "Not authorized")
    }

    const totalVideos = await Video.countDocuments({
        owner: userId
    })

    const videos = await Video.find({
        owner: req.user?._id
    }).sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("owner", "username avatar")

    if (!videos || videos.length == 0) {
        throw new ApiError(400, "videos not found")
    }

    return res
        .status(200)
        .json(
            new Apiresponse(200, {
                totalVideos,
                currentpage: Number(page),
                totalPages: Math.ceil(totalVideos / limit),
                videos
            }, "videos fetched")
        )

})


export {
    getChannelStats,
    getChannelVideos
}