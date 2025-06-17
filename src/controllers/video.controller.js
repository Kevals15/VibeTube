import { Video } from "../models/video.models.js"
import { ApiError } from "../utils/ApiError.js";
import Apiresponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import { FileUploader } from "../utils/cloudinary.js";
import { Like } from "../models/like.models.js";

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
        .populate("owner", "avatar username")
        .exec()

    if (!video) {
        throw new ApiError(400, "video doesnt exist")
    }

    video.views += 1
    await video.save({
        validateBeforeSave: false
    })

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


const getAllVideos = asyncHandler(async (req, res) => {

    // Steps
    // 1. find the number of page you want to skip
    // 2. filter video based on query use title or description whatever you want
    // 3. if you want perticular users video so you can also give userid so it can search based on this
    // 4. if not query it shows all videos
    // 5. pass sorttype and sortby so we can sort by views likes and etc..
    // 6. if not anything passed it shows according latest video first
    // 7. after this mongoose knows 1 as ascending and -1 as desc
    // 8. after that find video based on filter sort on sortoption 


    const { page = 1, limit = 10, query, sortType, sortBy, userId } = req.query

    const skip = (Number(page) - 1) * Number(limit);

    const filter = {}

    if (query) {
        filter.title = { $regex: query, $options: "i" }
    }
    if (userId) {
        filter.owner = userId
    }

    const sortOption = {}

    if (sortBy) {
        sortOption[sortBy] = sortType === "asc" ? 1 : -1;
    } else {
        sortOption["createdAt"] = -1;
    }


    const findVideos = await Video
        .find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(Number(limit))
        .populate("owner", "username avatar")
        .lean()

    return res
        .status(200)
        .json(
            new Apiresponse(200, findVideos, "Videos fetched")
        )
})

export {
    PublishVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
    getAllVideos
}