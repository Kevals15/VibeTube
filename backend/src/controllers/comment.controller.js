import { Comment } from "../models/comment.models.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import Apiresponse from "../utils/ApiResponse.js"
import { Video } from "../models/video.models.js"
import { compare } from "bcrypt";

const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { content } = req.body

    if (!videoId) {
        throw new ApiError(400, "Video is not exist")
    }

    const videoExists = await Video.findById(videoId)
    if (!videoExists) {
        throw new ApiError(400, "video is not exist")
    }

    if (!content || content.trim() == "") {
        throw new ApiError(400, "content is empty or not provided")
    }

    const comment = await Comment.create(
        {
            content,
            owner: req.user?._id,
            video: videoId
        }
    )

    return res
        .status(200)
        .json(
            new Apiresponse(200, comment, "Comment add to the video")
        )
})

const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    const { content } = req.body

    const comment = await Comment.findById(commentId)

    if (!comment) {
        throw new ApiError(400, "Comment does not exist")
    }

    if (comment.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "Not authorized to update this comment")
    }

    comment.content = content
    await comment.save()

    return res
        .status(200)
        .json(
            new Apiresponse(200, comment, "Comment updated")
        )
})

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params

    if (!commentId) {
        throw new ApiError(400, "comment is not exist")
    }


    const comment = await Comment.findById(commentId)

    if (!comment) {
        throw new ApiError(400, "comment is not exist")
    }

    if (comment.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "not authorized to delete comment")
    }

    await comment.deleteOne();


    return res
        .status(200)
        .json(
            new Apiresponse(200, {}, "Comment is deleted")
        )
})

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const { videoId } = req.params
    const { page = 1, limit = 10 } = req.query

    if (!videoId) {
        throw new ApiError(400, "Video id is missing")
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(400, "video not found")
    }

    const skip = (Number(page) - 1) * Number(limit)

    const comments = await Comment.find({ video: videoId })
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 })
        .populate("owner", "username avatar")

    const totalcomments = await Comment.countDocuments({ video: videoId })

    return res
        .status(200)
        .json(
            new Apiresponse(200, { comments, totalcomments }, "comments fetched")
        )

})



export {
    addComment,
    updateComment,
    deleteComment,
    getVideoComments
}