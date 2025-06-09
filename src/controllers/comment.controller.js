import { Comment } from "../models/comment.models.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import Apiresponse from "../utils/ApiResponse.js"
import { Video } from "../models/video.models.js"

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

    if (!commentId) {
        throw new ApiError(400, "comment is not exist")
    }

    if (!content || content.trim() == "") {
        throw new ApiError(400, "content is empty or not provided")
    }

    const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        {
            $set: {
                content
            }
        },
        {
            new: true
        }
    )

    return res
        .status(200)
        .json(
            new Apiresponse(200, updatedComment, "Comment add to the video")
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


export {
    addComment,
    updateComment,
    deleteComment
}