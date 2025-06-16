import { Tweet } from "../models/tweet.models.js";
import { ApiError } from "../utils/ApiError.js";
import Apiresponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body

    if (!content) {
        throw new ApiError(400, "Please provide content for tweet")
    }

    const tweet = await Tweet.create({
        content: content,
        owner: req.user?._id
    })

    return res
        .status(200)
        .json(
            new Apiresponse(200, tweet, "Tweet is Created")
        )
})

const updateTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const { content } = req.body;

    if (!tweetId) {
        throw new ApiError(400, "TweetId is missing")
    }

    const tweet = await Tweet.findById(tweetId)

    if (!tweet) {
        throw new ApiError(400, "Tweet not found")
    }

    if (tweet.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "Not authorized to update Tweet")
    }

    const updatedTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set: {
                content: content,
            }
        },
        {
            new: true
        }
    )

    return res
        .status(200)
        .json(
            new Apiresponse(200, updatedTweet, "Tweet content Updated")
        )
})

const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    if (!tweetId) {
        throw new ApiError(400, "TweetId is missing")
    }

    const tweet = await Tweet.findById(tweetId)

    if (!tweet) {
        throw new ApiError(400, "Tweet Not Found")
    }

    if (tweet.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "Not Autorized to delete tweet")
    }

    await Tweet.deleteOne({ _id: tweetId })

    return res
        .status(200)
        .json(
            new Apiresponse(200, {}, "tweet deleted")
        )
})

const getUserTweets = asyncHandler(async (req, res) => {
    const { userId } = req.params
    const { page = 1, limit = 10 } = req.query

    if (!userId) {
        throw new ApiError(400, "userId is missing")
    }

    const skip = (Number(page) - 1) * Number(limit)

    const Usertweet = await Tweet.find({
        owner: userId
    })
        .skip(skip)
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate("owner", "username avatar")

    return res
        .status(200)
        .json(
            new Apiresponse(200, Usertweet, "User Tweet fetched")
        )

})

export {
    createTweet,
    updateTweet,
    deleteTweet,
    getUserTweets
}