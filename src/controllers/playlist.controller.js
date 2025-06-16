import { Playlist } from "../models/playlist.models.js";
import { Video } from "../models/video.models.js";
import { ApiError } from "../utils/ApiError.js";
import Apiresponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    if (!name) {
        throw new ApiError(400, "playlist need name")
    }

    const playlist = await Playlist.create({
        name,
        description: description || "",
        owner: req.user?._id
    })

    return res
        .status(200)
        .json(
            new Apiresponse(200, playlist, "Playlist created")
        )
})

const addVideoInPlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    const { videoId } = req.body

    if (!videoId) {
        throw new ApiError(400, "video id is missing")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(400, "video is not found")
    }

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new ApiError(400, "playlist not found")
    }

    if (playlist.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "Not authorized to add video")
    }

    if (playlist.videos.some((v) => v.video.toString() == videoId)) {
        throw new ApiError(409, "video already exist")
    }

    await playlist.videos.push({
        video: videoId
    })
    await playlist.save()

    return res
        .status(200)
        .json(
            new Apiresponse(200, playlist, "Video added to playlist")
        )
})

export {
    createPlaylist,
    addVideoInPlaylist
}