import { Video } from "../models/video.models.js"
import { ApiError } from "../utils/ApiError.js";
import Apiresponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import { FileUploader } from "../utils/cloudinary.js";


const PublishVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    if (!title && !description) {
        throw new ApiError(400, "Title and description required")
    }
    const videoLocalpath = req.files?.videoFile[0].path;

    if (!videoLocalpath) {
        throw new ApiError(400, "video path is not exist")
    }

    const videoFile = await FileUploader(videoLocalpath)

    if (!videoFile) {
        throw new ApiError(400, "video file is missing")
    }

    const thumbnailLocalPath = req.files?.thumbnail[0].path;

    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail path is not exist")
    }

    const thumbnail = await FileUploader(thumbnailLocalPath)

    if (!thumbnail) {
        throw new ApiError(400, "Thumbnail is missing")
    }

    const video = await Video.create({
        title,
        description,
        duration: videoFile.duration,
        videofile: videoFile.url,
        thumbnail: thumbnail.url,
        owner: req.user?._id,
        ispublished: true
    })

    return res
        .status(200)
        .json(
            new Apiresponse(200, video, "Video Published")
        )
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    // findById takes only one argument that is Id

    // const video = await Video.findById({ _id: videoId, isPublished: true })

    // findOne(filter)
    // Use when: You want to find one document by any filter, including _id + other fields

    //find(filter)
    // Use when: You want to find multiple documents matching the condition. 

    const video = await Video.findOne({ _id: videoId, isPublished: true })
        // populate method takes argument first the field you want to populate in this case its owner field and second for which field you want to grab
        .populate("owner", "fullname avatar username")
        .exec()

    if (!video) {
        throw new ApiError(400, "video doesnt exist")
    }

    return res
        .status(200)
        .json(new Apiresponse(200, video, "Video fetched"))
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

    const { title, description } = req.body

    // here i can update single file thats why its req.file not files
    const thumbnailLocalpath = req.file?.path;

    if (!thumbnailLocalpath) {
        throw new ApiError(400, "thumbnail path is not provided")
    }

    const thumbnail = await FileUploader(thumbnailLocalpath)

    if (!thumbnail) {
        throw new ApiError(400, "thumbnail is missing")
    }

    const video = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                thumbnail: thumbnail.url,
                title,
                description
            }
        }, {
        new: true
    }
    )


    return res
        .status(200)
        .json(new Apiresponse(200, video, "video updated"))
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video

    const video = await Video.findByIdAndDelete(videoId).exec()


    if (!video) {
        throw new ApiError(400, "video doesnt exist")
    }

    return res
        .status(200)
        .json(new Apiresponse(200, video, "video deleted"))
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(400, "video is not found")
    }

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to modify this video");
    }

    video.isPublished = !video.isPublished
    await video.save({
        validateBeforeSave: false
    })



    return res
        .status(200)
        .json(new Apiresponse(200, video, "toggle video status"))
})

export {
    PublishVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}