import { Playlist } from "../models/playlist.models.js";
import { User } from "../models/user.models.js";
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
    const { playlistId, videoId } = req.params

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

const updatePlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body
    const { playlistId } = req.params;

    if (!name) {
        throw new ApiError(400, "name required to edit name for playlist")
    }

    if (!playlistId) {
        throw new ApiError(400, "playlist id is missing")
    }

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new ApiError(400, "playlist not found")
    }

    if (!playlist.owner.equals(req.user?._id)) {
        throw new ApiError(403, "Not authorized to update playlist content")
    }

    playlist.name = name
    playlist.description = description || ""
    await playlist.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(
            new Apiresponse(200, playlist, "playlist updated")
        )

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params

    if (!playlistId) {
        throw new ApiError(400, "playlist id is missing")
    }

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new ApiError(400, "playlist not found")
    }

    if (!playlist.owner.equals(req.user?._id)) {
        throw new ApiError(403, "Not authorized to delete playlist")
    }

    await Playlist.deleteOne({ _id: playlist._id })

    return res
        .status(200)
        .json(
            new Apiresponse(200, {}, "playlist delted")
        )

})

const deleteVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params

    if (!playlistId) {
        throw new ApiError(400, "playlist id is missing")
    }

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new ApiError(400, "playlist not found")
    }

    if (!videoId) {
        throw new ApiError(400, "videoId is missing")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(400, "video is not found in playlist")
    }

    // filterout videos except from params
    playlist.videos = playlist.videos.filter((item) => item.video.toString() !== videoId)
    await playlist.save();

    return res
        .status(200)
        .json(
            new Apiresponse(200, playlist, "video deleted from playlist")
        )
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params

    if (!playlistId) {
        throw new ApiError(400, "playlist id is missing")
    }

    const playlist = await Playlist.findById(playlistId)
        .populate("videos.video", "title description views thumbnail videofile likes createdAt updatedAt")
        .populate("owner", "username avatar");


    if (!playlist) {
        throw new ApiError(400, "playlist not found")
    }

    return res
        .status(200)
        .json(
            new Apiresponse(200, { playlist, totalvideos: playlist.videos.length }, "playlist fetched")
        )

})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params
    const { page = 1, limit = 10, search = "" } = req.query
    const skip = (Number(page) - 1) * Number(limit)

    if (!userId) {
        throw new ApiError(400, "userId is missing")
    }

    const user = await User.findById(userId)

    if (!user) {
        throw new ApiError(400, "user not found")
    }

    const searchregx = new RegExp(search, "i")
    const query = {
        owner: userId,
        $or: [
            { name: { $regex: searchregx } },
            { description: { $regex: searchregx } }
        ]
    }

    const count = await Playlist.countDocuments(query)
    const playlists = await Playlist.find(query)
        .skip(skip)
        .sort({ createdAt: -1 })
        .limit(limit)

    return res
        .status(200)
        .json(
            new Apiresponse(200,
                {
                    count,
                    page: Number(page),
                    limit: Number(limit),
                    totalPages: Math.ceil(count / limit),
                    playlists

                },
                "user Playlists fetched with search"
            )
        )
})

export {
    createPlaylist,
    addVideoInPlaylist,
    updatePlaylist,
    deletePlaylist,
    deleteVideoFromPlaylist,
    getPlaylistById,
    getUserPlaylists
}