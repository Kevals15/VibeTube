import { Like } from "../models/like.models.js"
import { Video } from "../models/video.models.js";
import { Comment } from "../models/comment.models.js";
import { ApiError } from "../utils/ApiError.js"
import Apiresponse from "../utils/ApiResponse.js";
import { Tweet } from "../models/tweet.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    // steps
    // 1. check videoId
    // 2. if provided then check if its valid or not
    // 3. after that check if exist like then delete otherwise add
    // 4. done

    if (!videoId) {
        throw new ApiError(400, "video id is not provided")
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(400, "video is not found")
    }

    const existinglikeonvideo = await Like.findOne(
        {
            video: videoId,
            likedBy: req.user?._id
        }
    )

    let liked;
    let like = null
    if (!existinglikeonvideo) {
        like = await Like.create(
            {
                video: videoId,
                likedBy: req.user?._id
            }
        )
        video.likes += 1
        liked = true;
    } else {
        await Like.deleteOne({
            _id: existinglikeonvideo?._id
        })
        video.likes = Math.max(0, video.likes - 1)
        liked = false;
    }

    await video.save({
        validateBeforeSave: false
    })

    const responseData = liked ? { liked, like } : { liked };


    return res
        .status(200)
        .json(
            new Apiresponse(200, responseData, liked ? "Video liked" : "Video unliked")
        )
})


const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    //TODO: toggle like on comment

    // Same like video
    if (!commentId) {
        throw new ApiError(400, "Comment id is missing")
    }

    const comment = await Comment.findById(commentId)

    if (!comment) {
        throw new ApiError(400, "comment not found")
    }

    const existlikeoncomment = await Like.findOne({
        comment: commentId,
        likedBy: req.user?._id
    })

    let liked;
    let like = null;

    if (existlikeoncomment) {
        await Like.deleteOne({ _id: existlikeoncomment?._id })
        comment.likes = Math.max(0, comment.likes - 1)
        liked = false;
    }
    else {
        like = await Like.create({
            comment: commentId,
            likedBy: req.user?._id
        })
        comment.likes += 1
        liked = true
    }

    await comment.save({ validateBeforeSave: false })

    const responseData = liked ? { liked, like } : { liked };

    return res
        .status(200)
        .json(
            new Apiresponse(200, responseData, liked ? "Comment Liked" : "Comment Unliked")
        );


})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    //TODO: toggle like on tweet

    // Same as Before

    if (!tweetId) {
        throw new ApiError(400, "TweetId is missing")
    }


    const tweet = await Tweet.findById(tweetId)

    if (!tweet) {
        throw new ApiError(400, "Tweet not found")
    }

    const existlikeontweet = await Like.findOne(
        {
            tweet: tweetId,
            likedBy: req.user?._id
        }
    )

    let liked, like = null;

    if (existlikeontweet) {
        await Like.deleteOne({ _id: existlikeontweet?._id })
        tweet.likes = Math.max(0, tweet.likes - 1)
        liked = false;
    }
    else {
        like = await Like.create({
            tweet: tweetId,
            likedBy: req.user?._id
        })
        tweet.likes += 1
        liked = true;
    }

    await tweet.save({ validateBeforeSave: false })

    const responseData = liked ? { liked, like } : { liked }

    return res.status(200)
        .json(
            new Apiresponse(200, responseData, liked ? "Tweet Liked" : "Tweet Unliked")
        )
})

const getAllLikedVideos = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(400, "Not Authorize Or User not found")
    }

    const likedVideos = await Like.find({
        likedBy: userId,
        video: {
            $ne: null
        }
    }).populate({
        path: "video",
        select: "thumbnail title owner",
        populate: {
            path: "owner",
            select: "avatar username"
        }

    })

    if (!likedVideos || likedVideos.length == 0) {
        throw new ApiError(400, "No video found")
    }

    return res
        .status(200)
        .json(
            new Apiresponse(200, likedVideos, "Liked videos found")
        )
})


export {
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
    getAllLikedVideos
}